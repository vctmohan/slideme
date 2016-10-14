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
