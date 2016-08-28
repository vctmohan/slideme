SL("editor.components").Sidebar = Class.extend({
    init: function (e) {

        this.options = e || {};
        this.sidebarElement = $(".sidebar");
        this.sidebarPrimary = this.sidebarElement.find(".primary");
        this.sidebarSecondary = this.sidebarElement.find(".secondary");
        this.sidebarHeader = this.sidebarElement.find(".global-header");
        this.sidebarScrollShadowTop = this.sidebarElement.find(".scroll-shadow-top");
        this.sidebarScrollShadowBottom = this.sidebarElement.find(".scroll-shadow-bottom");
        this.panelElement = $(".sidebar-panel");
        this.saveButton = this.sidebarElement.find(".button.save");
        this.previewButton = this.sidebarElement.find(".button.preview");
        this.undoButton = this.sidebarElement.find(".button.undo");
        this.exportButton = this.sidebarElement.find(".button.export");
        this.importButton = this.sidebarElement.find(".button.import");
        this.publishButton = this.sidebarElement.find(".button.publish");
        this.settingsButton = this.sidebarElement.find(".button.settings");
        this.revisionsButton = this.sidebarElement.find(".button.revisions");
        this.medialibraryButton = this.sidebarElement.find(".button.medialibrary");
        this.arrangeButton = this.sidebarElement.find(".button.arrange");
        this.styleButton = this.sidebarElement.find(".button.style");
        this.presentButton = this.sidebarElement.find(".button.present");
        if (this.previewButton) {
            this.previewButton.attr("data-tooltip", "Preview (" + SL.util.getMetaKeyName() + " + F)");
        }
        this.undoButton && this.undoButton.attr("data-tooltip", "Undo (" + SL.util.getMetaKeyName() + " + Z)");
        this.currentPanel = null;
        this.createSignals();
        this.render();
        this.bind();
        this.layout();
        this.updatePublishButton();
        this.updateUndoButton();
        this.updatePresentButton();
        SL.editor.controllers.Capabilities.canExport() || this.exportButton.hide();
        SL.editor.controllers.Capabilities.canPresent() || this.presentButton.hide();
        SL.editor.controllers.Capabilities.canChangeStyles() || this.styleButton.hide();
        SL.editor.controllers.Capabilities.canSetVisibility() || this.publishButton.hide();
    },
    bind: function () {
        this.saveButton.on("vclick", this.onSaveClicked.bind(this));
        this.previewButton && this.previewButton.on("vclick", this.onPreviewClicked.bind(this));
        this.undoButton && this.undoButton.on("vclick", this.onUndoClicked.bind(this));
        this.exportButton && this.exportButton.on("vclick", this.onExportClicked.bind(this));
        this.importButton && this.importButton.on("vclick", this.onImportClicked.bind(this));
        this.settingsButton.on("vclick", this.onSettingsClicked.bind(this));
        this.revisionsButton.on("vclick", this.onRevisionsClicked.bind(this));
        this.medialibraryButton.on("vclick", this.onMediaLibraryClicked.bind(this));
        this.publishButton.on("vclick", this.onPublishClicked.bind(this));
        this.arrangeButton.on("vclick", this.onArrangeClicked.bind(this));
        this.styleButton.on("vclick", this.onStyleClicked.bind(this));
        this.presentButton.on("vclick", this.onPresentClicked.bind(this));
        this.panelElement.on("vclick", this.onPanelElementClicked.bind(this));
        this.sidebarSecondary.on("scroll", this.layout.bind(this));
        this.settingsPanel.onclose.add(this.close.bind(this));
        this.exportPanel.onclose.add(this.close.bind(this));
        this.importPanel.onclose.add(this.close.bind(this));
        this.revisionsPanel.onclose.add(this.close.bind(this));
        this.stylePanel.onclose.add(this.close.bind(this));
        $(window).on("resize", this.layout.bind(this));
        SL.editor.controllers.History.changed.add(this.updateUndoButton.bind(this));
        SL.editor.controllers.URL.changed.add(this.updatePresentButton.bind(this));
    },
    createSignals: function () {
        this.saveClicked = new signals.Signal;
        this.previewClicked = new signals.Signal;
    },
    render: function () {
        this.revisionsPanel = new SL.editor.components.sidebar.Revisions;
        this.settingsPanel = new SL.editor.components.sidebar.Settings;
        this.exportPanel = new SL.editor.components.sidebar.Export;
        this.importPanel = new SL.editor.components.sidebar.Import;
        this.stylePanel = new SL.editor.components.sidebar.Style;
        this.renderMoreOptions();
    },
    renderMoreOptions: function () {

        var e = [{
            label: "Save a copy", icon: "fork", callback: function () {
                SL.analytics.trackEditor("Sidebar: Duplicate deck"), SL.editor.controllers.API.forkDeck()
            }.bind(this)
        }];

        if (SL.editor.controllers.Capabilities.canDeleteDeck()) {
            e.push({
                label: "Delete deck",
                icon: "trash-fill",
                callback: function () {
                    SL.analytics.trackEditor("Sidebar: Delete deck");
                    SL.editor.controllers.API.deleteDeck();
                }.bind(this)
            });
        }

        this.moreOptionsElement = this.sidebarElement.find(".more-options"), this.moreOptions = new SL.components.Menu({
            anchor: this.moreOptionsElement,
            anchorSpacing: 10,
            alignment: "r",
            showOnHover: true,
            options: e
        });
    }, layout: function () {
        var e = window.innerHeight - (this.sidebarPrimary.outerHeight(true) + this.sidebarHeader.outerHeight(true));
        this.sidebarSecondary.css("max-height", e);
        var t = this.sidebarSecondary.scrollTop(), i = this.sidebarSecondary.prop("scrollHeight"), n = this.sidebarSecondary.outerHeight(), r = i > n, o = t / (i - n);
        this.sidebarScrollShadowBottom.css({
            opacity: r ? 1 - o : 0,
            bottom: this.sidebarHeader.outerHeight()
        }), this.sidebarScrollShadowTop.css({opacity: r ? o : 0, top: this.sidebarSecondary.offset().top})
    }, open: function (e) {
        switch (this.currentPanel && this.currentPanel.close(), SL.editor.controllers.Mode.clear(), e) {
            case"settings":
                this.currentPanel = this.settingsPanel;
                break;
            case"export":
                this.currentPanel = this.exportPanel;
                break;
            case"import":
                this.currentPanel = this.importPanel;
                break;
            case"style":
                this.currentPanel = this.stylePanel;
                break;
            case"revisions":
                this.currentPanel = this.revisionsPanel
        }
        this.setActiveButton(e), this.currentPanel.open(), this.panelElement.addClass("visible"), SL.analytics.trackEditor("Open panel", e)
    }, close: function (e) {
        this.currentPanel && (e === true && this.currentPanel.save(), this.currentPanel.close()), this.setActiveButton(null), this.panelElement.removeClass("visible")
    }, toggle: function (e) {
        this.isExpanded(e) ? this.close() : this.open(e)
    }, setActiveButton: function (e) {
        e ? (this.sidebarElement.addClass("has-active-panel"), this.sidebarSecondary.find(".active").removeClass("active"), this.sidebarSecondary.find(".button." + e).addClass("active")) : (this.sidebarElement.removeClass("has-active-panel"), this.sidebarSecondary.find(".active").removeClass("active"))
    }, isExpanded: function (e) {
        return e ? this.panelElement.find("." + e).hasClass("visible") : this.panelElement.hasClass("visible")
    }, updateSaveButton: function (e, t) {
        this.saveButton.attr({"class": "button save " + (e || ""), "data-tooltip": t || ""})
    }, updatePublishButton: function () {
        var e = this.publishButton.find(".icon");
        if (SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF) {
            e.removeClass("i-unlock-stroke").addClass("i-lock-stroke");
        } else {
            if (SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_TEAM) {
                e.removeClass("i-lock-stroke").addClass("i-unlock-stroke")
            } else {
                if (SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_ALL) {
                    e.removeClass("i-lock-stroke").addClass("i-unlock-stroke");
                }
            }
        }

        if (SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF || SL.util.user.isPro()) {
            this.publishButton.attr("data-tooltip", "Visibility");
        } else {
            this.publishButton.attr("data-tooltip", "<strong>This presentation is public.</strong><br>You need a Pro account to save <br>privately. Click to learn more.");
        }


    }, updateArrangeButton: function (e) {
        this.setActiveButton("arranging" === e ? "arrange" : null)
    }, updateUndoButton: function () {
        this.undoButton && this.undoButton.toggleClass("disabled", !SL.editor.controllers.History.canUndo())
    }, updatePresentButton: function () {
        this.presentButton && SLConfig.deck.slug && this.presentButton.attr("href", SL.routes.DECK_LIVE(SLConfig.deck.user.username, SLConfig.deck.slug))
    }, onSaveClicked: function (e) {
        e.preventDefault(), this.saveClicked.dispatch()
    },
    onPreviewClicked: function (e) {
        e.preventDefault();
        this.previewClicked.dispatch();
    }, onUndoClicked: function (e) {
        e.preventDefault(), SL.editor.controllers.History.undo({ignoreMode: true}), SL.analytics.trackEditor("Undo clicked")
    },
    onExportClicked: function () {
        var e = $(".reveal .slides").children().map(function () {
            var e = $(this).clone();
            return e.find("section").add(e).each(function () {
                var e = $.map(this.attributes, function (e) {
                    return e.name
                }), t = $(this);
                $.each(e, function (e, i) {
                    t.removeAttr(i)
                })
            }), e.wrap("<div>").parent().html()
        }).toArray().join("");

        e = '<div class="slides">' + e + "</div>";
        $(".sidebar .export textarea").text(SL.util.html.indent(e));
        this.toggle("export");
        return false
    },
    onImportClicked: function () {
        return this.toggle("import"), false
    }, onArrangeClicked: function () {
        return this.close(), SL.editor.controllers.Mode.toggle("arrange"), false
    }, onSettingsClicked: function () {
        return this.toggle("settings"), false
    }, onRevisionsClicked: function () {
        return this.toggle("revisions"), false
    }, onMediaLibraryClicked: function () {
        return SL.popup.open(SL.editor.components.medialibrary.MediaLibrary), false
    }, onStyleClicked: function () {
        return this.toggle("style"), false
    }, onPresentClicked: function () {
        SL.analytics.trackEditor("Sidebar: Present")
    },
    onPublishClicked: function (e) {
        e.preventDefault();
        var t = [];
        t.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_SELF"),
            selected: SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF,
            callback: function () {
                SLConfig.deck.visibility = SL.models.Deck.VISIBILITY_SELF, SL.view.saveVisibility(), this.updatePublishButton(), SL.analytics.trackEditor("Visibility changed", "self")
            }.bind(this)
        });

        if (SL.current_user.isEnterprise()) {
            t.push({
                html: SL.locale.get("DECK_VISIBILITY_CHANGE_TEAM"),
                selected: SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_TEAM,
                className: "divider",
                callback: function () {
                    SLConfig.deck.visibility = SL.models.Deck.VISIBILITY_TEAM, SL.view.saveVisibility(), this.updatePublishButton(), SL.analytics.trackEditor("Visibility changed", "team")
                }.bind(this)
            });
        }

        t.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_ALL"),
            selected: SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_ALL,
            callback: function () {
                SLConfig.deck.visibility = SL.models.Deck.VISIBILITY_ALL, SL.view.saveVisibility(), this.updatePublishButton(), SL.analytics.trackEditor("Visibility changed", "all")
            }.bind(this)
        });
        SL.prompt({
            anchor: this.publishButton,
            alignment: "r",
            type: "select",
            className: "sl-visibility-prompt",
            data: t
        });

        SL.analytics.trackEditor("Visibility menu opened", SLConfig.deck.visibility);

    },
    onPanelElementClicked: function (e) {
        e.target == this.panelElement.get(0) && this.close()
    }
});

