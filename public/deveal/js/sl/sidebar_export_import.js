SL("editor.components.sidebar").Export = SL.editor.components.sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .export"), this.bodyElement = this.domElement.find(".panel-body"), this.htmlOutputElement = this.domElement.find(".deck-html-contents"), this.cssOutputElement = this.domElement.find(".deck-css-contents"), this.downloadRevealElement = this.domElement.find(".section.download-reveal"), this.downloadHTMLButton = this.domElement.find(".download-html-button"), this.downloadPDFElement = this.domElement.find(".section.download-pdf"), this.downloadZIPElement = this.domElement.find(".section.download-zip"), this.downloadPDFElement.length && (this.pdf = new SL.editor.components.sidebar.Export.PDF(this.downloadPDFElement), this.pdf.heightChanged.add(this.layout.bind(this))), this.downloadZIPElement.length && (this.zip = new SL.editor.components.sidebar.Export.ZIP(this.downloadZIPElement), this.zip.heightChanged.add(this.layout.bind(this))), this.setupDropbox(), this._super()
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
    }, 
    open: function () {
        this._super(), this.syncRevealExport(), this.checkDropboxStatus(), this.checkOnlineContent()
    }, 
    close: function () {
        this._super(), this.dropboxStatusXHR && this.dropboxStatusXHR.abort(), this.dropboxPollJob.stop(), this.dropboxPollGoal = null
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
        window.open(SL.config.AJAX_EXPORT_DECK(SLConfig.deck.user.username, SLConfig.deck.slug || SLConfig.deck.id))
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
            this.setIsLoading(true), this.startExport()
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
            this.setIsLoading(true), this.startExport()
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
                n.destroy();
                this.createFileInput();
                this.startTimeout();
                $.ajax({
                    type: "PUT",
                    url: SL.config.AJAX_PDF_IMPORT_UPLOADED(e),
                    data: {"import": {upload_complete: true}},
                    context: this
                }).fail(function () {
                    this.hideOverlay(), SL.notify("An error occurred while processing your file", "negative")
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
        }, 
    enterFinishedState: function (e) {
            if (this.stopTimeout(), e.output && e.output.length > 0) {
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
        }, 
    checkImportResolution: function (e, t) {
            this.importWidth = null, this.importHeight = null;
            var i = new Image;
            i.addEventListener("load", function () {
                this.importWidth = i.naturalWidth, this.importHeight = i.naturalHeight, SL.util.callback(t)
            }.bind(this)), i.setAttribute("src", e)
        }, 
    loadVisiblePreviewThumbs: function () {
            var e = this.overlayBody.find(".preview");
            if (e.length) {
                var t = e.scrollTop(), i = t + e.outerHeight(), n = e.find(".preview-slide").first().outerHeight();
                e.find(".preview-slide").not(".loaded").each(function (e, r) {
                    var o = r.offsetTop, s = o + n;
                    s > t && i > o && (r = $(r), r.css("background-image", 'url("' + r.attr("data-background-image") + '")'), r.addClass("loaded"))
                })
            }
        },
    setProgress: function (e) {
            this.overlayBody.find(".progress-inner").css("width", Math.round(e) + "%")
        },
    startTimeout: function () {
            clearTimeout(this.importTimeout), this.importTimeout = setTimeout(function () {
                SL.notify("Timed out while trying to import. Please try again.", "negative"), this.hideOverlay()
            }.bind(this), SL.config.IMPORT_SOCKET_TIMEOUT)
        }, 
    stopTimeout: function () {
            clearTimeout(this.importTimeout)
        }, 
    onSocketMessage: function (e) {
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
            r.restoreRequested.add(this.onRestoreClicked.bind(this, e)), r.externalRequested.add(this.onExternalClicked.bind(this, n)), i.preventDefault()
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
           SL.helpers.PageLoader.show({message: "Restoring..."}), $.ajax({
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
  