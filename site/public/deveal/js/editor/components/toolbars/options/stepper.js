SL("editor.components.toolbars.options").Stepper = SL.editor.components.toolbars.options.Value.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "stepper",
            progressbar: true
        }, t)), this.valueRange = this.property.maxValue - this.property.minValue, this.stepSize = this.valueRange < 1 ? this.valueRange / 200 : 1, this.property.stepSize && (this.stepSize = this.property.stepSize), this.changing = false, this.mouseDownValue = 0, this.mouseDownX = 0
    }, render: function () {
        this._super(), this.domElement.addClass("toolbar-stepper"), this.stepperElement = $('<div class="stepper">'), this.stepperElement.appendTo(this.domElement), this.config.progressbar && (this.progressbar = $('<div class="stepper-progress">').appendTo(this.stepperElement)), this.numberInput = $('<input type="text" class="stepper-number">').appendTo(this.stepperElement)
    }, bind: function () {
        this._super(), this.changeStarted = new signals.Signal, this.changeEnded = new signals.Signal, this.onMouseDown = this.onMouseDown.bind(this), this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.stepperElement.on("vmousedown", this.onMouseDown), this.numberInput.on("input", this.onInput.bind(this)), this.numberInput.on("keydown", this.onInputKeyDown.bind(this)), this.numberInput.on("focus", this.onInputFocused.bind(this)), this.numberInput.on("blur", this.onInputBlurred.bind(this))
    }, setValue: function (e, t, i) {
        if (this.value = Math.max(Math.min(e, this.property.maxValue), this.property.minValue), this.value = this.roundValue(this.value), !i) {
            var n = this.value;
            this.property.decimals > 0 && (n = n.toFixed(this.property.decimals)), this.property.unit && !this.property.unitHidden && (n += this.property.unit), this.numberInput.val(n)
        }
        if (this.progressbar) {
            var r = this.valueToPercent(this.value) / 100;
            this.progressbar.css("transform", "scaleX(" + r + ")")
        }
        this._super(this.value, t)
    }, roundValue: function (e) {
        var t = Math.pow(10, this.property.decimals);
        return Math.round(e * t) / t
    }, valueToPercent: function (e) {
        var t = (e - this.property.minValue) / (this.property.maxValue - this.property.minValue) * 100;
        return Math.max(Math.min(t, 100), 0)
    }, isChanging: function () {
        return this.changing
    }, onChangeStart: function () {
        this.isChanging() || (this.stepperElement.addClass("is-changing"), this.changing = true, this.changeStarted.dispatch())
    }, onChangeEnd: function () {
        this.isChanging() && (this.stepperElement.removeClass("is-changing"), this.changing = false, this.changeEnded.dispatch())
    }, onMouseDown: function (e) {
        this.numberInput.is(":focus") || e.preventDefault(), $(document).on("vmousemove", this.onMouseMove), $(document).on("vmouseup", this.onMouseUp), this.mouseDownX = e.clientX, this.mouseDownValue = this.getValue(), this.onChangeStart()
    }, onMouseMove: function (e) {
        this.stepperElement.addClass("is-scrubbing");
        var t = e.clientX - this.mouseDownX;
        1 === this.stepSize && this.valueRange < 15 ? t *= .25 : 1 === this.stepSize && this.valueRange < 30 && (t *= .5), this.setValue(this.mouseDownValue + t * this.stepSize, true), this.writeToBlock(), this.changed.dispatch(this.getValue())
    }, onMouseUp: function (e) {
        $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp), this.stepperElement.hasClass("is-scrubbing") === false ? this.onClick(e) : this.onChangeEnd(), this.stepperElement.removeClass("is-scrubbing")
    }, onClick: function () {
        this.numberInput.focus()
    }, onInput: function () {
        this.setValue(parseFloat(this.numberInput.val()), true, true), this.writeToBlock()
    }, onInputKeyDown: function (e) {
        var t = 0;
        38 === e.keyCode ? t = this.stepSize : 40 === e.keyCode && (t = -this.stepSize), t && (e.shiftKey && (t *= 10), this.setValue(this.getValue() + t, true), this.writeToBlock(), e.preventDefault())
    }, onInputFocused: function () {
        this.onChangeStart()
    }, onInputBlurred: function () {
        this.onChangeEnd(), this.setValue(this.getValue(), true)
    }, destroy: function () {
        this.changeStarted.dispose(), this.changeEnded.dispose(), this._super()
    }
});