SL("editor.components.sidebar").Base = Class.extend({
    init: function () {
        this.saved = false, this.onWindowResize = this.onWindowResize.bind(this), this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this), this.onSaveClicked = this.onSaveClicked.bind(this), this.onCancelClicked = this.onCancelClicked.bind(this), this.onCloseClicked = this.onCloseClicked.bind(this), this.render(), this.bind(), this.createSignals()
    }, render: function () {
        this.bodyElement = this.domElement.find(".panel-body"), this.footerElement = this.domElement.find(".panel-footer"), this.scrollShadow = new SL.components.ScrollShadow({
            parentElement: this.domElement,
            contentElement: this.bodyElement,
            footerElement: this.footerElement,
            resizeContent: false
        })
    }, bind: function () {
        this.domElement.find(".save").on("click", this.onSaveClicked), this.domElement.find(".cancel").on("click", this.onCancelClicked), this.domElement.find(".close").on("click", this.onCloseClicked)
    }, createSignals: function () {
        this.onclose = new signals.Signal
    }, buffer: function () {
        this.config = JSON.parse(JSON.stringify(SLConfig))
    }, open: function () {
        this.saved = false, this.domElement.addClass("visible"), this.layout(), $(window).on("resize", this.onWindowResize), $(document).on("keydown", this.onDocumentKeyDown)
    }, close: function () {
        this.domElement.removeClass("visible"), $(window).off("resize", this.onWindowResize), $(document).off("keydown", this.onDocumentKeyDown), this.saved === false && this.revert()
    }, layout: function () {
        if (this.bodyElement.length && this.footerElement.length) {
            var e = this.bodyElement.get(0).scrollHeight, t = this.footerElement.outerHeight(true) + parseInt(this.footerElement.css("margin-top"), 10);
            this.domElement.toggleClass("overflowing", e > window.innerHeight - t)
        }
        this.scrollShadow.sync()
    }, revert: function () {
        this.buffer(), this.updateSelection(), this.applySelection()
    }, save: function () {
        return this.saved = true, true
    }, updateSelection: function () {
    }, applySelection: function () {
    }, onSaveClicked: function () {
        this.save() && this.onclose.dispatch()
    }, onCancelClicked: function () {
        this.onclose.dispatch()
    }, onCloseClicked: function () {
        this.onclose.dispatch()
    }, onDocumentKeyDown: function () {
    }, onWindowResize: function () {
        this.layout()
    }
});

