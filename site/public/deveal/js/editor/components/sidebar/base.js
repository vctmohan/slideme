SL("editor.components.sidebar").Base = Class.extend({
    init: function () {
        this.saved = false;
        this.onWindowResize = this.onWindowResize.bind(this);
        this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this), this.onSaveClicked = this.onSaveClicked.bind(this), this.onCancelClicked = this.onCancelClicked.bind(this), this.onCloseClicked = this.onCloseClicked.bind(this), this.render(), this.bind(), this.createSignals()
    },
    render: function () {
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
