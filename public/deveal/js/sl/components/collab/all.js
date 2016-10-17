SL("components.collab").CommentThread = Class.extend({
    init: function (t, e) {
        this.id = t, this.options = e, this.comments = new SL.collections.collab.Comments, this.strings = {
            loadMoreComments: "Load older comments",
            loadingMoreComments: "Loading..."
        }, this.render(), this.bind()
    }, render: function () {
        this.domElement = $('<div class="sl-collab-comment-thread empty"></div>'), this.domElement.attr("data-thread-id", this.id), this.domElement.data("thread", this), this.loadMoreButton = $('<button class="load-more-button">' + this.strings.loadMoreComments + "</button>"), this.loadMoreButton.on("vclick", this.onLoadMoreClicked.bind(this)), this.loadMoreButton.appendTo(this.domElement)
    }, renderComment: function (t, e) {
        if (e = e || {}, !t.rendered) {
            t.rendered = true;
            var i = this.options.users.getByUserID(t.get("user_id"));
            "undefined" == typeof i && (i = new SL.models.collab.DeckUser({username: "unknown"}));
            var n = moment(t.get("created_at")), s = n.format("h:mm A"), o = n.format("MMM Do") + " at " + n.format("h:mm:ss A"), a = $(['<div class="sl-collab-comment">', '<div class="comment-sidebar">', '<div class="avatar" style="background-image: url(\'' + i.get("thumbnail_url") + "')\" />", "</div>", '<div class="comment-body">', '<span class="author">' + (i ? i.get("username") : "N/A") + "</span>", '<div class="meta">', '<span class="meta-time" data-tooltip="' + o + '">' + s + "</span>", "</div>", '<p class="message"></p>', "</div>", "</div>"].join(""));
            a.data("model", t), this.refreshComment(a), this.refreshSlideNumber(a), SL.util.device.IS_PHONE || SL.util.device.IS_TABLET || this.renderCommentOptions(a, t), t.stateChanged.add(this.onCommentStateChanged.bind(this, a)), e.prepend ? this.domElement.prepend(a) : this.domElement.append(a), this.checkOverflow()
        }
    }, renderCommentOptions: function (t, e) {
        var i = this.getCommentPrivileges(e);
        if (i.canDelete || i.canEdit) {
            var n = $('<button class="button options-button icon disable-when-disconnected"></button>').appendTo(t.find(".comment-sidebar"));
            i.canDelete && i.canEdit ? (n.addClass("i-cog"), n.on("click", this.onCommentOptionsClicked.bind(this, t))) : i.canDelete ? (n.addClass("i-trash-stroke"), n.on("click", this.onDeleteComment.bind(this, t))) : i.canEdit && (n.addClass("i-i-pen-alt2"), n.on("click", this.onEditComment.bind(this, t)))
        }
    }, refreshComment: function (t) {
        if (t) {
            var e = t.data("model");
            e && (t.find(".message").text(e.get("message")), t.attr("data-id", e.get("id")), t.attr("data-state", e.getState()))
        }
    }, refreshCommentByID: function (t) {
        this.refreshComment(this.getCommentByID(t))
    }, refreshSlideNumbers: function () {
        this.options.slideNumbers && this.domElement.find(".sl-collab-comment").each(function (t, e) {
            this.refreshSlideNumber($(e))
        }.bind(this))
    }, refreshSlideNumber: function (t) {
        if (this.options.slideNumbers) {
            var e = SL.util.deck.getSlideNumber(t.data("model").get("slide_hash"));
            if (e) {
                var i = "slide " + e, n = t.find(".meta-slide-number");
                n.length ? n.text(i) : t.find(".meta").prepend('<button class="meta-slide-number" data-tooltip="Click to view slide">' + i + "</button>")
            } else t.find(".meta-slide-number").remove()
        }
    }, appendTo: function (t) {
        this.domElement.appendTo(t)
    }, bind: function () {
        this.comments.loadStarted.add(this.onLoadStarted.bind(this)), this.comments.loadCompleted.add(this.onLoadCompleted.bind(this)), this.comments.loadFailed.add(this.onLoadFailed.bind(this)), this.comments.changed.add(this.onCommentsChanged.bind(this)), this.viewSlideCommentsClicked = new signals.Signal, this.layout = this.layout.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.domElement.delegate(".meta-slide-number", "vclick", this.onSlideNumberClicked.bind(this)), SL.util.dom.preventTouchOverflowScrolling(this.domElement)
    }, show: function (t) {
        t = t || {}, this.getID() === SL.components.collab.Comments.DECK_THREAD ? this.comments.isLoaded() || this.comments.isLoading() ? (this.refresh(), this.scrollToLatestComment()) : this.load() : this.load(t.slide_hash || Reveal.getCurrentSlide().getAttribute("data-id")), $(window).on("resize", this.onWindowResize)
    }, hide: function () {
        $(window).off("resize", this.onWindowResize)
    }, load: function (t) {
        var e = SL.config.AJAX_COMMENTS_LIST(SL.current_deck.get("id"), t);
        this.slideHash = t, this.domElement.find(".sl-collab-comment").remove(), this.comments.unload(), this.domElement.addClass("empty"), this.comments.load(e).then(SL.util.noop, SL.util.noop)
    }, reload: function () {
        this.getID() === SL.components.collab.Comments.DECK_THREAD ? this.load() : this.load(this.slideHash || Reveal.getCurrentSlide().getAttribute("data-id"))
    }, refresh: function () {
        this.checkIfEmpty(), this.checkOverflow(), this.checkPagination()
    }, layout: function () {
        this.checkOverflow()
    }, checkIfEmpty: function () {
        if (this.comments.isLoaded())if (this.comments.isEmpty()) {
            var t = this.getID() === SL.components.collab.Comments.SLIDE_THREAD ? "No comments on this slide" : "Nothing here yet.<br>Be the first to comment.";
            this.getPlaceholder().html('<div class="icon i-comment-stroke"></div><p>' + t + "</p>")
        } else this.hidePlaceholder(), this.domElement.removeClass("empty")
    }, checkPagination: function () {
        this.loadMoreButton.toggleClass("visible", !this.comments.isLoading() && this.comments.isLoaded() && this.comments.hasNextPage())
    }, checkOverflow: function () {
        this.domElement.toggleClass("overflowing", this.domElement.prop("scrollHeight") > this.domElement.prop("offsetHeight"))
    }, hidePlaceholder: function () {
        this.placeholder && (this.placeholder.remove(), this.placeholder = null)
    }, getCommentPrivileges: function (t) {
        var e = {
            canEdit: false,
            canDelete: false
        }, i = this.options.users.getByUserID(SL.current_user.get("id")), n = this.options.users.getByUserID(t.get("user_id"));
        if (n && i) {
            var s = i.get("user_id") === n.get("user_id"), o = i.get("role") === SL.models.collab.DeckUser.ROLE_ADMIN || i.get("role") === SL.models.collab.DeckUser.ROLE_OWNER;
            s ? (e.canEdit = true, e.canDelete = true) : o && (e.canDelete = true)
        }
        return e
    }, scrollToLatestComment: function () {
        this.domElement.scrollTop(this.domElement.prop("scrollHeight"))
    }, scrollToLatestCommentUnlessScrolled: function () {
        return this.getScrollOffset() < 600 ? (this.scrollToLatestComment(), true) : false
    }, commentExists: function (t) {
        return this.getComments().getByID(t.id) ? true : SL.current_user.get("id") === t.user_id ? this.getTemporaryComments().some(function (e) {
            return e.get("user_id") === t.user_id && e.get("message") === t.message
        }) : false
    }, getScrollOffset: function () {
        var t = this.domElement.get(0);
        return t.scrollHeight - t.offsetHeight - t.scrollTop
    }, getPlaceholder: function () {
        return this.placeholder || (this.placeholder = $('<div class="placeholder">'), this.placeholder.appendTo(this.domElement)), this.placeholder
    }, getComments: function () {
        return this.comments
    }, getTemporaryComments: function () {
        return this.comments.filter(function (t) {
            return !t.has("id")
        })
    }, getCommentByID: function (t) {
        return this.domElement.find('.sl-collab-comment[data-id="' + t + '"]')
    }, getSlideHash: function () {
        return this.slideHash
    }, getID: function () {
        return this.id
    }, onLoadStarted: function () {
        this.getPlaceholder().html('<div class="spinner centered" data-spinner-color="#999"></div>'), SL.util.html.generateSpinners()
    }, onLoadCompleted: function () {
        this.comments.forEach(this.renderComment.bind(this)), this.refresh(), this.scrollToLatestComment()
    }, onLoadFailed: function () {
        this.getPlaceholder().html('<p class="error">Failed to load comments.</p>')
    }, onWindowResize: function () {
        this.scrollToLatestComment(), this.layout()
    }, onCommentsChanged: function (t, e) {
        t && t.length && t.forEach(this.renderComment.bind(this)), e && e.length && e.forEach(function (t) {
            this.getCommentByID(t.get("id")).remove()
        }.bind(this)), this.refresh()
    }, onCommentStateChanged: function (t, e) {
        var i = e.getState();
        t.attr("data-id", e.get("id")), t.attr("data-state", i), i === SL.models.collab.Comment.STATE_FAILED ? 0 === t.find(".retry").length && (t.append(['<div class="retry">', '<span class="retry-info">Failed to send</span>', '<button class="button outline retry-button">Retry</button>', "</div>"].join("")), t.find(".retry-button").on("click", function () {
            this.comments.retryCreate(e)
        }.bind(this)), this.scrollToLatestCommentUnlessScrolled()) : t.find(".retry").remove()
    }, onCommentOptionsClicked: function (t) {
        var e = new SL.components.Menu({
            anchor: t.find(".options-button"),
            anchorSpacing: 15,
            alignment: "l",
            destroyOnHide: true,
            options: [{
                label: "Edit",
                icon: "pen-alt2",
                callback: this.onEditComment.bind(this, t)
            }, {
                label: "Delete",
                icon: "trash-fill",
                callback: this.onDeleteComment.bind(this, t)
            }]
        });
        e.show()
    }, onEditComment: function (t) {
        var e = t.data("model"), i = SL.prompt({
            anchor: t.find(".options-button"),
            alignment: "l",
            title: "Edit comment",
            type: "input",
            confirmLabel: "Save",
            data: {value: e.get("message"), placeholder: "Comment...", multiline: true}
        });
        i.confirmed.add(function (i) {
            "string" == typeof i && i.trim().length > 0 && (e.set("message", i), e.save(["message"]).done(this.refreshComment.bind(this, t)))
        }.bind(this))
    }, onDeleteComment: function (t) {
        var e = t.data("model");
        SL.prompt({
            anchor: t.find(".options-button"),
            alignment: "l",
            title: "Are you sure you want to delete this comment?",
            type: "select",
            data: [{html: "<h3>Cancel</h3>"}, {
                html: "<h3>Delete</h3>",
                selected: true,
                className: "negative",
                callback: function () {
                    this.comments.remove(e), e.destroy()
                }.bind(this)
            }]
        })
    }, onLoadMoreClicked: function () {
        this.loadMoreButton.prop("disabled", true).text(this.strings.loadingMoreComments), this.comments.loadNextPage().then(function (t) {
            var e = this.domElement.scrollTop(), i = this.domElement.prop("scrollHeight");
            t.reverse().forEach(function (t) {
                this.renderComment(t, {prepend: true})
            }.bind(this));
            var n = this.domElement.prop("scrollHeight");
            this.domElement.scrollTop(n - i + e), this.checkPagination()
        }.bind(this)).catch(function () {
            SL.notify("Failed to load comments", "negative")
        }.bind(this)).then(function () {
            this.loadMoreButton.prop("disabled", false).text(this.strings.loadMoreComments), this.loadMoreButton.prependTo(this.domElement)
        }.bind(this))
    }, onSlideNumberClicked: function (t) {
        var e = $(t.target).closest(".sl-collab-comment");
        e.length && e.data("model") && this.viewSlideCommentsClicked.dispatch(e.data("model").get("slide_hash"))
    }, destroy: function () {
        this.viewSlideCommentsClicked.dispose(), this.domElement.remove()
    }
});

