SL("editor.components.toolbars.options").Value = SL.editor.components.toolbars.options.Base.extend({
    init: function (e, t) {
        this._super(e, t), this.changed = new signals.Signal, this.value = this.getDefaultValue()
    }, appendTo: function (e) {
        this._super(e), this.readFromBlock()
    }, readFromBlock: function () {
        this.setValue(this.block.get(this.config.property))
    }, writeToBlock: function () {
        this.block.set(this.config.property, this.getValue())
    }, setValue: function (e, t) {
        this.value = e, t && (this.writeToBlock(), this.changed.dispatch(this.value))
    }, getValue: function () {
        return this.value
    }, getDefaultValue: function () {
        return this.block.getPropertyDefault(this.config.property)
    }, getUnit: function () {
        return this.property.unit ? this.property.unit : ""
    }, destroy: function () {
        this.changed.dispose(), this._super()
    }
});