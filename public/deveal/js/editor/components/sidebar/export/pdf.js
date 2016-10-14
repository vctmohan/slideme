SL("editor.components.sidebar").Export.PDF = Class.extend({
    init: function (e) {
        this.domElement = e;
        this.downloadButton = this.domElement.find(".download-pdf-button");
        this.downloadButton.on("click", this.onDownloadClicked.bind(this));
        this.downloadButtonLabel = this.domElement.find(".download-pdf-button .label");
        this.downloadButtonLoader = Ladda.create(this.downloadButton.get(0));
        this.onPoll = this.onPoll.bind(this);
        this.onPollTimeout = this.onPollTimeout.bind(this);
        this.exportID = null;
        this.pollJob = new SL.helpers.PollJob({
            interval: 1000,
            timeout: 180000
        });
        this.pollJob.polled.add(this.onPoll);
        this.pollJob.ended.add(this.onPollTimeout);
        this.heightChanged = new signals.Signal;
        this.setIsLoading(false);
    },
    startExport: function () {
        if (this.exportXHR) {
            this.exportXHR.abort();
        }
        this.exportXHR = $.ajax({
            url: SL.config.AJAX_EXPORT_START(SLConfig.deck.id),
            type: "POST",
            context: this,
            data: {"export": {export_type: "pdf"}}
        }).done(function (e) {
            this.exportID = e.id;
            this.exportXHR = null;
            this.pollJob.start();
        }.bind(this)).fail(function () {
            this.setIsLoading(false);
            SL.notify(SL.locale.get("EXPORT_PDF_ERROR"), "negative");
        }.bind(this))
    },
    setIsLoading: function (e) {
        if (e) {
            this.downloadButtonLabel.text(SL.locale.get("EXPORT_PDF_BUTTON_WORKING"));
            if (this.downloadButtonLoader) {
                this.downloadButtonLoader.start();
            }
        } else {
            this.downloadButtonLabel.text(SL.locale.get("EXPORT_PDF_BUTTON"));
            if (this.downloadButtonLoader) {
                this.downloadButtonLoader.stop()
            }
        }
    },
    showPreviousExport: function (e) {
        if ("string" == typeof e && e.length) {
            if (this.previousExport) {
                this.previousExport.remove();
                this.previousExport = null;
            }
            var t = (SLConfig.deck.slug || "deck") + ".pdf";
            this.previousExport = $('<p class="previous-pdf">Recent: <a href="' + e + '" download="' + t + '" target="_blank">' + t + "</a></p>").appendTo(this.domElement);
            $("html").addClass("editor-exported-pdf-successfully");
            this.heightChanged.dispatch();
        }
    }    ,
    onDownloadClicked: function () {
        this.setIsLoading(true);
        this.startExport();
    },
    onPoll: function () {
        this.pdfStatusXHR && this.pdfStatusXHR.abort();
        this.pdfStatusXHR = $.get(SL.config.AJAX_EXPORT_STATUS(SLConfig.deck.id, this.exportID)).done(function (e) {
            if ("string" == typeof e.url && e.url.length) {
                var t = $('<iframe style="display: none;">');
                t.appendTo(document.body);
                t.attr("src", e.url);
                setTimeout(t.remove, 1000);
                this.showPreviousExport(e.url);
                this.setIsLoading(false);
                this.pollJob.stop();
            }
        }.bind(this));
    }    ,
    onPollTimeout: function () {
        this.setIsLoading(false);
        SL.notify(SL.locale.get("EXPORT_PDF_ERROR"), "negative");
    }
});