SL("components.collab").Comments = Class.extend({
        init: function (t, e) {
            this.controller = t, this.options = e, this.render(), this.bind(), this.getCurrentThread() || this.showThread(SL.components.collab.Comments.DECK_THREAD), this.refreshCommentInput(), this.refreshCurrentSlide(), this.getCurrentThread().scrollToLatestComment(), this.layout()
        }, render: function () {
            this.domElement = $('<div class="sl-collab-page sl-collab-comments"></div>'), this.renderHeader(), this.bodyElement = $('<div class="sl-collab-page-body sl-collab-comments-body">'), this.bodyElement.appendTo(this.domElement), this.footerElement = $('<footer class="sl-collab-page-footer">'), this.footerElement.appendTo(this.domElement), this.renderThreads(), this.renderCommentForm()
        }, renderHeader: function () {
            this.headerElement = $('<header class="sl-collab-page-header sl-collab-comments-header"></header>'), this.headerElement.appendTo(this.domElement), this.headerElement.html(['<div class="header-tab selected" data-thread-id="deck">All comments</div>', '<div class="header-tab header-tab-slide" data-thread-id="slide">Current slide</div>'].join("")), this.headerElement.find(".header-tab").on("vclick", function (t) {
                this.showThread($(t.currentTarget).attr("data-thread-id")), SL.util.device.IS_PHONE || SL.util.device.IS_TABLET || this.commentInput.focus()
            }.bind(this))
        }, renderThreads: function () {
            this.threads = {}, this.threads.deck = new SL.components.collab.CommentThread(SL.components.collab.Comments.DECK_THREAD, {
                users: this.options.users,
                slideNumbers: true
            }), this.threads.deck.viewSlideCommentsClicked.add(this.onViewSlideCommentsClicked.bind(this)), this.threads.deck.appendTo(this.bodyElement), this.threads.slide = new SL.components.collab.CommentThread(SL.components.collab.Comments.SLIDE_THREAD, {users: this.options.users}), this.threads.slide.appendTo(this.bodyElement)
        }, renderCommentForm: function () {
            this.commentForm = $('<form action="#" class="sl-collab-comment-form sl-form disable-when-disconnected" novalidate>'), this.commentForm.on("submit", this.onCommentSubmit.bind(this)), this.commentInput = $(SL.util.device.IS_PHONE || SL.util.device.IS_TABLET ? '<input type="text" autocapitalize="sentences" class="comment-input" placeholder="Add a comment..." required maxlength="' + SL.config.COLLABORATION_COMMENT_MAXLENGTH + '" />' : '<textarea class="comment-input" placeholder="Add a comment..." required maxlength="' + SL.config.COLLABORATION_COMMENT_MAXLENGTH + '"></textarea>'), this.commentInput.on("keydown", this.onCommentKeyDown.bind(this)), this.commentInput.on("input", this.onCommentChanged.bind(this)), this.commentInput.on("focus", this.onCommentInputFocus.bind(this)), this.commentInput.appendTo(this.commentForm), this.commentInputFooter = $('<div class="comment-footer"></div>'), this.commentInputFooter.appendTo(this.commentForm), this.commentTyping = $('<div class="comment-typing"></div>'), this.commentTyping.appendTo(this.commentInputFooter), this.commentSubmitButton = $('<input class="comment-submit" type="submit" value="Send" />'), this.commentSubmitButton.on("vclick", this.submitComment.bind(this)), this.commentSubmitButton.appendTo(this.commentInputFooter), this.commentInputFooter.append('<div class="clear"></div>'), this.commentForm.appendTo(this.footerElement)
        }, bind: function () {
            this.layout = this.layout.bind(this), this.startTyping = this.startTyping.bind(this), this.stopTyping = this.stopTyping.bind(this), $(window).on("resize", this.layout), this.controller.expanded.add(this.onCollaborationExpanded.bind(this)), this.controller.isInEditor() && SL.editor.controllers.Markup.slidesChanged.add(this.refreshSlideNumbers.bind(this))
        }, appendTo: function (t) {
            this.domElement.appendTo(t)
        }, layout: function () {
            this.checkOverflow()
        }, reload: function () {
            this.threads.deck.reload();
            var t = this.getCurrentThread();
            t && t.getID() === SL.components.collab.Comments.SLIDE_THREAD && t.reload()
        }, focus: function () {
            this.commentInput.focus()
        }, blur: function () {
            this.commentInput.blur()
        }, checkOverflow: function () {
            this.domElement.toggleClass("overflowing", this.bodyElement.prop("scrollHeight") > this.bodyElement.prop("offsetHeight"))
        }, showCommentNotification: function (t) {
            var e = this.options.users.getByUserID(t.get("user_id"));
            if (e && e.get("user_id") !== SL.current_user.get("id")) {
                var i = "<strong>" + e.getDisplayName() + "</strong>", n = SL.util.deck.getSlideNumber(t.get("slide_hash"));
                n && (i += '<span class="slide-number">slide ' + n + "</span>"), i += "<br>" + t.get("message"), this.controller.notifications.show(i, {
                    sender: e,
                    callback: function () {
                        this.showSlideComments(t.get("slide_hash")), this.commentInput.focus()
                    }.bind(this)
                })
            }
        }, showSlideComments: function (t) {
            this.controller.isExpanded() === false && this.controller.expand();
            var e = $('.reveal .slides section[data-id="' + t + '"]').get(0);
            SL.util.deck.navigateToSlide(e);
            var i = this.getCurrentThread();
            i && i.getID() !== SL.components.collab.Comments.SLIDE_THREAD && (this.showThread(SL.components.collab.Comments.SLIDE_THREAD, {slide_hash: t}), SL.util.device.IS_PHONE || SL.util.device.IS_TABLET || this.commentInput.focus())
        }, showThread: function (t, e) {
            var i = this.getCurrentThread(), n = this.bodyElement.find('[data-thread-id="' + t + '"]'), s = n.data("thread");
            s && (i && i !== s && i.hide(), this.bodyElement.find(".sl-collab-comment-thread").removeClass("visible"), n.addClass("visible"), this.headerElement.find(".header-tab").removeClass("selected"), this.headerElement.find('.header-tab[data-thread-id="' + t + '"]').addClass("selected"), s.show(e))
        }, getCurrentThread: function () {
            return this.domElement.find(".sl-collab-comment-thread.visible").data("thread")
        }, addCommentFromStream: function (t) {
            if (t.id || console.warn("Can not insert comment without ID"), !this.threads.deck.commentExists(t)) {
                var e = this.controller.isExpanded(), i = this.threads.deck.getComments().createModel(t), n = false;
                return this.getCurrentThread().getID() === SL.components.collab.Comments.DECK_THREAD ? n = this.threads.deck.scrollToLatestCommentUnlessScrolled() : this.getCurrentThread().getID() === SL.components.collab.Comments.SLIDE_THREAD && t.slide_hash && t.slide_hash === this.getCurrentThread().getSlideHash() && !this.getCurrentThread().commentExists(t) && (this.threads.slide.getComments().createModel(t), n = this.threads.slide.scrollToLatestCommentUnlessScrolled()), e && n || this.showCommentNotification(i), true
            }
            return false
        }, updateCommentFromStream: function (t) {
            t.id || console.warn("Can not update comment without ID");
            var e = this.threads.deck.getComments().getByID(t.id);
            if (e) {
                for (var i in t)e.set(i, t[i]);
                this.threads.deck.refreshCommentByID(e.get("id")), this.getCurrentThread().getID() === SL.components.collab.Comments.SLIDE_THREAD && this.threads.slide.refreshCommentByID(e.get("id"))
            }
        }, removeCommentFromStream: function (t) {
            return this.threads.deck.getComments().removeByProperties({id: t})
        }, refreshCommentInput: function () {
            this.commentInput.attr("rows", 2);
            var t = Math.ceil(parseFloat(this.commentInput.css("line-height"))), e = this.commentInput.prop("scrollHeight"), i = this.commentInput.prop("clientHeight"), n = 10;
            e > i && this.commentInput.attr("rows", Math.min(Math.floor(e / t), n)), this.getCurrentThread().scrollToLatestCommentUnlessScrolled(t * n)
        }, refreshTyping: function () {
            var t = this.commentInput.val();
            t ? this.startTyping() : this.stopTyping()
        }, startTyping: function () {
            var t = Date.now();
            this.typing = true, (!this.lastTypingEvent || t - this.lastTypingEvent > SL.config.COLLABORATION_SEND_WRITING_INTERVAL) && (this.lastTypingEvent = t, SL.helpers.StreamEditor.singleton().broadcast({
                type: "collaboration:user-typing",
                user_id: SL.current_user.get("id")
            }))
        }, stopTyping: function () {
            this.typing && (this.typing = false, this.lastTypingEvent = null, SL.helpers.StreamEditor.singleton().broadcast({
                type: "collaboration:user-typing-stopped",
                user_id: SL.current_user.get("id")
            }))
        }, refreshTypingIndicators: function () {
            var t = this.options.users.filter(function (t) {
                return t.get("typing") === true
            });
            0 === t.length ? this.commentTyping.empty().removeAttr("data-tooltip") : 1 === t.length ? this.commentTyping.html("<strong>" + t[0].getDisplayName() + "</strong> is typing").removeAttr("data-tooltip") : t.length > 1 && (this.commentTyping.html("<strong>" + t.length + " people</strong> are typing"), this.commentTyping.attr("data-tooltip", t.map(function (t) {
                return t.getDisplayName()
            }).join("<br>")))
        }, refreshCurrentSlide: function () {
            var t = this.getCurrentThread();
            t && t.getID() === SL.components.collab.Comments.SLIDE_THREAD && this.showThread(SL.components.collab.Comments.SLIDE_THREAD, {slide_hash: Reveal.getCurrentSlide().getAttribute("data-id")});
            var e = SL.util.deck.getSlideNumber(Reveal.getCurrentSlide());
            e && this.headerElement.find(".header-tab-slide").text("Slide " + e)
        }, refreshSlideNumbers: function () {
            this.threads.deck.refreshSlideNumbers()
        }, submitComment: function () {
            var t = this.commentInput.val();
            t = t.trim(), t = t.replace(/(\n|\r){3,}/gim, "\n\n"), t.length && (this.getCurrentThread().getComments().create({
                comment: {
                    slide_hash: Reveal.getCurrentSlide().getAttribute("data-id"),
                    message: t,
                    user_id: SL.current_user.get("id"),
                    created_at: Date.now()
                }
            }), this.commentInput.val(""), this.stopTyping(), this.refreshCommentInput(), this.getCurrentThread().scrollToLatestComment())
        }, onCommentSubmit: function (t) {
            this.submitComment(), t.preventDefault()
        }, onCommentKeyDown: function (t) {
            13 !== t.keyCode || t.shiftKey || (this.submitComment(), t.preventDefault(), t.stopPropagation())
        }, onCommentChanged: function () {
            this.refreshCommentInput(), this.refreshTyping()
        }, onCommentInputFocus: function () {
            this.refreshTyping()
        }, onViewSlideCommentsClicked: function (t) {
            this.showSlideComments(t)
        }, onSlideChanged: function () {
            this.refreshCurrentSlide()
        }, onCollaborationExpanded: function () {
            this.refreshCurrentSlide(), setTimeout(this.focus.bind(this), 100)
        }, destroy: function () {
            this.threads.deck.destroy(), this.threads.slide.destroy(), this.options = null, this.domElement.remove()
        }
    });

