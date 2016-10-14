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