SL("editor.components.sidebar").Export = SL.editor.components.sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .export");
        this.bodyElement = this.domElement.find(".panel-body");
        this.htmlOutputElement = this.domElement.find(".deck-html-contents");
        this.cssOutputElement = this.domElement.find(".deck-css-contents");
        this.downloadRevealElement = this.domElement.find(".section.download-reveal");
        this.downloadHTMLButton = this.domElement.find(".download-html-button");
        this.downloadPDFElement = this.domElement.find(".section.download-pdf");
        this.downloadZIPElement = this.domElement.find(".section.download-zip");
        if (this.downloadPDFElement.length) {
            this.pdf = new SL.editor.components.sidebar.Export.PDF(this.downloadPDFElement);
            this.pdf.heightChanged.add(this.layout.bind(this));
        }
        if (this.downloadZIPElement.length) {
            this.zip = new SL.editor.components.sidebar.Export.ZIP(this.downloadZIPElement);
            this.zip.heightChanged.add(this.layout.bind(this));
        }
        this.setupDropbox();
        this._super();
    }, 
    setupDropbox: function () {
        this.dropboxElement = this.domElement.find(".section.dropbox"), this.dropboxContents = this.dropboxElement.find(".contents"), this.dropboxPollGoal = null, this.onDropboxPoll = this.onDropboxPoll.bind(this), this.onDropboxPollTimeout = this.onDropboxPollTimeout.bind(this), this.dropboxPollJob = new SL.helpers.PollJob({
            interval: 2e3,
            timeout: 3e5
        }), this.dropboxPollJob.polled.add(this.onDropboxPoll), this.dropboxPollJob.ended.add(this.onDropboxPollTimeout)
    }, 
    bind: function () {
        this._super();
        this.downloadHTMLButton && this.downloadHTMLButton.on("click", this.onDownloadHTMLClicked.bind(this));
        this.htmlOutputElement && this.htmlOutputElement.on("click", this.onHTMLOutputClicked.bind(this));
        this.cssOutputElement && this.cssOutputElement.on("click", this.onCSSOutputClicked.bind(this));
        this.domElement.find(".upgrade-button").on("click", function () {
            SL.analytics.trackEditor("Click upgrade link", "export panel")
        });
    }, 
    open: function () {
        this._super();
        this.syncRevealExport();
        this.checkDropboxStatus();
        this.checkOnlineContent();
    }, 
    close: function () {
        this._super();
        this.dropboxStatusXHR && this.dropboxStatusXHR.abort();
        this.dropboxPollJob.stop();
        this.dropboxPollGoal = null;
    }, 
    checkOnlineContent: function () {
        this.bodyElement.find(".section.online-content-warning").remove(), $('.reveal .slides [data-block-type="iframe"]').length && this.bodyElement.prepend(['<div class="section online-content-warning">', "Looks like there are iframes in this presentation. Note that since iframes load content from other servers they won't work without an internet connection.", "</div>"].join(""))
    }, 
    syncRevealExport: function () {
        if (SL.view.isDeveloperMode()) {
            if (this.downloadRevealElement.show(), this.htmlOutputElement.length) {
                var e = SL.view.getCurrentTheme(), t = "theme-font-" + e.get("font"), i = "theme-color-" + e.get("color"), n = ['<div class="' + t + " " + i + '" style="width: 100%; height: 100%;">', '<div class="reveal">', '<div class="slides">', SL.editor.controllers.Serialize.getDeckAsString({
                    removeSlideIds: true,
                    removeBlockIds: true,
                    removeTextPlaceholders: true
                }), "</div>", "</div>", "</div>"].join("");
                this.htmlOutputElement.val(SL.util.html.indent(n))
            }
            this.cssOutputElement.length && (this.cssOutputElement.val("Loading..."), $.ajax({
                url: SL.config.ASSET_URLS["offline-v2.css"],
                context: this
            }).fail(function () {
                this.cssOutputElement.val("Failed to load CSS...")
            }).done(function (e) {
                var t = $("#user-css-output").html() || "", i = $("#theme-css-output").html() || "";
                this.cssOutputElement.val(["<style>", e, i, t, "</style>"].join("\n"))
            }))
        } else this.downloadRevealElement.hide()
    }, 
    checkDropboxStatus: function () {
        0 !== this.dropboxElement.length && (this.dropboxStatusXHR && this.dropboxStatusXHR.abort(), this.dropboxStatusXHR = $.get(SL.config.AJAX_SERVICES_USER).done(function (e) {
            var t = "string" == typeof this.dropboxPollGoal;
            e && e.dropbox_connected ? (this.dropboxContents.html('<p>Your changes are automatically saved to Dropbox. <a href="http://help.slides.com/knowledgebase/articles/229620" target="_blank">Learn more.</a></p><button class="button negative disconnect-dropbox l">Disconnect</button>'), this.dropboxContents.find(".disconnect-dropbox").on("click", this.onDropboxDisconnectClicked.bind(this)), t && "connected" === this.dropboxPollGoal ? (this.dropboxPollJob.stop(), this.dropboxPollGoal = null, $.ajax({
                type: "POST",
                url: SL.config.AJAX_DROPBOX_SYNC_DECK(SLConfig.deck.id),
                data: {}
            })) : SL.view.hasSavedThisSession() || (this.dropboxContents.append('<button class="button outline sync-dropbox l">Sync now</button>'), this.dropboxContents.find(".sync-dropbox").on("click", this.onDropboxSyncClicked.bind(this))), this.layout()) : (this.dropboxContents.html('<p>Connect with Dropbox to automatically sync your work. Decks in your Dropbox folder can be viewed offline. <a href="http://help.slides.com/knowledgebase/articles/229620" target="_blank">Learn more.</a></p><button class="button connect-dropbox l">Connect Dropbox</button>'), this.dropboxContents.find("button").on("click", this.onDropboxConnectClicked.bind(this)), t && "disconnected" === this.dropboxPollGoal && (this.dropboxPollJob.stop(), this.dropboxPollGoal = null), this.layout()), this.dropboxStatusXHR = null
        }.bind(this)))
    }, 
    onDropboxConnectClicked: function () {
        this.dropboxPollGoal = "connected", this.dropboxPollJob.start(), SL.util.openPopupWindow(SL.config.AJAX_DROPBOX_CONNECT, "Sync with Dropbox", 1024, 650)
    }, 
    onDropboxDisconnectClicked: function () {
        this.dropboxPollGoal = "disconnected", this.dropboxPollJob.start(), window.open(SL.config.AJAX_DROPBOX_DISCONNECT)
    }, 
    onDropboxSyncClicked: function () {
        $.ajax({type: "POST", url: SL.config.AJAX_DROPBOX_SYNC_DECK(SLConfig.deck.id), data: {}}).done(function () {
            SL.notify("Dropbox sync started")
        }).fail(function () {
            SL.notify("Dropbox sync failed", "negative")
        })
    }, 
    onDropboxPoll: function () {
        this.checkDropboxStatus()
    },
    onDropboxPollTimeout: function () {
    }, 
    onDownloadHTMLClicked: function () {
        window.open(SL.config.AJAX_EXPORT_DECK(SLConfig.deck.user.username, SLConfig.deck.slug || SLConfig.deck.id)), SL.analytics.trackEditor("Download as HTML")
    }, 
    onHTMLOutputClicked: function () {
        this.htmlOutputElement.select()
    }, 
    onCSSOutputClicked: function () {
        this.cssOutputElement.select()
    }
});