SL.components.collab.Comments.DECK_THREAD = "deck";
SL.components.collab.Comments.SLIDE_THREAD = "slide";

SL("components.collab").Handover = Class.extend({
    init: function (t, e) {
        this.controller = t, this.options = e, this.render(), this.bind()
    }, render: function () {
        this.domElement = $('<div class="sl-collab-handover">'), this.editButtonWrapper = $('<div class="edit-button-wrapper">').appendTo(this.domElement), this.editButton = $('<div class="edit-button">'), this.editButton.append('<span class="label">Edit </span><span class="icon i-pen-alt2"></span>'), this.editButton.appendTo(this.editButtonWrapper), this.user = $('<div class="user"></div>'), this.userAvatar = $('<div class="user-avatar"></div>').appendTo(this.user), this.userDescription = $('<div class="user-description"></div>').appendTo(this.user), this.userStatus = $('<div class="user-status"></div>').appendTo(this.userDescription), this.userSlide = $('<div class="user-slide"></div>').appendTo(this.userDescription)
    }, appendTo: function (t) {
        this.domElement.appendTo(t)
    }, bind: function () {
        this.editButtonWrapper.on("vclick", this.onEditClicked.bind(this))
    }, refresh: function () {
        this.controller.getCurrentDeckUser().isEditing() || !this.controller.getCurrentDeckUser().canEdit() ? (this.editButtonWrapper.removeClass("visible"), this.editButtonWrapper.removeAttr("data-tooltip"), this.user.remove()) : (this.editButtonWrapper.addClass("visible"), this.currentEditor = this.options.users.getByProperties({editing: true}), this.currentEditor && this.currentEditor.isOnline() ? (this.currentAvatarURL !== this.currentEditor.get("thumbnail_url") && (this.currentAvatarURL = this.currentEditor.get("thumbnail_url"), this.userAvatar.css("background-image", 'url("' + this.currentAvatarURL + '")')), 0 === this.user.parent().length && this.user.appendTo(this.editButtonWrapper), this.refreshSlideNumbers(), this.currentEditor.isIdle() ? (this.editButtonWrapper.attr("data-tooltip", "<strong>" + this.currentEditor.get("username") + "</strong> is editing but has been idle for a while.<br>Click to start editing."), this.userStatus.html('<span class="username">' + this.currentEditor.get("username") + "</span> is idle"), this.user.addClass("idle")) : (this.editButtonWrapper.attr("data-tooltip", "Ask <strong>" + this.currentEditor.get("username") + "</strong> to make you the active editor"), this.userStatus.html('<span class="username">' + this.currentEditor.get("username") + "</span> is editing"), this.user.removeClass("idle"))) : (this.user.remove(), this.editButtonWrapper.removeAttr("data-tooltip")))
    }, refreshSlideNumbers: function () {
        if (this.currentEditor) {
            var t = SL.util.deck.getSlideNumber(this.currentEditor.get("slide_id"));
            t ? this.userSlide.addClass("visible").html("slide " + t).data("data-slide-id", this.currentEditor.get("slide_id")).attr("data-tooltip", "Click to view slide") : this.userSlide.removeClass("visible")
        }
    }, onEditClicked: function (t) {
        if ($(t.target).closest(".user-slide").length) {
            var e = this.userSlide.data("data-slide-id"), i = $('.reveal .slides section[data-id="' + e + '"]').get(0);
            i && SL.util.deck.navigateToSlide(i)
        } else if (!this.controller.getCurrentDeckUser().isEditing()) {
            var n = this.options.users.getByProperties({editing: true});
            n && n.isOnline() && !n.isIdle() ? (SL.helpers.StreamEditor.singleton().broadcast({
                type: "collaboration:handover-requested",
                user_id: SL.current_user.get("id")
            }), this.controller.showHandoverRequestPending(n)) : this.controller.becomeEditor()
        }
    }, destroy: function () {
        this.domElement.remove()
    }
});

