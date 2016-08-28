SL("components.collab").Collaboration = Class.extend({
    init: function (t) {
        this.options = $.extend({
            container: document.body,
            editor: false,
            fixed: false,
            coverPage: false
        }, t), this.loaded = new signals.Signal, this.enabled = new signals.Signal, this.expanded = new signals.Signal, this.collapsed = new signals.Signal, this.flags = {
            expanded: false,
            enabled: false,
            connected: false
        }, this.commentsWhileHidden = [], this.commentsWhileCollapsed = [], this.bind(), this.render(), this.setEnabled(!!SLConfig.deck.collaborative), this.options.fixed && (SL.util.skipCSSTransitions($(this.domElement), 1), this.domElement.addClass("fixed"), this.expand())
    }, bind: function () {
        this.onKeyDown = this.onKeyDown.bind(this), this.onSlideChanged = this.onSlideChanged.bind(this), this.onStreamMessage = this.onStreamMessage.bind(this), this.onStreamStatusChanged = this.onStreamStatusChanged.bind(this), this.onSocketReconnecting = this.onSocketReconnecting.bind(this);
        var t = $(".reveal .slides section:not(.stack)").length, e = 1e3 * Math.ceil(t / 4);
        this.onStreamDeckContentChanged = $.throttle(this.onStreamDeckContentChanged, e)
    }, render: function () {
        this.domElement = $('<div class="sl-collab loading">'), this.domElement.appendTo(this.options.container), this.options.coverPage && !this.options.fixed && (this.coverElement = $('<div class="sl-collab-cover">'), this.coverElement.on("vclick", this.collapse.bind(this)), this.coverElement.appendTo(this.domElement)), this.innerElement = $('<div class="sl-collab-inner">'), this.innerElement.appendTo(this.domElement), this.bodyElement = $('<div class="sl-collab-body">'), this.bodyElement.appendTo(this.innerElement), this.overlayElement = $('<div class="sl-collab-overlay">'), this.overlayElement.appendTo(this.innerElement), this.overlayContent = $('<div class="sl-collab-overlay-inner">'), this.overlayContent.appendTo(this.overlayElement), this.menu = new SL.components.collab.Menu(this), this.menu.appendTo(this.domElement)
    }, load: function () {
        this.usersCollection || (this.showLoadingOverlay(), this.usersCollection = new SL.collections.collab.DeckUsers, this.usersCollection.load().then(this.afterLoad.bind(this), function () {
            this.usersCollection = null, this.showErrorOverlay("Failed to load collaborators", this.load.bind(this))
        }.bind(this)))
    }, afterLoad: function () {
        return this.usersCollection.isEmpty() ? void this.showErrorOverlay("No collaborators found for this deck.") : (this.usersCollection.replaced.add(function () {
            this.cachedCurrentDeckUser = null
        }.bind(this)), void this.connect())
    }, connect: function () {
        return this.hasBoundStreamEvents || (this.hasBoundStreamEvents = true, SL.helpers.StreamEditor.singleton().statusChanged.add(this.onStreamStatusChanged), SL.helpers.StreamEditor.singleton().messageReceived.add(this.onStreamMessage), SL.helpers.StreamEditor.singleton().reconnecting.add(this.onSocketReconnecting)), this.isConnected() ? void 0 : (this.showLoadingOverlay(), SL.helpers.StreamEditor.singleton().connect().then(function () {
        }, function () {
            this.onSocketConnectionFailed()
        }.bind(this)))
    }, afterConnect: function () {
        this.isConnected() || (this.flags.connected = true, this.renderContent(), SL.activity.register(SL.config.COLLABORATION_IDLE_TIMEOUT, this.onUserActive.bind(this), this.onUserInactive.bind(this)), SL.visibility.changed.add(this.onVisibilityChanged.bind(this)), this.hideOverlay(), this.isEnabled() ? this.comments.focus() : (this.setEnabled(true), this.users.showInvitePrompt(this.menu.getPrimaryButton()), this.users.inviteSent.addOnce(this.expand.bind(this))), this.handover && this.handover.refresh(), this.isInEditor() && this.currentUserIsEditing() ? this.reloadCurrentUser().then(function () {
            this.currentUserIsEditing() ? this.finishLoading() : this.redirectToReview()
        }.bind(this), function () {
            this.finishLoading()
        }.bind(this)) : this.isInEditor() && !this.currentUserIsEditing() ? this.redirectToReview() : this.finishLoading())
    }, finishLoading: function () {
        this.domElement.removeClass("loading"), this.loaded.dispatch()
    }, reload: function () {
        this.isConnected() && (this.showLoadingOverlay("Reloading..."), this.usersCollection.load().then(function () {
            this.redirectToReviewUnlessEditor() === false && (this.users.renderUsers(), SL.helpers.StreamEditor.singleton().emit("broadcast-all-user-states"), this.comments && this.comments.reload(), this.handover && this.handover.refresh(), this.hideOverlay())
        }.bind(this), function () {
            this.showErrorOverlay("Failed to load collaborators", this.reload.bind(this))
        }.bind(this)))
    }, reloadCurrentUser: function () {
        return new Promise(function (t, e) {
            $.ajax({
                type: "GET",
                url: SL.config.AJAX_DECKUSER_READ(SL.current_deck.get("id"), SL.current_user.get("id")),
                context: this
            }).done(function (e) {
                var i = this.usersCollection.getByProperties({user_id: e.user_id});
                i && i.setAll(e), t()
            }).fail(e)
        }.bind(this))
    }, renderContent: function () {
        this.users = new SL.components.collab.Users(this, {users: this.usersCollection}), this.users.appendTo(this.menu.innerElement), this.comments = new SL.components.collab.Comments(this, {users: this.usersCollection}), this.comments.appendTo(this.bodyElement), this.notifications = new SL.components.collab.Notifications(this, {users: this.usersCollection}), this.notifications.appendTo(this.domElement), this.isInEditor() || (this.handover = new SL.components.collab.Handover(this, {users: this.usersCollection}), this.handover.appendTo(this.options.container))
    }, expand: function () {
        this.flags.expanded = true, this.domElement.addClass("expanded"), SL.keyboard.keydown(this.onKeyDown), this.expanded.dispatch()
    }, collapse: function () {
        this.options.fixed || (this.commentsWhileCollapsed.length = 0, this.flags.expanded = false, this.domElement.removeClass("expanded"), SL.keyboard.release(this.onKeyDown), this.collapsed.dispatch())
    }, toggle: function () {
        this.isExpanded() ? this.collapse() : this.expand()
    }, isExpanded: function () {
        return this.flags.expanded
    }, setEnabled: function (t) {
        this.flags.enabled = t, this.domElement.toggleClass("enabled", t), t ? (Reveal.addEventListener("slidechanged", this.onSlideChanged), this.enabled.dispatch()) : Reveal.removeEventListener("slidechanged", this.onSlideChanged)
    }, isEnabled: function () {
        return this.flags.enabled
    }, isConnected: function () {
        return this.flags.connected
    }, makeDeckCollaborative: function () {
        this.isEnabled() || $.ajax({
            type: "POST",
            url: SL.config.AJAX_MAKE_DECK_COLLABORATIVE(SL.current_deck.get("id")),
            context: this
        }).done(function () {
            SLConfig.deck.collaborative = true, this.load()
        }).fail(function () {
            this.showErrorOverlay("Failed to enable collaboration", this.makeDeckCollaborative.bind(this))
        })
    }, showHandoverRequestReceived: function (t) {
        var e = "handover-" + t.get("user_id"), i = $(["<div>", "<p><strong>" + t.get("username") + "</strong> would like to edit but only on person can edit at a time.</p>", '<button class="button half-width approve-button grey">Let them edit</button>', '<button class="button half-width deny-button outline">Dismiss</button>', "</div>"].join(""));
        i.find(".approve-button").on("vclick", function () {
            this.becomeEditor(t), this.notifications.hide(e)
        }.bind(this)), i.find(".deny-button").on("vclick", function () {
            SL.helpers.StreamEditor.singleton().broadcast({
                type: "collaboration:handover-denied",
                user_id: t.get("user_id"),
                denied_by_user_id: SL.current_user.get("id")
            }), this.notifications.hide(e)
        }.bind(this)), this.notifications.show(i, {id: e, optional: false, sender: t})
    }, 
    showHandoverRequestPending: function (t) {
        var e = "handover-pending";
        i = $(["<div>", "<p>You have asked to edit this deck. Waiting to hear back from <strong>" + t.getDisplayName() + "</strong>...</p>", '<button class="button outline cancel-button">Cancel</button>', "</div>"].join(""));
        i.find(".cancel-button").on("vclick", function (t) {
            t.preventDefault(), SL.helpers.StreamEditor.singleton().broadcast({
                type: "collaboration:handover-request-canceled",
                user_id: SL.current_user.get("id")
            }), this.notifications.hide(e)
        }.bind(this));
        this.notifications.show(i, {
            id: e,
            optional: false,
            icon: "i-question-mark"
        });
    }, showLoadingOverlay: function (t) {
        t = t || "Loading...", this.overlayElement.addClass("visible"), this.overlayContent.empty().html('<p class="message">' + t + "</p>"), this.flashOverlay()
    }, showErrorOverlay: function (t, e) {
        this.overlayElement.addClass("visible"), this.overlayContent.empty().html(['<div class="exclamation">!</div>', '<p class="message">' + t + "</p>", '<button class="button outline">Try again</button>'].join("")), this.overlayContent.find("button").on("vclick", e), this.flashOverlay()
    }, flashOverlay: function () {
        clearTimeout(this.flashOverlayTimeout), this.overlayContent.addClass("flash"), this.flashOverlayTimeout = setTimeout(function () {
            this.overlayContent.removeClass("flash")
        }.bind(this), 1e3)
    }, hideOverlay: function () {
        this.overlayElement.removeClass("visible")
    }, updatePageTitle: function () {
        var t = "";
        this.commentsWhileHidden.length && (t += "(" + this.commentsWhileHidden.length + ") "), t += this.isInEditor() ? "Edit: " : "Review: ", t += SL.current_deck.get("title"), document.title = t
    }, currentUserIsEditing: function () {
        var t = this.getCurrentDeckUser();
        return !(!t || !t.isEditing())
    }, getCurrentDeckUser: function () {
        return !this.cachedCurrentDeckUser && this.usersCollection && (this.cachedCurrentDeckUser = this.usersCollection.getByUserID(SL.current_user.get("id"))), this.cachedCurrentDeckUser
    }, getCollapsedWidth: function () {
        return 60
    }, becomeEditor: function (t) {
        return t = t || this.getCurrentDeckUser(), new Promise(function (e, i) {
            $.ajax({
                type: "POST",
                url: SL.config.AJAX_DECKUSER_BECOME_EDITOR(SL.current_deck.get("id"), t.get("user_id")),
                context: this
            }).done(function () {
                this.usersCollection.setEditing(t.get("user_id")), e(), this.currentUserIsEditing() ? this.redirectToEdit() : this.redirectToReview()
            }).fail(function () {
                SL.notify("Failed to change editors"), i()
            })
        }.bind(this))
    }, isInEditor: function () {
        return this.options.editor
    }, redirectToEdit: function () {
        this.isInEditor() || (SL.helpers.PageLoader.show({message: "Loading"}), window.location = SL.routes.DECK_EDIT(SL.current_deck.get("user").username, SL.current_deck.get("slug")))
    }, redirectToReview: function (t) {
        this.isInEditor() && (SL.helpers.PageLoader.show({message: t || "Loading"}), SL.view.redirect(SL.routes.DECK_REVIEW(SL.current_deck.get("user").username, SL.current_deck.get("slug")), true))
    }, redirectToReviewUnlessEditor: function () {
        if (this.isInEditor() && !this.currentUserIsEditing()) {
            var t = 5, e = "Someone else started editing.<br>Redirecting in " + t + " seconds...";
            return SL.helpers.PageLoader.show({message: e}), setTimeout(function () {
                this.redirectToReview(e)
            }.bind(this), 1e3 * t), true
        }
        return false
    }, onKeyDown: function (t) {
        return 27 === t.keyCode ? (this.collapse(), false) : true
    }, onSlideChanged: function (t) {
        var e = Reveal.getCurrentSlide().getAttribute("data-id");
        e && SL.helpers.StreamEditor.singleton().emit("slide-change", e), this.comments && this.isExpanded() && this.comments.onSlideChanged(t), this.users && this.users.layout()
    }, onStreamStatusChanged: function (t) {
        t === SL.helpers.StreamEditor.STATUS_CONNECTED ? this.onSocketConnected() : t === SL.helpers.StreamEditor.STATUS_DISCONNECTED ? this.onSocketDisconnected() : t === SL.helpers.StreamEditor.STATUS_RECONNECT_FAILED ? this.onSocketReconnectFailed() : t === SL.helpers.StreamEditor.STATUS_RECONNECTED && this.onSocketReconnected()
    }, onStreamMessage: function (t) {
        if (t) {
            var e = t.type.split(":")[0], i = t.type.split(":")[1];
            "collaboration" === e && ("comment-added" === i ? this.onStreamCommentAdded(t) : "comment-updated" === i ? this.onStreamCommentUpdated(t) : "comment-removed" === i ? this.onStreamCommentRemoved(t) : "user-typing" === i ? this.onStreamUserTyping(t) : "user-typing-stopped" === i ? this.onStreamUserTypingStopped(t) : "user-added" === i ? this.onStreamUserAdded(t) : "user-updated" === i ? this.onStreamUserUpdated(t) : "user-removed" === i ? this.onStreamUserRemoved(t) : "presence-changed" === i ? this.onStreamPresenceChanged(t) : "editor-changed" === i ? this.onStreamEditorChanged(t) : "handover-requested" === i ? this.onStreamHandoverRequested(t) : "handover-request-canceled" === i ? this.onStreamHandoverRequestCanceled(t) : "handover-denied" === i ? this.onStreamHandoverDenied(t) : "deck-content-changed" === i ? this.onStreamDeckContentChanged(t) : "deck-settings-changed" === i && this.onStreamDeckSettingsChanged(t)), this.redirectToReviewUnlessEditor()
        }
    }, onStreamCommentAdded: function (t) {
        this.comments.addCommentFromStream(t.comment) && (this.isExpanded() || (this.commentsWhileCollapsed.push(t.comment.id), this.menu.setUnreadComments(this.commentsWhileCollapsed.length)), SL.visibility.isHidden() && (this.commentsWhileHidden.push(t.comment.id), this.updatePageTitle()))
    }, onStreamCommentUpdated: function (t) {
        this.comments.updateCommentFromStream(t.comment)
    }, onStreamCommentRemoved: function (t) {
        this.comments.removeCommentFromStream(t.comment.id);
        var e = this.commentsWhileCollapsed.indexOf(t.comment.id);
        -1 !== e && (this.commentsWhileCollapsed.splice(e, 1), this.menu.setUnreadComments(this.commentsWhileCollapsed.length))
    }, onStreamUserTyping: function (t) {
        var e = this.usersCollection.getByProperties({user_id: t.user_id});
        e && (e.set("typing", true), this.comments.refreshTypingIndicators(), clearTimeout(e.typingTimeout), e.typingTimeout = setTimeout(function () {
            e.set("typing", false), this.comments.refreshTypingIndicators()
        }.bind(this), SL.config.COLLABORATION_RESET_WRITING_TIMEOUT))
    }, onStreamUserTypingStopped: function (t) {
        var e = this.usersCollection.getByProperties({user_id: t.user_id});
        e && (e.set("typing", false), this.comments.refreshTypingIndicators(), clearTimeout(e.typingTimeout))
    }, onStreamUserAdded: function (t) {
        this.users.addUserFromStream(t.user)
    }, onStreamUserUpdated: function (t) {
        var e = this.usersCollection.getByProperties({user_id: t.user.user_id});
        if (e) {
            var i = e.toJSON();
            e.setAll(t.user), i.active || e.get("active") !== true || this.users.renderUser(e), e.get("user_id") === SL.current_user.get("id") && (i.role !== e.get("role") && this.reload(), this.handover && this.handover.refresh())
        }
    }, onStreamUserRemoved: function (t) {
        if (t.user.user_id)if (t.user.user_id === SL.current_user.get("id")) {
            var e = 5, i = "You were removed from this deck.<br>Redirecting in " + e + " seconds...";
            SL.helpers.PageLoader.show({message: i}), setTimeout(function () {
                window.location = SL.routes.USER(SL.current_user.get("username"))
            }.bind(this), 1e3 * e)
        } else this.users.removeUserFromStream(t.user.user_id)
    }, onStreamPresenceChanged: function (t) {
        var e = this.usersCollection.getByProperties({user_id: t.user_id});
        e && (t.status && e.set("status", t.status), t.slide_id && e.set("slide_id", t.slide_id), this.users.refreshPresence(e), e.isOnline() === false && (e.get("typing") && (e.set("typing", false), this.comments.refreshTypingIndicators()), this.notifications.hide("handover-" + t.user_id), e.isEditing() && this.notifications.hide("handover-pending") && this.becomeEditor()), this.handover && this.handover.refresh())
    }, onStreamEditorChanged: function (t) {
        t.user.user_id && (this.usersCollection.setEditing(t.user.user_id), this.currentUserIsEditing() ? this.redirectToEdit() : this.redirectToReview())
    }, onStreamHandoverRequested: function (t) {
        if (this.currentUserIsEditing()) {
            var e = this.usersCollection.getByProperties({user_id: t.user_id});
            e && this.showHandoverRequestReceived(e)
        }
    }, onStreamHandoverRequestCanceled: function (t) {
        this.notifications.hide("handover-" + t.user_id)
    }, onStreamHandoverDenied: function (t) {
        if (SL.current_user.get("id") === t.user_id) {
            var e = this.usersCollection.getByProperties({user_id: t.denied_by_user_id});
            e && (this.notifications.hide("handover-pending"), this.notifications.show("<strong>" + e.getDisplayName() + "</strong> turned down your request to edit. Try again later.", {sender: e}))
        }
    }, onStreamDeckContentChanged: function () {
        this.isInEditor() || (this.reloadDeckContentXHR && this.reloadDeckContentXHR.abort(), this.reloadDeckContentXHR = $.ajax({
            url: SL.config.AJAX_GET_DECK_DATA(SL.current_deck.get("id")),
            type: "GET",
            context: this
        }).done(function (t) {
            var e = t.deck.data;
            this.isInEditor() ? SL.editor.controllers.Markup.replaceHTML(e) : SL.util.deck.replaceHTML(e), this.handover.refreshSlideNumbers(), this.comments.refreshSlideNumbers()
        }.bind(this)).always(function () {
            this.reloadDeckContentXHR = null
        }.bind(this)))
    }, onStreamDeckSettingsChanged: function () {
        this.isInEditor() || (this.reloadDeckSettingsXHR && this.reloadDeckSettingsXHR.abort(), this.reloadDeckSettingsXHR = $.ajax({
            url: SL.config.AJAX_GET_DECK(SL.current_deck.get("id")),
            type: "GET",
            context: this
        }).done(function (t) {
            var e = JSON.parse(JSON.stringify(SLConfig.deck));
            for (var i in t)"object" == typeof t[i] && delete t[i];
            $.extend(SLConfig.deck, t);
            var n = SL.models.Theme.fromDeck(SLConfig.deck);
            SL.helpers.ThemeController.paint(n, {center: false}), Reveal.configure({
                rtl: SLConfig.deck.rtl,
                loop: SLConfig.deck.should_loop,
                slideNumber: SLConfig.deck.slide_number
            }), SLConfig.deck.theme_id !== e.theme_id && console.warn("Theme changed!"), SLConfig.deck.slug !== e.slug && window.history && "function" == typeof window.history.replaceState && window.history.replaceState(null, SLConfig.deck.title, SL.routes.DECK_REVIEW(SLConfig.deck.user.username, SLConfig.deck.slug) + window.location.hash), SLConfig.deck.title !== e.title && this.updatePageTitle()
        }.bind(this)).always(function () {
            this.reloadDeckSettingsXHR = null
        }.bind(this)))
    }, onUserActive: function () {
        SL.helpers.StreamEditor.singleton().emit("active"), this.notifications.hide("editor-is-idle"), this.notifications.release(), $.post(SL.config.AJAX_DECKUSER_UPDATE_LAST_SEEN_AT(SL.current_deck.get("id")))
    }, onUserInactive: function () {
        SL.helpers.StreamEditor.singleton().emit("idle"), this.currentUserIsEditing() && this.usersCollection.hasMoreThanOnePresentEditor() && (this.notifications.show("You're idle. While away, collaborators are allowed to take over editing.", {
            id: "editor-is-idle",
            optional: false,
            icon: "i-clock"
        }), this.notifications.hold())
    }, onVisibilityChanged: function () {
        SL.visibility.isVisible() && (this.commentsWhileHidden.length = 0, this.updatePageTitle())
    }, onSocketConnectionFailed: function () {
        this.connectionError || (this.connectionError = new SL.components.RetryNotification('<strong>Sorry, we\u2019re having trouble connecting.</strong><br>If the problem persists, contact us <a href="http://help.slides.com" target="_blank">here</a>.', {type: "negative"}), this.connectionError.startCountdown(0), this.connectionError.destroyed.add(function () {
            this.connectionError = null
        }.bind(this)), this.connectionError.retryClicked.add(function () {
            this.connectionError.startCountdown(0), SL.helpers.StreamEditor.singleton().connect().then(SL.util.noop, SL.util.noop)
        }.bind(this)))
    }, onSocketConnected: function () {
        clearTimeout(this.disconnectTimeout), this.connectionError && this.connectionError.destroy(), this.connectionError && this.connectionError.hide(), this.domElement.removeClass("disconnected"), this.isConnected() ? this.reload() : this.afterConnect()
    }, onSocketDisconnected: function () {
        clearTimeout(this.disconnectTimeout), this.disconnectTimeout = setTimeout(function () {
            this.domElement.addClass("disconnected"), this.comments.blur(), this.users.dismissPrompts(), this.connectionError || (this.connectionError = new SL.components.RetryNotification("Lost connection to server", {type: "negative"}), this.connectionError.startCountdown(0), this.connectionError.destroyed.add(function () {
                this.connectionError = null
            }.bind(this)), this.connectionError.retryClicked.add(function () {
                this.connectionError.startCountdown(0), SL.helpers.StreamEditor.singleton().connect().then(SL.util.noop, SL.util.noop)
            }.bind(this)))
        }.bind(this), 6e3)
    }, onSocketReconnecting: function (t) {
        this.connectionError && this.connectionError.startCountdown(t)
    }, onSocketReconnectFailed: function () {
        this.connectionError && this.connectionError.disableCountdown()
    }, onSocketReconnected: function () {
        clearTimeout(this.disconnectTimeout)
    }, destroy: function () {
        this.menu && this.menu.destroy(), this.users && this.users.destroy(), this.comments && this.comments.destroy(), this.handover && this.handover.destroy(), this.options = null, this.domElement.remove()
    }
});