SL("editor.components.sidebar").Export.PDF = Class.extend({
    init: function (e) {
        this.domElement = e, this.downloadButton = this.domElement.find(".download-pdf-button"), this.downloadButton.on("click", this.onDownloadClicked.bind(this)), this.downloadButtonLabel = this.domElement.find(".download-pdf-button .label"), this.downloadButtonLoader = Ladda.create(this.downloadButton.get(0)), this.onPoll = this.onPoll.bind(this), this.onPollTimeout = this.onPollTimeout.bind(this), this.exportID = null, this.pollJob = new SL.helpers.PollJob({
            interval: 1e3,
            timeout: 18e4
        }), this.pollJob.polled.add(this.onPoll), this.pollJob.ended.add(this.onPollTimeout), this.heightChanged = new signals.Signal, this.setIsLoading(false)
    }, startExport: function () {
        this.exportXHR && this.exportXHR.abort(), this.exportXHR = $.ajax({
            url: SL.config.AJAX_EXPORT_START(SLConfig.deck.id),
            type: "POST",
            context: this
        }).done(function (e) {
            this.exportID = e.id, this.exportXHR = null, this.pollJob.start()
        }.bind(this)).fail(function () {
            this.setIsLoading(false), SL.notify(SL.locale.get("EXPORT_PDF_ERROR"), "negative")
        }.bind(this))
    }, setIsLoading: function (e) {
        e ? (this.downloadButtonLabel.text(SL.locale.get("EXPORT_PDF_BUTTON_WORKING")), this.downloadButtonLoader && this.downloadButtonLoader.start()) : (this.downloadButtonLabel.text(SL.locale.get("EXPORT_PDF_BUTTON")), this.downloadButtonLoader && this.downloadButtonLoader.stop())
    }, showPreviousExport: function (e) {
        if ("string" == typeof e && e.length) {
            this.previousExport && (this.previousExport.remove(), this.previousExport = null);
            var t = (SLConfig.deck.slug || "deck") + ".pdf";
            this.previousExport = $('<p class="previous-pdf">Recent: <a href="' + e + '" download="' + t + '" target="_blank">' + t + "</a></p>").appendTo(this.domElement), $("html").addClass("editor-exported-pdf-successfully"), this.heightChanged.dispatch()
        }
    }, onDownloadClicked: function () {
        this.setIsLoading(true), this.startExport(), SL.analytics.trackEditor("Download as PDF")
    }, onPoll: function () {
        this.pdfStatusXHR && this.pdfStatusXHR.abort(), this.pdfStatusXHR = $.get(SL.config.AJAX_EXPORT_STATUS(SLConfig.deck.id, this.exportID)).done(function (e) {
            if ("string" == typeof e.url && e.url.length) {
                var t = $('<iframe style="display: none;">');
                t.appendTo(document.body), t.attr("src", e.url), setTimeout(t.remove, 1e3), this.showPreviousExport(e.url), this.setIsLoading(false), this.pollJob.stop()
            }
        }.bind(this))
    }, onPollTimeout: function () {
        this.setIsLoading(false), SL.notify(SL.locale.get("EXPORT_PDF_ERROR"), "negative")
    }
});

SL("editor.components.sidebar").Export.ZIP = Class.extend({
    init: function (e) {
        this.domElement = e, this.downloadButton = this.domElement.find(".download-zip-button"), this.downloadButton.on("click", this.onDownloadClicked.bind(this)), this.downloadButtonLabel = this.domElement.find(".download-zip-button .label"), this.downloadButtonLoader = Ladda.create(this.downloadButton.get(0)), this.onPoll = this.onPoll.bind(this), this.onPollTimeout = this.onPollTimeout.bind(this), this.exportID = null, this.pollJob = new SL.helpers.PollJob({
            interval: 1e3,
            timeout: 18e4
        }), this.pollJob.polled.add(this.onPoll), this.pollJob.ended.add(this.onPollTimeout), this.heightChanged = new signals.Signal, this.setIsLoading(false)
    }, startExport: function () {
        this.exportXHR && this.exportXHR.abort(), this.exportXHR = $.ajax({
            url: SL.config.AJAX_EXPORT_START(SLConfig.deck.id),
            type: "POST",
            context: this,
            data: {"export": {export_type: "zip"}}
        }).done(function (e) {
            this.exportID = e.id, this.exportXHR = null, this.pollJob.start()
        }.bind(this)).fail(function () {
            this.setIsLoading(false), SL.notify(SL.locale.get("EXPORT_ZIP_ERROR"), "negative")
        }.bind(this))
    }, setIsLoading: function (e) {
        e ? (this.downloadButtonLabel.text(SL.locale.get("EXPORT_ZIP_BUTTON_WORKING")), this.downloadButtonLoader && this.downloadButtonLoader.start()) : (this.downloadButtonLabel.text(SL.locale.get("EXPORT_ZIP_BUTTON")), this.downloadButtonLoader && this.downloadButtonLoader.stop())
    }, showPreviousExport: function (e) {
        if ("string" == typeof e && e.length) {
            this.previousExport && (this.previousExport.remove(), this.previousExport = null);
            var t = (SLConfig.deck.slug || "deck") + ".zip";
            this.previousExport = $('<p class="previous-zip">Recent: <a href="' + e + '" download="' + t + '" target="_blank">' + t + "</a></p>").appendTo(this.domElement), $("html").addClass("editor-exported-zip-successfully"), this.heightChanged.dispatch()
        }
    }, onDownloadClicked: function () {
        this.setIsLoading(true), this.startExport(), SL.analytics.trackEditor("Download as ZIP")
    }, onPoll: function () {
        this.zipStatusXHR && this.zipStatusXHR.abort(), this.zipStatusXHR = $.get(SL.config.AJAX_EXPORT_STATUS(SLConfig.deck.id, this.exportID)).done(function (e) {
            if ("string" == typeof e.url && e.url.length) {
                var t = $('<iframe style="display: none;">');
                t.appendTo(document.body), t.attr("src", e.url), setTimeout(t.remove, 1e3), this.showPreviousExport(e.url), this.setIsLoading(false), this.pollJob.stop()
            }
        }.bind(this))
    }, onPollTimeout: function () {
        this.setIsLoading(false), SL.notify(SL.locale.get("EXPORT_ZIP_ERROR"), "negative")
    }
});