SL("components.collab").Menu = Class.extend({
        init: function (t, e) {
            this.controller = t, this.options = e, this.render(), this.bind()
        }, render: function () {
            this.domElement = $('<div class="sl-collab-menu">'), this.innerElement = $('<div class="sl-collab-menu-inner">'), this.innerElement.appendTo(this.domElement), this.renderProfile()
        }, renderProfile: function () {
            this.enableButton = $('<div class="sl-collab-menu-item sl-collab-menu-enable ladda-button" data-style="zoom-in" data-spinner-color="#444" data-tooltip="Add a collaborator" data-tooltip-alignment="l">'), this.enableButton.append('<span class="users-icon icon i-users"></span>'), this.enableButton.appendTo(this.innerElement), this.toggleButton = $('<div class="sl-collab-menu-item sl-collab-menu-toggle">'), this.toggleButton.append('<div class="users-icon icon i-users"></div>'), this.toggleButton.append('<div class="close-icon icon i-x"></div>'), this.toggleButton.appendTo(this.innerElement), this.unreadComments = $('<div class="unread-comments" data-tooltip="Unread comments" data-tooltip-alignment="l">'), this.unreadComments.appendTo(this.toggleButton)
        }, appendTo: function (t) {
            this.domElement.appendTo(t)
        }, bind: function () {
            this.onEnableClicked = this.onEnableClicked.bind(this), this.onToggleClicked = this.onToggleClicked.bind(this), this.enableButton.on("vclick", this.onEnableClicked), this.toggleButton.on("vclick", this.onToggleClicked), this.controller.enabled.add(this.onCollaborationEnabled.bind(this)), this.controller.expanded.add(this.onCollaborationExpanded.bind(this))
        }, setUnreadComments: function (t) {
            0 === t ? this.clearUnreadComments() : this.unreadComments.text(t).addClass("visible")
        }, clearUnreadComments: function () {
            this.unreadComments.removeClass("visible")
        }, destroy: function () {
            this.domElement.remove()
        }, getPrimaryButton: function () {
            return this.toggleButton
        }, onEnableClicked: function (t) {
            this.enableButton.off("vclick", this.onEnableClicked), this.enableLoader = Ladda.create(this.enableButton.get(0)), this.enableLoader.start(), SL.view.isNewDeck() ? SL.view.save(function () {
                this.controller.makeDeckCollaborative()
            }.bind(this)) : this.controller.makeDeckCollaborative(), t.preventDefault()
        }, onToggleClicked: function (t) {
            this.controller.toggle(), t.preventDefault()
        }, onCollaborationEnabled: function () {
            this.enableLoader && (this.enableLoader.stop(), this.enableLoader = null)
        }, onCollaborationExpanded: function () {
            this.clearUnreadComments()
        }
    });

