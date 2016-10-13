SL("components.popup").Popup = Class.extend({
    WINDOW_PADDING: .01,
    USE_ABSOLUTE_POSITIONING: SL.util.device.IS_PHONE || SL.util.device.IS_TABLET,
    init: function (t) {
        this.options = $.extend({
            title: "",
            titleItem: "",
            header: true,
            headerActions: [{
                label: "Close",
                className: "grey",
                callback: this.close.bind(this)
            }],
            width: "auto",
            height: "auto",
            singleton: false,
            closeOnEscape: true,
            closeOnClickOutside: true
        }, t), this.options.additionalHeaderActions && (this.options.headerActions = this.options.additionalHeaderActions.concat(this.options.headerActions)), this.render(), this.bind(), this.layout()
    },
    render: function () {
        this.domElement = $('<div class="sl-popup" data-id="' + this.TYPE + '">'), this.domElement.appendTo(document.body), this.innerElement = $('<div class="sl-popup-inner">'), this.innerElement.appendTo(this.domElement), this.options.header && this.renderHeader(), this.bodyElement = $('<div class="sl-popup-body">'), this.bodyElement.appendTo(this.innerElement)
    },
    renderHeader: function () {
        this.headerElement = $(['<header class="sl-popup-header">', '<h3 class="sl-popup-header-title">' + this.options.title + "</h3>", "</header>"].join("")), this.headerElement.appendTo(this.innerElement), this.headerTitleElement = this.headerElement.find(".sl-popup-header-title"), this.options.titleItem && (this.headerTitleElement.append('<span class="sl-popup-header-title-item"></span>'), this.headerTitleElement.find(".sl-popup-header-title-item").text(this.options.titleItem)), this.options.headerActions && this.options.headerActions.length && (this.headerActionsElement = $('<div class="sl-popup-header-actions">').appendTo(this.headerElement), this.options.headerActions.forEach(function (t) {
            "divider" === t.type ? $('<div class="divider"></div>').appendTo(this.headerActionsElement) : $('<button class="button l ' + t.className + '">' + t.label + "</button>").appendTo(this.headerActionsElement).on("vclick", function (e) {
                t.callback(e), e.preventDefault()
            })
        }.bind(this)))
    },
    bind: function () {
        this.onKeyDown = this.onKeyDown.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.onBackgroundClicked = this.onBackgroundClicked.bind(this), this.domElement.on("vclick", this.onBackgroundClicked)
    },
    layout: function () {
        if (this.innerElement.css({
                width: this.options.width,
                height: this.options.height
            }), this.options.height) {
            var t = this.headerElement ? this.headerElement.outerHeight() : 0;
            this.headerElement && "number" == typeof this.options.height ? this.bodyElement.css("height", this.options.height - t) : this.bodyElement.css("height", "auto");
            var e = window.innerHeight;
            this.bodyElement.css("max-height", e - t - e * this.WINDOW_PADDING * 2)
        }
        if (this.headerElement) {
            var i = this.headerElement.width(), n = this.headerActionsElement.outerWidth();
            this.headerTitleElement.css("max-width", i - n - 30)
        }
        if (this.USE_ABSOLUTE_POSITIONING) {
            var s = $(window);
            this.domElement.css({
                position: "absolute",
                height: Math.max($(window).height(), $(document).height())
            }), this.innerElement.css({
                position: "absolute",
                transform: "none",
                top: s.scrollTop() + (s.height() - this.innerElement.outerHeight()) / 2,
                left: s.scrollLeft() + (s.width() - this.innerElement.outerWidth()) / 2,
                maxWidth: s.width() - window.innerWidth * this.WINDOW_PADDING * 2
            })
        }
    },
    open: function (t) {
        this.domElement.appendTo(document.body), clearTimeout(this.closeTimeout), this.closeTimeout = null, this.options = $.extend(this.options, t), SL.keyboard.keydown(this.onKeyDown), $(window).on("resize", this.onWindowResize), setTimeout(function () {
            this.domElement.addClass("visible")
        }.bind(this), 1)
    },
    close: function (t) {
        this.closeTimeout || (t ? this.closeConfirmed() : this.checkUnsavedChanges(this.closeConfirmed.bind(this)))
    },
    closeConfirmed: function () {
        SL.keyboard.release(this.onKeyDown), $(window).off("resize", this.onWindowResize), this.domElement.removeClass("visible"), SL.popup.unregister(this), this.closeTimeout = setTimeout(function () {
            this.domElement.detach(), this.isSingleton() || this.destroy()
        }.bind(this), 500)
    },
    checkUnsavedChanges: function (t) {
        t()
    },
    isSingleton: function () {
        return this.options.singleton
    },
    onBackgroundClicked: function (t) {
        $(t.target).is(this.domElement) && (this.options.closeOnClickOutside && this.close(), t.preventDefault())
    },
    onWindowResize: function () {
        this.layout()
    },
    onKeyDown: function (t) {
        return 27 === t.keyCode ? (this.options.closeOnEscape && this.close(), false) : true
    },
    destroy: function () {
        SL.popup.unregister(this), this.options = null, this.domElement.remove()
    }
});