SL("editor.components.sidebar").ImportFile = Class.extend({
    init: function (e) {
        this.panel = e, this.importCompleted = new signals.Signal, this.render(), this.bind(), this.reset(), SL.helpers.StreamEditor.singleton().connect()
    }, render: function () {
        this.domElement = $(".sidebar-panel .import .import-from-file"), this.browseButton = this.domElement.find(".import-browse-button")
    }, bind: function () {
        this.onFileInputChange = this.onFileInputChange.bind(this), this.onSocketMessage = this.onSocketMessage.bind(this)
    }, reset: function () {
        this.hideOverlay(), this.stopTimeout(), this.createFileInput()
    }, createFileInput: function () {
        this.browseFileInput && (this.browseFileInput.remove(), this.browseFileInput.off("change", this.onFileInputChange)), this.browseButton.off("click"), this.browseButton.removeClass("disabled"), this.browseButton.text("Select PDF/PPT file"), this.browseFileInput = $('<input class="file-input" type="file">').appendTo(this.browseButton), this.browseFileInput.on("change", this.onFileInputChange)
    }, onFileInputChange: function (e) {
        e.preventDefault();
        var t = this.browseFileInput.get(0).files[0];
        if (t) {
            if (!t || "" !== t.type && !t.type.match(/powerpoint|presentationml|pdf/))return SL.notify("Only PDF or PPT files, please"), void this.createFileInput();
            if ("number" == typeof t.size && t.size / 1024 > SL.config.MAX_IMPORT_UPLOAD_SIZE.maxsize)return SL.notify("No more than " + Math.round(MAX_IMPORT_UPLOAD_SIZE / 1e3) + "mb please", "negative"), void this.createFileInput();
            SL.analytics.trackEditor("Import PDF/PPT", "file selected");
            var i = t.name || "untitled";
            i = i.trim(), i = i.replace(/\s/g, "-").replace(/[^a-zA-Z0-9-_\.]*/g, ""), this.enterProcessingState(), $.ajax({
                type: "POST",
                url: SL.config.AJAX_PDF_IMPORT_NEW,
                data: {deck_id: SLConfig.deck.id, filename: i},
                context: this
            }).fail(function () {
                SL.notify("Failed to upload, please try again", "negative"), this.hideOverlay()
            }).done(function (e) {
                this.uploadFile(e.id, e.upload_url)
            })
        } else SL.notify("Failed to upload, please try again", "negative")
    }, uploadFile: function (e, t) {
        var i = this.browseFileInput.get(0).files[0];
        if ("string" != typeof t || t.length < 3)return SL.notify("Invalid upload URL, try reopening the imports page", "negative"), void this.createFileInput();
        SL.analytics.trackEditor("Import PDF/PPT", "upload started");
        var n = new SL.helpers.FileUploader({
            file: i,
            method: "PUT",
            external: true,
            formdata: false,
            contentType: true,
            service: t,
            timeout: 9e5
        });
        n.succeeded.add(function () {
            n.destroy(), this.createFileInput(), this.startTimeout(), SL.analytics.trackEditor("Import PDF/PPT", "upload complete"), $.ajax({
                type: "PUT",
                url: SL.config.AJAX_PDF_IMPORT_UPLOADED(e),
                data: {"import": {upload_complete: true}},
                context: this
            }).fail(function () {
                this.hideOverlay(), SL.notify("An error occurred while processing your file", "negative")
            }).done(function () {
                SL.analytics.trackEditor("Import PDF/PPT", "upload_complete sent")
            })
        }.bind(this)), n.progressed.add(function (e) {
            this.setProgress(25 * e)
        }.bind(this)), n.failed.add(function () {
            n.destroy(), this.createFileInput(), this.hideOverlay(), SL.notify("An error occurred while uploading your file", "negative")
        }.bind(this)), n.upload()
    }, showOverlay: function (e, t) {
        this.overlay || (this.overlay = $('<div class="import-overlay">').appendTo(document.body), this.overlayInner = $('<div class="import-overlay-inner">').appendTo(this.overlay), this.overlayHeader = $('<div class="import-overlay-header">').appendTo(this.overlayInner), this.overlayBody = $('<div class="import-overlay-body">').appendTo(this.overlayInner), this.overlayFooter = $('<div class="import-overlay-footer">').appendTo(this.overlayInner), SL.helpers.StreamEditor.singleton().messageReceived.add(this.onSocketMessage), setTimeout(function () {
            this.overlay.addClass("visible")
        }.bind(this), 1)), this.overlayInner.attr("data-state", e), this.overlayHeader.html("<h3>" + t + "</h3>"), this.overlayBody.empty(), this.overlayFooter.empty()
    }, hideOverlay: function () {
        this.overlay && (this.overlay.remove(), this.overlay = null, this.stopTimeout(), SL.helpers.StreamEditor.singleton().messageReceived.remove(this.onSocketMessage))
    }, enterProcessingState: function () {
        this.showOverlay("processing", "Processing"), this.overlayBody.html(['<div class="progress">', '<div class="progress-text">Uploading</div>', '<div class="progress-spinner spinner" data-spinner-color="#333"></div>', '<div class="progress-inner">', '<div class="progress-text">Uploading</div>', "</div>", "</div>"].join("")), SL.util.html.generateSpinners()
    }, enterErrorState: function (e) {
        e = e || {}, this.showOverlay("error", "Something went wrong..."), this.overlayBody.html(['<div class="error">', '<p class="error-text">' + (e.message || "Sorry about that. We're looking into it.") + "</p>", "</div>"].join("")), this.overlayFooter.html(['<button class="button l outline cancel-button">Close</button>'].join("")), this.overlayFooter.find(".cancel-button").on("click", function () {
            this.hideOverlay()
        }.bind(this)), SL.util.html.generateSpinners()
    }, enterFinishedState: function (e) {
        if (SL.analytics.trackEditor("Import PDF/PPT", "import complete"), this.stopTimeout(), e.output && e.output.length > 0) {
            this.showOverlay("finished", "Finished"), this.overlayBody.html(['<p>The following <strong><span class="slide-count"></span> slides</strong> will be added.</p>', '<div class="preview"></div>', '<div class="options">', '<div class="sl-checkbox outline">', '<input id="import-append-checkbox" value="" type="checkbox">', '<label for="import-append-checkbox" data-tooltip="Append the imported slides after any existing slides instead of replacing them." data-tooltip-maxwidth="300">Append slides</label>', "</div>", '<div class="sl-checkbox outline">', '<input id="import-inline-checkbox" value="" type="checkbox">', '<label for="import-inline-checkbox" data-tooltip="Turn this on if you intend to overlay new content on top of imported slides. If left off, slides will be added as background images for the largest possible visual footprint." data-tooltip-maxwidth="300">Insert inline</label>', "</div>", "</div>"].join("")), this.overlayFooter.html(['<button class="button l outline cancel-button">Cancel</button>', '<button class="button l positive confirm-button">Import</button>'].join(""));
            var t = this.overlayBody.find(".preview"), i = function () {
                this.overlayBody.find(".slide-count").text(t.find(".preview-slide").not(".excluded").length)
            }.bind(this);
            e.output.forEach(function (e) {
                var n = $('<div class="preview-slide">');
                n.attr({
                    "data-background-image": e,
                    "data-background-image-original": e
                }), n.appendTo(t), n.on("click", function () {
                    n.hasClass("excluded") ? n.removeClass("excluded").html("") : n.addClass("excluded").html('<div class="preview-slide-excluded-overlay"><span class="icon i-denied"></span></div>'), i()
                }.bind(this))
            }.bind(this)), t.on("scroll", this.loadVisiblePreviewThumbs.bind(this)), this.loadVisiblePreviewThumbs(), this.checkImportResolution(e.output[0]), i()
        } else this.showOverlay("finished-error", "Unexpected Error"), this.overlayBody.html("No slides were returned from the server."), this.overlayFooter.html('<button class="button l outline cancel-button">Close</button>');
        this.overlayFooter.find(".cancel-button").on("click", function () {
            this.hideOverlay()
        }.bind(this)), this.overlayFooter.find(".confirm-button").on("click", function () {
            var e, i = this.overlayBody.find("#import-append-checkbox").is(":checked"), n = this.overlayBody.find("#import-inline-checkbox").is(":checked");
            if (n) {
                var r = SL.config.SLIDE_WIDTH, o = SL.config.SLIDE_HEIGHT, s = this.importWidth, a = this.importHeight;
                if (!s || !a)return void SL.notify("Unable to detect slide width/height for inline layout. Please try a new import.", "negative");
                e = t.find(".preview-slide").not(".excluded").map(function () {
                    return "<section>" + SL.data.templates.generateFullSizeImageBlock($(this).attr("data-background-image-original"), s, a, r, o) + "</section>"
                })
            } else e = t.find(".preview-slide").not(".excluded").map(function () {
                return '<section data-background-image="' + $(this).attr("data-background-image-original") + '" data-background-size="contain"></section>'
            });
            SL.editor.controllers.Markup.importSlides(e, !i), i || (SLConfig.deck.background_transition = "none", Reveal.configure({backgroundTransition: SLConfig.deck.background_transition})), this.hideOverlay(), this.importCompleted.dispatch()
        }.bind(this))
    }, checkImportResolution: function (e, t) {
        this.importWidth = null, this.importHeight = null;
        var i = new Image;
        i.addEventListener("load", function () {
            this.importWidth = i.naturalWidth, this.importHeight = i.naturalHeight, SL.util.callback(t)
        }.bind(this)), i.setAttribute("src", e)
    }, loadVisiblePreviewThumbs: function () {
        var e = this.overlayBody.find(".preview");
        if (e.length) {
            var t = e.scrollTop(), i = t + e.outerHeight(), n = e.find(".preview-slide").first().outerHeight();
            e.find(".preview-slide").not(".loaded").each(function (e, r) {
                var o = r.offsetTop, s = o + n;
                s > t && i > o && (r = $(r), r.css("background-image", 'url("' + r.attr("data-background-image") + '")'), r.addClass("loaded"))
            })
        }
    }, setProgress: function (e) {
        this.overlayBody.find(".progress-inner").css("width", Math.round(e) + "%")
    }, startTimeout: function () {
        clearTimeout(this.importTimeout), this.importTimeout = setTimeout(function () {
            SL.notify("Timed out while trying to import. Please try again.", "negative"), this.hideOverlay()
        }.bind(this), SL.config.IMPORT_SOCKET_TIMEOUT)
    }, stopTimeout: function () {
        clearTimeout(this.importTimeout)
    }, onSocketMessage: function (e) {
        if (e) {
            var t = e.type.split(":")[0], i = e.type.split(":")[1];
            "import" === t && ("complete" === i ? this.enterFinishedState(e) : "error" === i ? this.enterErrorState(e) : (this.startTimeout(), this.overlayBody.find(".progress-text").text(e.message), this.setProgress(25 + 75 * e.progress)))
        }
    }
});

