SL("editor.components.toolbars.options").Color = SL.editor.components.toolbars.options.Value.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "color", alpha: false}, t))
    }, render: function () {
        this._super(), this.domElement.addClass("toolbar-color"), this.triggerElement = $('<div class="toolbar-color-trigger">'), this.triggerElement.appendTo(this.domElement), this.triggerInnerElement = $('<div class="toolbar-color-trigger-inner">'), this.triggerInnerElement.appendTo(this.triggerElement), this.resetElement = $('<div class="toolbar-color-reset icon i-undo" data-tooltip="Use default color" data-tooltip-delay="500">'), this.resetElement.appendTo(this.triggerElement)
    }, bind: function () {
        this._super(), this.triggerInnerElement.on("vclick", this.onTriggerClicked.bind(this)), this.resetElement.on("vclick", this.onResetClicked.bind(this))
    }, readFromBlock: function () {
        this._super(), this.syncTriggerUI()
    }, setValue: function (e, t) {
        this._super(e, t), this.syncTriggerUI()
    }, syncTriggerUI: function () {
        var e = this.getTriggerColor();
        this.triggerElement.toggleClass("transparent", tinycolor(e).getAlpha() < 1), this.triggerInnerElement.css("background-color", e)
    }, getTriggerColor: function () {
        return this.value
    }, getColorpickerConfig: function () {
        return {
            anchor: this.triggerElement,
            alignment: "r",
            alpha: this.config.alpha,
            color: this.getValue(),
            changeCallback: this.setValue.bind(this),
            resetCallback: this.onResetClicked.bind(this)
        }
    }, onPanelShown: function () {
        this.readFromBlock(), this.domElement.addClass("is-active")
    }, onPanelHidden: function () {
        this.pickerWrapper.spectrum("saveCurrentSelection"), this.domElement.removeClass("is-active")
    }, onTriggerClicked: function () {
        SL.view.colorpicker.toggle(this.getColorpickerConfig())
    }, onResetClicked: function () {
        this.setValue(this.getDefaultValue() || "", true), this.readFromBlock(), SL.view.colorpicker.hide()
    }, destroy: function () {
        this._super()
    }
});