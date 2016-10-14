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
        this._super();
    },
    bind: function () {
        this._super();
        this.downloadHTMLButton && this.downloadHTMLButton.on("click", this.onDownloadHTMLClicked.bind(this));
        this.htmlOutputElement && this.htmlOutputElement.on("click", this.onHTMLOutputClicked.bind(this));
        this.cssOutputElement && this.cssOutputElement.on("click", this.onCSSOutputClicked.bind(this));
    },
    open: function () {
        this._super();
        this.syncRevealExport();
        this.checkOnlineContent();
    },
    close: function () {
        this._super();
    },
    checkOnlineContent: function () {
        this.bodyElement.find(".section.online-content-warning").remove();
        if ($('.reveal .slides [data-block-type="iframe"]').length) {
            this.bodyElement.prepend([
                '<div class="section online-content-warning">',
                "Looks like there are iframes in this presentation. Note that since iframes load content from other servers they won't work without an internet connection.",
                "</div>"].join(""));
        }
    },
    syncRevealExport: function () {
        if (SL.view.isDeveloperMode()) {
            this.downloadRevealElement.show();
            if (this.htmlOutputElement.length) {
                var e = SL.view.getCurrentTheme();
                t = "theme-font-" + e.get("font");
                i = "theme-color-" + e.get("color");
                n = ['<div class="' + t + " " + i + '" style="width: 100%; height: 100%;">',
                    '<div class="reveal">',
                    '<div class="slides">',
                    SL.editor.controllers.Serialize.getDeckAsString({
                        removeSlideIds: true,
                        removeBlockIds: true,
                        removeTextPlaceholders: true
                    }),
                    "</div>",
                    "</div>",
                    "</div>"].join("");
                this.htmlOutputElement.val(SL.util.html.indent(n))
            }
            if (this.cssOutputElement.length) {
                this.cssOutputElement.val("Loading...");
                $.ajax({
                    url: SL.config.ASSET_URLS["offline-v2.css"],
                    context: this
                }).fail(function () {
                    this.cssOutputElement.val("Failed to load CSS...");
                }).done(function (e) {
                    var t = $("#user-css-output").html() || "";
                    i = $("#theme-css-output").html() || "";
                    this.cssOutputElement.val(["<style>", e, i, t, "</style>"].join("\n"));
                })
            }
        } else {
            this.downloadRevealElement.hide()
        }
    },
    onDownloadHTMLClicked: function () {
        window.open(SL.config.AJAX_EXPORT_DECK(SLConfig.deck.user.username, SLConfig.deck.slug || SLConfig.deck.id));
    },
    onHTMLOutputClicked: function () {
        this.htmlOutputElement.select()
    },
    onCSSOutputClicked: function () {
        this.cssOutputElement.select()
    }
});
