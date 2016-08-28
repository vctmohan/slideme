SL("editor.components.toolbars.options").Range = SL.editor.components.toolbars.options.Value.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "range"}, t))
    }, render: function () {
        this._super(), this.domElement.addClass("toolbar-range"), this.rangeElement = $('<div class="range">'), this.rangeElement.appendTo(this.domElement), this.rangeProgressElement = $('<div class="range-progress">').appendTo(this.rangeElement), this.rangeNumericElement = $('<div class="range-numeric">').appendTo(this.rangeElement)
    }, bind: function () {
        this._super(), this.changed = new signals.Signal, this.onMouseDown = this.onMouseDown.bind(this), this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.rangeElement.on("vmousedown", this.onMouseDown)
    }, setValue: function (e, t) {
        e = Math.max(Math.min(e, this.property.maxValue), this.property.minValue), this.rangeProgressElement.css("width", this.valueToPercent(e) + "%"), this._super(e, t), this.rangeNumericElement.text(this.getValue().toFixed(this.property.decimals) + this.getUnit())
    }, getValue: function () {
        var e = this.percentToValue(parseInt(this.rangeProgressElement.get(0).style.width, 10)), t = Math.pow(10, this.property.decimals);
        return Math.round(e * t) / t
    }, valueToPercent: function (e) {
        var t = (e - this.property.minValue) / (this.property.maxValue - this.property.minValue) * 100;
        return Math.max(Math.min(t, 100), 0)
    }, percentToValue: function (e) {
        return this.property.minValue + e / 100 * (this.property.maxValue - this.property.minValue)
    }, onMouseDown: function (e) {
        e.preventDefault(), $(document).on("vmousemove", this.onMouseMove), $(document).on("vmouseup", this.onMouseUp), this.onMouseMove(e), this.rangeElement.addClass("is-scrubbing")
    }, onMouseMove: function (e) {
        var t = e.clientX - this.rangeElement.offset().left;
        this.setValue(this.percentToValue(t / this.rangeElement.width() * 100), true), this.writeToBlock(), this.changed.dispatch(this.getValue())
    }, onMouseUp: function () {
        $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp), this.rangeElement.removeClass("is-scrubbing")
    }
});