SL("editor.components.sidebar").ImportReveal = Class.extend({
    init: function (e) {
        this.panel = e, this.domElement = $(".sidebar-panel .import .import-from-reveal"), this.importInput = this.domElement.find(".import-input"), this.importStatus = this.domElement.find(".import-status"), this.importStatusText = this.domElement.find(".import-status .text"), this.importStatusIcon = this.domElement.find(".import-status .icon"), this.importStatusProceed = this.domElement.find(".import-status .proceed"), this.importCompleted = new signals.Signal, this.bind()
    }, bind: function () {
        this.importInput.on("input", this.onInputChange.bind(this)), this.importStatusProceed.on("click", this.onImportConfirmed.bind(this))
    }, reset: function () {
        this.importInput.val(""), this.importStatus.removeClass("visible")
    }, validate: function () {
        var e, t, i = $.trim(this.importInput.val());
        if (i.length > 2) {
            try {
                e = $(i)
            } catch (n) {
                t = "Failed to read HTML, make sure it's valid"
            }
            if (e && (e = e.not("meta, script, link, style"), e.find("meta, script, link, style").remove(), e.is(".slides") && (e = $("<div>").append(e)), 0 === e.find(".slides>section").length && (t = "Couldn't find any sections inside of .slides"), 0 === e.find(".slides").length && (t = "Couldn't find a .slides container")), this.importStatus.addClass("visible"), !t) {
                var r = e.find(".slides section").length;
                return this.importStatus.attr("data-state", "success"), this.importStatusText.html("Ready to import <strong>" + r + "</strong> slides."), this.importStatusIcon.removeClass("i-bolt").addClass("i-checkmark"), e.find(".slides>section")
            }
            this.importStatus.attr("data-state", "error"), this.importStatusText.html(t), this.importStatusIcon.removeClass("i-checkmark").addClass("i-bolt")
        } else this.importStatus.removeClass("visible");
        return null
    }, onInputChange: function () {
        this.validate()
    }, onImportConfirmed: function (e) {
        var t = this.validate();
        t && t.length && SL.prompt({
            anchor: $(e.currentTarget),
            title: SL.locale.get("DECK_IMPORT_HTML_CONFIRM"),
            type: "select",
            data: [{html: "<h3>Cancel</h3>"}, {
                html: "<h3>Import</h3>",
                selected: true,
                className: "positive",
                callback: function () {
                    SL.editor.controllers.Markup.importSlides(t, true), this.reset(), this.importCompleted.dispatch()
                }.bind(this)
            }]
        })
    }
});

SL("editor.components.sidebar").Import = SL.editor.components.sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .import"), this._super()
    }, setupFileImport: function () {
        this.importFile ? this.importFile.reset() : (this.importFile = new SL.editor.components.sidebar.ImportFile(this), this.importFile.importCompleted.add(this.onImportCompleted.bind(this)))
    }, setupRevealImport: function () {
        this.importReveal ? this.importReveal.reset() : (this.importReveal = new SL.editor.components.sidebar.ImportReveal(this), this.importReveal.importCompleted.add(this.onImportCompleted.bind(this)))
    }, open: function () {
        SL.view.isNewDeck() ? SL.view.save(function () {
            this.setupFileImport()
        }.bind(this)) : this.setupFileImport(), this.setupRevealImport(), this._super()
    }, close: function () {
        this._super()
    }, onImportCompleted: function () {
        this.close(), this.onclose.dispatch()
    }
});