SL("components.popup").DeckOutdated = SL.components.popup.Popup.extend({
        TYPE: "deck-outdated",
        init: function (t) {
            this._super($.extend({
                title: "Newer version available",
                width: 500,
                closeOnClickOutside: false,
                headerActions: [{
                    label: "Ignore",
                    className: "outline",
                    callback: this.close.bind(this)
                }, {
                    label: "Reload",
                    className: "positive",
                    callback: this.onReloadClicked.bind(this)
                }]
            }, t))
        },
        render: function () {
            this._super(), this.bodyElement.html(["<p>A more recent version of this presentation is available on the server. This can happen when the presentation is saved from another browser or device.</p>", "<p>We recommend reloading the page to get the latest version. If you're sure your local changes are the latest, please ignore this message.</p>"].join(""))
        },
        onReloadClicked: function () {
            window.location.reload()
        },
        destroy: function () {
            this._super()
        }
    });

SL("components.popup").EditHTML = SL.components.popup.Popup.extend({
        TYPE: "edit-html",
        init: function (t) {
            this._super($.extend({
                title: "Edit HTML",
                width: 1200,
                height: 750,
                headerActions: [{
                    label: "Cancel",
                    className: "outline",
                    callback: this.close.bind(this)
                }, {
                    label: "Save",
                    className: "positive",
                    callback: this.saveAndClose.bind(this)
                }]
            }, t)), this.saved = new signals.Signal
        },
        render: function () {
            this._super(), this.bodyElement.html('<div id="ace-html" class="editor"></div>'), this.editor && "function" == typeof this.editor.destroy && (this.editor.destroy(), this.editor = null);
            try {
                this.editor = ace.edit("ace-html"), this.editor.setTheme("ace/theme/monokai"), this.editor.setDisplayIndentGuides(true), this.editor.setShowPrintMargin(false), this.editor.getSession().setUseWrapMode(true), this.editor.getSession().setMode("ace/mode/html")
            } catch (t) {
                console.log("An error occurred while initializing the Ace editor.")
            }
            this.editor.env.document.setValue(this.options.html), this.editor.focus()
        },
        saveAndClose: function () {
            this.saved.dispatch(this.getHTML()), this.close(true)
        },
        checkUnsavedChanges: function (t) {
            this.getHTML() === this.options.html || this.cancelPrompt ? t() : (this.cancelPrompt = SL.prompt({
                title: "Discard unsaved changes?",
                type: "select",
                data: [{html: "<h3>Cancel</h3>"}, {
                    html: "<h3>Discard</h3>",
                    selected: true,
                    className: "negative",
                    callback: t
                }]
            }), this.cancelPrompt.destroyed.add(function () {
                this.cancelPrompt = null
            }.bind(this)))
        },
        getHTML: function () {
            return this.editor.env.document.getValue()
        },
        destroy: function () {
            this.editor && "function" == typeof this.editor.destroy && (this.editor.destroy(), this.editor = null), this.saved && (this.saved.dispose(), this.saved = null), this._super()
        }
    });

SL("components.popup").EditSlideHTML = SL.components.popup.EditHTML.extend({
        TYPE: "edit-slide-html",
        init: function (t) {
            SL.util.user.canUseCustomCSS() && (t.additionalHeaderActions = [{
                label: "Slide classes",
                className: "outline",
                callback: this.onSlideClassesClicked.bind(this)
            }, {type: "divider"}]), t.html = SL.util.html.indent(SL.editor.controllers.Serialize.getSlideAsString(t.slide, {
                inner: true,
                lazy: false,
                exclude: ".math-output"
            })), this._super(t)
        },
        readSlideClasses: function () {
            return this.options.slide.className.split(" ").filter(function (t) {
                return -1 === SL.config.RESERVED_SLIDE_CLASSES.indexOf(t)
            }).join(" ")
        },
        writeSlideClasses: function (t) {
            t = t || "", t = t.trim().replace(/\s{2,}/g, " ");
            var e = this.options.slide.className.split(" ").filter(function (t) {
                return -1 !== SL.config.RESERVED_SLIDE_CLASSES.indexOf(t)
            });
            e = e.concat(t.split(" ")), this.options.slide.className = e.join(" ")
        },
        onSlideClassesClicked: function (t) {
            var e = SL.prompt({
                anchor: t.currentTarget,
                title: "Slide classes",
                subtitle: "Specify class names which will be added to the slide wrapper. Useful for targeting from the CSS editor.",
                type: "input",
                confirmLabel: "Save",
                data: {
                    value: this.readSlideClasses(),
                    placeholder: "Classes...",
                    width: 400,
                    confirmBeforeDiscard: true
                }
            });
            e.confirmed.add(function (t) {
                this.writeSlideClasses(t)
            }.bind(this))
        }
    });