SL("components.collab").Notifications = Class.extend({
        init: function (t, e) {
            this.controller = t, this.options = e, this.render(), this.bind()
        }, render: function () {
            this.domElement = $('<div class="sl-collab-notifications">')
        }, bind: function () {
            this.domElement.delegate(".sl-collab-notification.optional", "mouseenter", this.onNotificationMouseEnter.bind(this)), this.domElement.delegate(".sl-collab-notification.optional", "vclick", this.onNotificationClick.bind(this))
        }, appendTo: function (t) {
            this.domElement.appendTo(t)
        }, show: function (t, e) {
            e = $.extend({optional: true, duration: 5e3}, e);
            var i;
            e.id && (i = this.getNotificationByID(e.id)), i && 0 !== i.length || (i = this.addNotification(t, e), e.optional && (this.holding ? i.addClass("on-hold") : this.hideAfter(i, e.duration)))
        }, hide: function (t) {
            var e = this.getNotificationByID(t);
            return e.length ? (this.removeNotification(e), true) : false
        }, hideAfter: function (t, e) {
            setTimeout(function () {
                t.addClass("hide"), setTimeout(this.removeNotification.bind(this, t), 500)
            }.bind(this), e)
        }, hold: function () {
            this.holding = true
        }, release: function () {
            this.holding = false;
            var t = this.domElement.find(".sl-collab-notification.on-hold").get().reverse();
            t.forEach(function (t, e) {
                this.hideAfter($(t), 5e3 + 1e3 * e)
            }, this)
        }, addNotification: function (t, e) {
            var i = $('<div class="sl-collab-notification" />').data("options", e).toggleClass("optional", e.optional).prependTo(this.domElement), t = $('<div class="message" />').append(t).appendTo(i);
            return i.toggleClass("multiline", t.height() > 24), e.sender ? $('<div class="status-picture" />').css("background-image", 'url("' + e.sender.get("thumbnail_url") + '")').prependTo(i) : $('<div class="status-icon icon" />').addClass(e.icon || "i-info").prependTo(i), e.id && i.attr("data-id", e.id), this.layout(), setTimeout(function () {
                i.addClass("show")
            }, 1), i
        }, removeNotification: function (t) {
            t.removeData(), t.remove(), this.layout()
        }, getNotificationByID: function (t) {
            return this.domElement.find(".sl-collab-notification[data-id=" + t + "]")
        }, layout: function () {
            var t = 0;
            this.domElement.find(".sl-collab-notification").each(function (e, i) {
                i.style.top = t + "px", t += i.offsetHeight + 10
            })
        }, destroy: function () {
            this.domElement.remove()
        }, onNotificationMouseEnter: function (t) {
            var e = $(t.currentTarget);
            0 === e.find(".dismiss").length && $('<div class="dismiss"><span class="icon i-x"></span></div>').appendTo(e)
        }, onNotificationClick: function (t) {
            var e = $(t.currentTarget);
            if (0 === $(t.target).closest(e.find(".dismiss")).length) {
                var i = e.data("options").callback;
                "function" == typeof i && i.call()
            }
            this.removeNotification(e)
        }
    });