SL("editor.components.sidebar").Revisions = SL.editor.components.sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .revisions"), this.listElement = this.domElement.find(".version-list"), this.panelBody = this.domElement.find(".panel-body"), this._super()
    }, bind: function () {
        this._super(), this.onPanelScroll = this.onPanelScroll.bind(this), this.onPanelScroll = $.debounce(this.onPanelScroll, 200)
    }, reset: function () {
        this.loadedAllPages = false, this.loading = false, this.page = 1, this.listElement.empty(), this.domElement.attr("data-state", "loading")
    }, open: function () {
        this.reset(), clearTimeout(this.loadTimeout), this.loadTimeout = setTimeout(this.load.bind(this), 500), this.panelBody.on("scroll", this.onPanelScroll), this._super()
    }, close: function () {
        this._super(), clearTimeout(this.loadTimeout), this.panelBody.off("scroll", this.onPanelScroll)
    }, load: function () {
        this.loading || this.loadedAllPages || (this.loading = true, $.ajax({
            url: SL.config.AJAX_GET_DECK_VERSIONS(SLConfig.deck.id, this.page),
            data: {page: this.page},
            context: this
        }).done(function (e) {
            this.addVersions(e.results), this.layout(), 0 === e.results.length && (this.loadedAllPages = true)
        }).fail(function () {
            SL.notify(SL.locale.get("GENERIC_ERROR")), this.domElement.attr("data-state", "error"), this.layout()
        }).always(function () {
            this.loading = false, this.page += 1
        }))
    }, addVersions: function (e) {
        e.forEach(this.addVersion.bind(this)), SL.view.parseTimes(), this.listElement.find("li").length > 0 ? this.domElement.attr("data-state", "populated") : this.domElement.attr("data-state", "empty")
    }, addVersion: function (e) {
        var t = $("<li>").appendTo(this.listElement), i = $('<span class="text">').appendTo(t);
        i.append(moment(e.created_at).format("MMM DD, hh:mm a")), i.append(' <time class="ago de-em" datetime="' + e.created_at + '"></time>');
        var n = $('<div class="actions">').appendTo(t), r = $('<button class="button outline restore" data-tooltip="Restore" data-tooltip-delay="500"><span class="icon i-undo"></button>').appendTo(n);
        r.on("click", this.onRestoreClicked.bind(this, e));
        var o = $('<a class="button outline preview" data-tooltip="Preview" data-tooltip-delay="500"><span class="icon i-eye"></span></a>').appendTo(n);
        o.attr({
            href: SL.config.AJAX_PREVIEW_DECK_VERSION(SLConfig.deck.user.username, SLConfig.deck.slug || SLConfig.deck.id, e.content_uuid),
            target: "_blank"
        }), o.on("click", this.onPreviewClicked.bind(this, e, o))
    }, onPreviewClicked: function (e, t, i) {
        var n = t.attr("href"), r = SL.popup.open(SL.components.popup.Revision, {
            revisionURL: n,
            revisionTimeAgo: moment(e.created_at).fromNow()
        });
        r.restoreRequested.add(this.onRestoreClicked.bind(this, e)), r.externalRequested.add(this.onExternalClicked.bind(this, n)), SL.analytics.trackEditor("Revision preview"), i.preventDefault()
    }, onRestoreClicked: function (e, t) {
        SL.prompt({
            anchor: $(t.currentTarget),
            title: SL.locale.get("DECK_RESTORE_CONFIRM", {time: moment(e.created_at).fromNow()}),
            type: "select",
            data: [{html: "<h3>Cancel</h3>"}, {
                html: "<h3>Restore</h3>",
                selected: true,
                className: "negative",
                callback: this.onRestoreConfirmed.bind(this, e)
            }]
        }), t.preventDefault()
    }, onRestoreConfirmed: function (e) {
        SL.analytics.trackEditor("Revision restore"), SL.helpers.PageLoader.show({message: "Restoring..."}), $.ajax({
            type: "post",
            url: SL.config.AJAX_RESTORE_DECK_VERSION(SLConfig.deck.id, e.id),
            data: e,
            context: this
        }).done(function (e) {
            e && "string" == typeof e.slug ? window.location = SL.routes.DECK_EDIT(SLConfig.deck.user.username, e.slug || SLConfig.deck.id) : window.location.reload()
        }).fail(function () {
            SL.notify(SL.locale.get("GENERIC_ERROR")), this.layout(), SL.helpers.PageLoader.hide()
        })
    }, onExternalClicked: function (e, t) {
        window.open(e), t.preventDefault()
    }, onPanelScroll: function () {
        var e = this.panelBody.scrollTop(), t = this.panelBody.prop("scrollHeight"), i = this.panelBody.outerHeight(), n = e / (t - i);
        n > .8 && this.load()
    }
});