SL("components.popup").InsertSnippet = SL.components.popup.Popup.extend({
        TYPE: "insert-snippet",
        init: function (t) {
            this._super($.extend({
                title: "Insert",
                titleItem: '"' + t.snippet.get("title") + '"',
                width: 500,
                headerActions: [{
                    label: "Cancel",
                    className: "outline",
                    callback: this.close.bind(this)
                }, {
                    label: "Insert",
                    className: "positive",
                    callback: this.insertAndClose.bind(this)
                }]
            }, t)), this.snippetInserted = new signals.Signal
        },
        render: function () {
            this._super(), this.variablesElement = $('<div class="variables sl-form"></div>'), this.variablesElement.appendTo(this.bodyElement), this.variables = this.options.snippet.getTemplateVariables(), this.variables.forEach(function (t) {
                var e = $(['<div class="unit">', "<label>" + t.label + "</label>", '<input type="text" value="' + t.defaultValue + '">', "</div>"].join("")).appendTo(this.variablesElement);
                e.find("input").data("variable", t)
            }.bind(this)), this.variablesElement.find("input").first().focus().select()
        },
        insertAndClose: function () {
            this.variablesElement.find("input").each(function (t, e) {
                e = $(e), e.data("variable").value = e.val()
            }), this.snippetInserted.dispatch(this.options.snippet.templatize(this.variables)), this.close()
        },
        onKeyDown: function (t) {
            return 13 === t.keyCode ? (this.insertAndClose(), false) : this._super(t)
        },
        destroy: function () {
            this.snippetInserted.dispose(), this._super()
        }
    });

SL("components.popup").Revision = SL.components.popup.Popup.extend({
        TYPE: "revision",
        init: function (t) {
            this._super($.extend({
                revisionURL: null,
                revisionTimeAgo: null,
                title: "Revision",
                titleItem: "from " + t.revisionTimeAgo,
                width: 900,
                height: 700,
                headerActions: [{
                    label: "Open in new tab",
                    className: "outline",
                    callback: this.onOpenExternalClicked.bind(this)
                }, {
                    label: "Restore",
                    className: "grey",
                    callback: this.onRestoreClicked.bind(this)
                }, {label: "Close", className: "grey", callback: this.close.bind(this)}]
            }, t)), this.restoreRequested = new signals.Signal, this.externalRequested = new signals.Signal
        },
        render: function () {
            this._super(), this.bodyElement.html(['<div class="spinner centered"></div>', '<div class="deck"></div>'].join("")), this.bodyElement.addClass("loading"), SL.util.html.generateSpinners();
            var t = $("<iframe>", {
                src: this.options.revisionURL, load: function () {
                    this.bodyElement.removeClass("loading")
                }.bind(this)
            });
            t.appendTo(this.bodyElement.find(".deck"))
        },
        onRestoreClicked: function (t) {
            this.restoreRequested.dispatch(t)
        },
        onOpenExternalClicked: function (t) {
            this.externalRequested.dispatch(t)
        },
        destroy: function () {
            this.bodyElement.find(".deck iframe").attr("src", ""), this.bodyElement.find(".deck").empty(), this.restoreRequested.dispose(), this.externalRequested.dispose(), this._super()
        }
    });

SL("components.popup").SessionExpired = SL.components.popup.Popup.extend({
        TYPE: "session-expired",
        init: function (t) {
            this._super($.extend({
                title: "Session expired",
                width: 500,
                closeOnEscape: false,
                closeOnClickOutside: false,
                headerActions: [{
                    label: "Ignore",
                    className: "outline negative",
                    callback: this.close.bind(this)
                }, {
                    label: "Retry",
                    className: "positive",
                    callback: this.onRetryClicked.bind(this)
                }]
            }, t))
        },
        render: function () {
            this._super(), this.bodyElement.html(["<p>You are no longer signed in to Slides. This can happen when you leave the page idle for too long, log out in a different tab or go offline. To continue please:</p>", "<ol>", '<li><a href="' + SL.routes.SIGN_IN + '" target="_blank" style="text-decoration: underline;">Sign in</a> to Slides from another browser tab.</li>', "<li>Come back to this tab and press the 'Retry' button.</li>", "</ol>"].join(""))
        },
        onRetryClicked: function () {
            SL.editor && 1 === SL.editor.Editor.VERSION ? SL.view.checkLogin(true) : SL.session.check()
        },
        destroy: function () {
            this._super()
        }
    });