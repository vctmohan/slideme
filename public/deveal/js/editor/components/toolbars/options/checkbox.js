SL("editor.components.toolbars.options").Checkbox = SL.editor.components.toolbars.options.Value.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "checkbox"}, t))
    }, render: function () {
        this._super(), this.domElement.addClass("toolbar-checkbox"), this.checkboxElement = $('<span class="checkbox icon i-checkmark">'), this.checkboxElement.appendTo(this.domElement)
    }, setValue: function (e, t) {
        this.domElement.toggleClass("checked", e), this._super(e, t)
    }, getValue: function () {
        return this.domElement.hasClass("checked")
    }, onClicked: function (e) {
        this._super(e), this.setValue(!this.getValue(), true)
    }
});