SL("editor.components.sidebar").Settings = SL.editor.components.sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .settings");
        this.rtlToggle = this.domElement.find('.sl-checkbox input[value="rtl"]');
        this.loopToggle = this.domElement.find('.sl-checkbox input[value="should_loop"]');
        this.commentsEnabledToggle = this.domElement.find('.sl-checkbox input[value="comments_enabled"]');
        this.forkingEnabledToggle = this.domElement.find('.sl-checkbox input[value="forking_enabled"]');
        this.shareNotesToggle = this.domElement.find('.sl-checkbox input[value="share_notes"]');
        this.slideNumberToggle = this.domElement.find('.sl-checkbox input[value="slide_number"]');
        this.titleInput = this.domElement.find("#deck-input-title");
        this.descriptionInput = this.domElement.find("#deck-input-description");
        this.slug = this.domElement.find(".slug");
        this.slugInput = this.domElement.find("#deck-input-slug");
        this.slugPrefix = this.domElement.find(".slug .text-prefix");
        this.autoSlideInput = this.domElement.find("#deck-input-autoslide");
        this.renderAutoSlideOptions();
        this._super();
    }, renderAutoSlideOptions: function () {
        var e = '<option value="0">Off</option>';
        SL.config.AUTO_SLIDE_OPTIONS.forEach(function (t) {
            e += '<option value="' + 1e3 * t + '">' + t + " seconds</option>"
        }), this.autoSlideInput.html(e)
    }, bind: function () {
        this._super(), this.domElement.find(".sl-checkbox input").on("change", this.onToggleChange.bind(this)), this.titleInput.on("input", this.onTitleInput.bind(this)), this.slugInput.on("input", this.onSlugInput.bind(this)), this.slugInput.on("focus", this.onSlugFocus.bind(this)), this.slugInput.on("blur", this.onSlugBlur.bind(this)), this.descriptionInput.on("keypress", this.onDescriptionKeyPress.bind(this))
    }, open: function () {
        this._super(), this.buffer(), this.updateSelection(), this.titleInput.val(SL.util.unescapeHTMLEntities(this.config.deck.title || "")), this.slugInput.val(this.config.deck.slug), this.descriptionInput.val(SL.util.unescapeHTMLEntities(this.config.deck.description || "")), this.autoSlideInput.val(this.config.deck.auto_slide_interval || 0), this.slugPrefix.text(window.location.host + "/" + SLConfig.current_user.username + "/"), this.slugInput.css("padding-left", this.slugPrefix.position().left + this.slugPrefix.width())
    }, close: function () {
        this._super()
    }, save: function () {
        var e = this.titleInput.val(), t = this.slugInput.val(), i = this.descriptionInput.val();
        return e ? t ? (this._super(), SLConfig.deck.title = e, SLConfig.deck.description = i ? i.replace(/\n/g, " ") : "", SLConfig.deck.slug = t, SLConfig.deck.rtl = this.rtlToggle.is(":checked"), SLConfig.deck.should_loop = this.loopToggle.is(":checked"), SLConfig.deck.comments_enabled = this.commentsEnabledToggle.is(":checked"), SLConfig.deck.forking_enabled = this.forkingEnabledToggle.is(":checked"), SLConfig.deck.share_notes = this.shareNotesToggle.is(":checked"), SLConfig.deck.slide_number = this.slideNumberToggle.is(":checked"), SLConfig.deck.auto_slide_interval = parseInt(this.autoSlideInput.val(), 10) || 0, SLConfig.deck.dirty = true, SL.analytics.trackEditor("Deck.edit: Setting saved"), $("html").toggleClass("rtl", SLConfig.deck.rtl), true) : (SL.notify(SL.locale.get("DECK_EDIT_INVALID_SLUG"), "negative"), false) : (SL.notify(SL.locale.get("DECK_EDIT_INVALID_TITLE"), "negative"), false)
    }, updateSelection: function () {
        this.rtlToggle.prop("checked", this.config.deck.rtl), this.loopToggle.prop("checked", this.config.deck.should_loop), this.commentsEnabledToggle.prop("checked", this.config.deck.comments_enabled), this.forkingEnabledToggle.prop("checked", this.config.deck.forking_enabled), this.shareNotesToggle.prop("checked", this.config.deck.share_notes), this.slideNumberToggle.prop("checked", this.config.deck.slide_number)
    }, applySelection: function () {
        Reveal.configure({
            rtl: this.rtlToggle.is(":checked"),
            loop: this.loopToggle.is(":checked"),
            slideNumber: this.slideNumberToggle.is(":checked")
        })
    }, generateSlug: function () {
        if (this.deckIsPrivate() && this.slugIsUnchanged() || this.slugWasManuallyCleared) {
            var e = this.titleInput.val(), t = SL.util.string.slug(e);
            this.slugInput.val(t)
        }
    }, deckIsPrivate: function () {
        return SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF
    }, slugIsUnchanged: function () {
        return (SLConfig.deck.slug || "") === (SL.util.string.slug(SLConfig.deck.title) || "")
    }, onToggleChange: function () {
        this.applySelection()
    }, onTitleInput: function () {
        this.generateSlug()
    }, onDescriptionKeyPress: function (e) {
        return 13 == e.keyCode ? false : void 0
    }, onSlugInput: function () {
        this.slugWasManuallyCleared = "" === this.slugInput.val()
    }, onSlugFocus: function () {
        this.deckIsPrivate() || SL.tooltip.show("Changing the URL of your deck will break existing links to it.", {
            anchor: this.slugInput,
            alignment: "r",
            maxwidth: 220
        })
    }, onSlugBlur: function () {
        SL.tooltip.hide(), this.slugInput.val(SL.util.string.slug(this.slugInput.val()))
    }
});

SL("editor.components.sidebar").Style = SL.editor.components.sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .style"), this._super()
    }, bind: function () {
        this._super(), this.domElement.find(".edit-style").on("click", this.onAdvancedStylesCLicked.bind(this))
    }, scroll: function () {
        this.domElement.find(".panel-body").scrollTop(0), $(".page-wrapper").scrollTop(0)
    }, open: function () {
        this._super(), this.themeoptions ? this.themeoptions.populate(SL.models.Theme.fromDeck(SLConfig.deck)) : (this.themeoptions = new SL.components.ThemeOptions({
            center: false,
            rollingLinks: false,
            fonts: SL.config.THEME_FONTS,
            colors: SL.config.THEME_COLORS,
            themes: SL.current_user.getThemes(),
            model: SL.models.Theme.fromDeck(SLConfig.deck),
            container: this.domElement.find(".panel-body")
        }), this.themeoptions.changed.add(this.onThemeOptionsChanged.bind(this)), SL.fonts.loadAll()), this.scroll(), this.layout()
    }, close: function () {
        this._super()
    }, revert: function () {
        this._super(), SL.helpers.ThemeController.paint(SL.view.getCurrentTheme(), {center: false, js: false})
    }, save: function () {
        var e = SL.view.getCurrentTheme(), t = this.themeoptions.getTheme(), i = e.get("id") == t.get("id"), n = (e.get("js") || "") == (t.get("js") || "");
        return i || n ? (this._super(), this.saveData(), true) : (this.promptReload(), false)
    }, saveData: function () {
        var e = this.themeoptions.getTheme();
        SLConfig.deck.dirty = true, SLConfig.deck.theme_id = e.get("id"), SLConfig.deck.theme_font = e.get("font"), SLConfig.deck.theme_color = e.get("color"), SLConfig.deck.center = e.get("center"), SLConfig.deck.rolling_links = e.get("rolling_links"), SLConfig.deck.transition = e.get("transition"), SLConfig.deck.background_transition = e.get("background_transition"), Reveal.configure({
            center: false,
            rolling_links: SLConfig.deck.rolling_links,
            transition: SLConfig.deck.transition,
            backgroundTransition: SLConfig.deck.background_transition
        }), SL.editor.controllers.Thumbnail.invalidate(), SL.editor.controllers.Contrast.sync(), SL.view.onThemeChanged()
    }, promptReload: function () {
        SL.prompt({
            anchor: this.domElement.find(".save"),
            title: "The editor needs to reload to apply your changes.",
            alignment: "t",
            type: "select",
            data: [{html: "<h3>Cancel</h3>"}, {
                html: "<h3>Continue</h3>",
                className: "positive",
                callback: this.saveAndReload.bind(this)
            }]
        })
    }, saveAndReload: function () {
        this.saveData(), SL.view.save(function () {
            window.location.reload()
        }), SL.prompt({
            anchor: this.domElement.find(".save"),
            title: 'Saving and reloading...<div class="spinner centered-horizontally" data-spinner-color="#777"></div>',
            alignment: "t",
            optional: false,
            options: []
        }), SL.util.html.generateSpinners()
    }, onAdvancedStylesCLicked: function () {
        SL.analytics.trackEditor("Open CSS editor"), SL.editor.controllers.Mode.change("css")
    }, onThemeOptionsChanged: function () {
        this.layout(), SL.editor.controllers.Grid.refresh()
    }
});