SL("components.collab").Users = Class.extend({
        init: function (t, e) {
            this.controller = t, this.options = e, this.inviteSent = new signals.Signal, this.render(), this.bind()
        }, render: function () {
            this.domElement = $('<div class="sl-collab-users disable-when-disconnected">'), this.userList = $('<div class="sl-collab-users-list">').appendTo(this.domElement), this.slideGroup = $('<div class="sl-collab-users-group">').appendTo(this.userList), this.slideGroup.append('<div class="icon i-eye"></div>'), this.slideGroup.find(".icon").attr({
                "data-tooltip": "People who are viewing the current slide",
                "data-tooltip-alignment": "l"
            }), this.inviteButton = $('<div class="sl-collab-users-invite" data-tooltip="Add a collaborator" data-tooltip-alignment="l"></div>'), this.inviteButton.html('<span class="icon i-plus"></span>'), this.inviteButton.on("vclick", this.onInviteClicked.bind(this)), this.inviteButton.appendTo(this.domElement), this.renderUsers()
        }, renderUsers: function () {
            this.domElement.toggleClass("admin", this.controller.getCurrentDeckUser().isAdmin()), this.layoutPrevented = true, this.userList.find(".sl-collab-user").remove(), this.options.users.forEach(this.renderUser.bind(this)), this.layoutPrevented = false, this.layout()
        }, renderUser: function (t) {
            if (t.get("user_id") !== SL.current_user.get("id") && t.get("active") !== false) {
                var e = this.getUserByID(t.get("user_id"));
                return 0 === e.length && (e = $("<div/>", {
                    "class": "sl-collab-user",
                    "data-user-id": t.get("user_id")
                }), e.html('<div class="picture" style="background-image: url(\'' + t.get("thumbnail_url") + "')\" />"), e.data("model", t), e.on("mouseenter", this.onUserMouseEnter.bind(this)), e.appendTo(this.userList)), this.refreshPresence(t), e
            }
        }, renderRoleSelector: function () {
            var t = $(['<select class="sl-select role-selector">', '<option value="' + SL.models.collab.DeckUser.ROLE_EDITOR + '">Editor \u2013 Can comment and edit</option>', '<option value="' + SL.models.collab.DeckUser.ROLE_VIEWER + '">Viewer \u2013 Can comment</option>', "</select>"].join(""));
            return SL.current_deck.get("user.enterprise") && t.prepend('<option value="' + SL.models.collab.DeckUser.ROLE_ADMIN + '">Admin \u2013 Can comment, edit and manage users</option>'), t
        }, renderInviteForm: function () {
            this.inviteForm || (this.inviteForm = $('<div class="sl-collab-invite-form sl-form">'), this.inviteEmail = $('<input class="invite-email" type="text" placeholder="Email address..." />'), this.inviteEmail.on("input", this.onEmailInput.bind(this)), this.inviteEmail.appendTo(this.inviteForm), this.inviteRole = this.renderRoleSelector(), this.inviteRole.appendTo(this.inviteForm), this.inviteOptions = $('<div class="invite-options">'), this.inviteOptions.appendTo(this.inviteForm), this.inviteFooter = $(['<footer class="footer">', '<button class="button l outline cancel-button">Cancel</button>', '<button class="button l confirm-button">Send</button>', "</footer>"].join("")), this.inviteFooter.find(".cancel-button").on("vclick", this.onInviteCancelClicked.bind(this)), this.inviteFooter.find(".confirm-button").on("vclick", this.onInviteConfirmClicked.bind(this)), this.inviteFooter.appendTo(this.inviteForm), SL.current_user.isEnterprise() && (this.inviteEmailAutocomplete = new SL.components.form.Autocomplete(this.inviteEmail, this.searchTeamMembers.bind(this), {
                className: "light-grey",
                offsetY: 1
            }), this.inviteEmailAutocomplete.confirmed.add(this.onEmailInput.bind(this)))), this.inviteEmail.val(""), this.inviteOptions.empty(), this.inviteRole.find("[hidden]").prop("hidden", false), this.inviteRole.find('[value="' + SL.models.collab.DeckUser.ROLE_EDITOR + '"]').prop("selected", true), this.inviteRole.prop("disabled", false);
            var t = SL.current_deck.user;
            if (SL.current_deck.isVisibilityAll() || !t.isPro() || t.isEnterprise()) {
                if (t.isEnterprise() && SL.current_user.isEnterpriseManager()) {
                    this.inviteOptions.append("<p>Want this person to be able to access internal presentations and create decks of their own?</p>");
                    var e = $(['<div class="unit sl-checkbox outline">', '<input id="team-invite-checkbox" class="team-invite-checkbox" type="checkbox" />', '<label for="team-invite-checkbox">Add to team</label>', "</div>"].join("")).appendTo(this.inviteOptions);
                    if (this.inviteToTeamLabel = e.find("label"), this.inviteToTeamInput = e.find("input"), !SL.current_team.isManuallyUpgraded()) {
                        var i = SL.current_team.getPlan();
                        if (i) {
                            var n = i.getDollarCostPerCycle();
                            n && this.inviteToTeamLabel.html("Add to team for " + n)
                        }
                    }
                }
            } else {
                var s = this.options.users.getEditors().length - 1, o = SL.current_deck.get("deck_user_editor_limit") || 50;
                s >= o ? (this.inviteRole.find('[value="' + SL.models.collab.DeckUser.ROLE_EDITOR + '"]').prop("hidden", true), this.inviteRole.find('[value="' + SL.models.collab.DeckUser.ROLE_VIEWER + '"]').prop("selected", true), this.inviteRole.prop("disabled", true), this.inviteOptions.html("You can't invite any more editors to this deck on your current plan, but you can invite any number of viewers. To invite additional editors please <a href=\"" + SL.routes.PRICING + '" target="_blank">upgrade to the Team plan</a>.')) : this.inviteOptions.html('You have invited <span class="semibold">' + s + "/" + o + "</span> " + SL.util.string.pluralize("editor", "s", o > 1) + ".")
            }
            return this.inviteForm
        }, renderEditForm: function (t) {
            this.editForm || (this.editForm = $('<div class="sl-collab-edit-form sl-form">'), this.editRole = this.renderRoleSelector(), this.editRole.appendTo(this.editForm), this.editFooter = $(['<footer class="footer">', '<button class="button l negative delete-button" style="float: left;">Remove</button>', '<button class="button l outline cancel-button">Cancel</button>', '<button class="button l confirm-button">Save</button>', "</footer>"].join("")), this.editFooter.find(".delete-button").on("vclick", this.onEditDeleteClicked.bind(this)), this.editFooter.find(".cancel-button").on("vclick", this.onEditCancelClicked.bind(this)), this.editFooter.find(".confirm-button").on("vclick", this.onEditConfirmClicked.bind(this)), this.editFooter.appendTo(this.editForm)), this.editRole.find('[value="' + t.get("role") + '"]').prop("selected", true), this.editRole.prop("disabled", false);
            var e = SL.current_deck.user;
            if (!SL.current_deck.isVisibilityAll() && e.isPro() && !e.isEnterprise()) {
                var i = this.options.users.getEditors().length - 1, n = SL.current_deck.get("deck_user_editor_limit") || 50;
                i >= n && t.get("role") === SL.models.collab.DeckUser.ROLE_VIEWER && this.editRole.prop("disabled", true)
            }
            return this.editForm
        }, bind: function () {
            this.options.users.changed.add(this.onUsersChanged.bind(this)), this.domElement.delegate(".sl-collab-user", "vclick", this.onUserClicked.bind(this)), this.layout = this.layout.bind(this), this.controller.expanded.add(this.layout), this.controller.collapsed.add(this.layout), $(window).on("resize", $.throttle(this.layout, 300))
        }, appendTo: function (t) {
            this.domElement.appendTo(t)
        }, refreshPresence: function (t) {
            var e = this.getUserByID(t.get("user_id"));
            e && e.length && (e.removeClass("intro-animation"), e.toggleClass("online", t.isOnline()), e.toggleClass("idle", t.isIdle()), this.layout())
        }, layout: function () {
            if (this.layoutPrevented)return false;
            var t = 62;
            this.domElement.css("max-height", window.innerHeight - t);
            var e = this.userList.find(".sl-collab-user.online").get(), i = this.userList.find(".sl-collab-user:not(.online)").get(), n = 30, s = 26, o = 16, a = 10;
            if (this.slideGroup.removeClass("visible"), e.length) {
                var r = SL.util.deck.getSlideID(Reveal.getCurrentSlide()), l = 0, c = 4;
                e = e.filter(function (t) {
                    return $(t).data("model").get("slide_id") === r ? (t.style.transform = "translateY(" + a + "px)", a += s, l += 1, false) : true
                }), l > 0 && (this.slideGroup.css({
                    top: c,
                    height: a + 2 * c
                }).addClass("visible"), a += o + 6), e.length && (e.forEach(function (t) {
                    t.style.transform = "translateY(" + a + "px)", a += s
                }), a += o)
            }
            i.length && (this.controller.isExpanded() ? (i.forEach(function (t) {
                t.style.transform = "translateY(" + a + "px)", a += s
            }), a += o) : i.forEach(function (t) {
                t.style.transform = "translateY(" + a + "px)"
            })), this.inviteButton && (this.inviteButton.get(0).style.transform = "translateY(" + a + "px)", a += n + o), this.userList.css("height", a)
        }, addUserFromStream: function (t) {
            t.user_id || console.warn("Can not insert collaborator without ID"), this.options.users.getByProperties({user_id: t.user_id}) || this.options.users.createModel(t)
        }, removeUserFromStream: function (t) {
            return this.options.users.removeByProperties({user_id: t})
        }, getUserByID: function (t) {
            return this.domElement.find('.sl-collab-user[data-user-id="' + t + '"]')
        }, showInvitePrompt: function (t) {
            this.invitePrompt || (this.invitePrompt = SL.prompt({
                anchor: t || this.inviteButton,
                alignment: "l",
                type: "custom",
                title: "Add a collaborator",
                html: this.renderInviteForm(),
                destroyAfterConfirm: false,
                confirmOnEnter: true
            }), this.invitePrompt.confirmed.add(function () {
                this.inviteEmail.blur(), this.confirmInvitePrompt().then(function () {
                    this.inviteSent.dispatch(), this.invitePrompt && this.invitePrompt.destroy()
                }.bind(this), function () {
                })
            }.bind(this)), this.invitePrompt.destroyed.add(function () {
                this.inviteForm.detach(), this.invitePrompt = null
            }.bind(this)), this.inviteEmail.focus())
        }, confirmInvitePrompt: function () {
            var t = this.inviteEmail.val().trim(), e = this.inviteRole.val(), i = !(!this.inviteToTeamInput || !this.inviteToTeamInput.val());
            return new Promise(function (n, s) {
                if (/^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$/gi.test(t)) {
                    this.invitePrompt.showOverlay("neutral", "Inviting " + t, '<div class="spinner" data-spinner-color="#333"></div>'), SL.util.html.generateSpinners();
                    var o = {user: {email: t, role: e}};
                    i && (o.user.add_to_team = true), this.options.users.create(o, {
                        url: SL.config.AJAX_DECKUSER_CREATE(SLConfig.deck.id),
                        createModel: false
                    }).then(function () {
                        this.invitePrompt.showOverlay("positive", "Invite sent!", '<span class="icon i-checkmark"></span>', 2e3).then(n)
                    }.bind(this), function () {
                        this.invitePrompt.showOverlay("negative", "Failed to send invite. Please try again.", '<span class="icon i-x"></span>', 2e3).then(s), this.inviteEmail.focus().select()
                    }.bind(this))
                } else SL.notify("Please enter a valid email", "negative"), this.inviteEmail.focus().select(), s()
            }.bind(this))
        }, showEditPrompt: function (t) {
            if (!this.editPrompt) {
                var e = t.data("model");
                if (e.get("role") === SL.models.collab.DeckUser.ROLE_OWNER)return;
                this.editUserElement = t, this.editUserModel = e, this.editPrompt = SL.prompt({
                    anchor: t,
                    alignment: "l",
                    type: "custom",
                    title: e.get("email"),
                    html: this.renderEditForm(e),
                    destroyAfterConfirm: false,
                    confirmOnEnter: true
                }), this.editPrompt.confirmed.add(function () {
                    this.confirmEditPrompt().then(function () {
                        this.editPrompt && this.editPrompt.destroy()
                    }.bind(this))
                }.bind(this)), this.editPrompt.destroyed.add(function () {
                    this.editForm.detach(), this.editPrompt = null
                }.bind(this))
            }
        }, confirmEditPrompt: function () {
            var t = this.editUserModel;
            return new Promise(function (e, i) {
                var n = this.editRole.val();
                n && n !== t.get("role") ? (this.editPrompt.showOverlay("neutral", "Saving", '<div class="spinner" data-spinner-color="#333"></div>'), SL.util.html.generateSpinners(), t.set("role", n), t.save(["role"]).then(function () {
                    e()
                }.bind(this), function () {
                    this.editPrompt.showOverlay("negative", "Failed to save changes. Please try again.", '<span class="icon i-x"></span>', 2e3).then(i)
                }.bind(this))) : e()
            }.bind(this))
        }, searchTeamMembers: function (t) {
            return this.searchTeamMembersXHR && this.searchTeamMembersXHR.abort(), this.searchTeamMemberEmailCache || (this.searchTeamMemberEmailCache = {}), new Promise(function (e, i) {
                this.searchTeamMembersXHR = $.ajax({
                    type: "POST",
                    url: SL.config.AJAX_TEAM_MEMBER_SEARCH,
                    context: this,
                    data: {q: t}
                }).done(function (t) {
                    var i = t.results;
                    i = i.filter(function (t) {
                        return t.id !== SL.current_user.get("id")
                    }), i.forEach(function (t) {
                        this.searchTeamMemberEmailCache[t.email] = true
                    }.bind(this)), i = i.slice(0, 5).map(function (t) {
                        return {
                            value: t.email,
                            label: '<div class="label">' + t.name + '</div><div class="value">' + t.email + "</div>"
                        }
                    }), e(i)
                }).fail(i)
            }.bind(this))
        }, dismissPrompts: function () {
            this.editPrompt && this.editPrompt.destroy(), this.invitePrompt && this.invitePrompt.destroy()
        }, onUsersChanged: function (t, e) {
            t && t.forEach(function (t) {
                var e = this.renderUser(t);
                e && (setTimeout(function () {
                    e.addClass("intro-animation")
                }, 1), this.layout())
            }.bind(this)), e && e.forEach(function (t) {
                var e = $('.sl-collab-user[data-user-id="' + t.get("user_id") + '"]');
                SL.util.anim.collapseListItem(e, function () {
                    e.remove(), this.layout()
                }.bind(this), 300)
            }, this)
        }, onInviteClicked: function (t) {
            t.preventDefault(), this.showInvitePrompt()
        }, onInviteCancelClicked: function () {
            this.invitePrompt && this.invitePrompt.cancel()
        }, onInviteConfirmClicked: function () {
            this.invitePrompt && this.invitePrompt.confirm()
        }, onEditCancelClicked: function () {
            this.editPrompt && this.editPrompt.cancel()
        }, onEditConfirmClicked: function () {
            this.editPrompt && this.editPrompt.confirm()
        }, onEditDeleteClicked: function () {
            this.editPrompt && this.editPrompt.destroy();
            var t = this.editUserModel;
            SL.prompt({
                anchor: this.editUserElement,
                title: SL.locale.get("COLLABORATOR_REMOVE_CONFIRM"),
                alignment: "l",
                type: "select",
                data: [{html: "<h3>Cancel</h3>"}, {
                    html: "<h3>Remove</h3>",
                    selected: true,
                    className: "negative",
                    callback: function () {
                        this.options.users.remove(t), t.destroy()
                    }.bind(this)
                }]
            })
        }, onEmailInput: function () {
            this.inviteOptions && this.searchTeamMemberEmailCache && (this.searchTeamMemberEmailCache[this.inviteEmail.val().trim()] ? this.inviteOptions.addClass("disabled") : this.inviteOptions.removeClass("disabled"))
        }, onUserClicked: function (t) {
            this.controller.getCurrentDeckUser().isAdmin() && this.showEditPrompt($(t.currentTarget)), t.preventDefault()
        }, onUserMouseEnter: function (t) {
            var e = $(t.currentTarget), i = e.data("model");
            if (i) {
                var n = [i.getDisplayName() + '<span class="sl-collab-tooltip-status" data-status="' + i.get("status") + '"></span>', '<span style="opacity: 0.70;">' + i.get("email") + "</span>"].join("<br>");
                SL.tooltip.show(n, {
                    alignment: "l",
                    anchor: e
                }), e.one("mouseleave", SL.tooltip.hide.bind(SL.tooltip))
            }
        }, destroy: function () {
            this.inviteEmailAutocomplete && this.inviteEmailAutocomplete.destroy(), this.options = null, this.domElement.remove()
        }
    });