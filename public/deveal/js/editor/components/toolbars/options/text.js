SL("editor.components.toolbars.options").Text = SL.editor.components.toolbars.options.Value.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "text", multiline: false, expandable: false, maxlength: 255, placeholder: ""}, t))
    }, render: function () {
        this._super(), this.domElement.addClass("toolbar-text"), this.config.multiline ? (this.inputElement = $("<textarea></textarea>"), this.config.expandable && (this.expandElement = $('<div class="expand-button icon i-fullscreen"></div>'), this.expandElement.appendTo(this.domElement))) : this.inputElement = $("<input />"), this.inputElement.attr({
            "class": "toolbar-text-input",
            maxlength: this.config.maxlength,
            placeholder: this.config.placeholder
        }), this.inputElement.appendTo(this.domElement)
    }, bind: function () {
        this._super(), this.inputElement.on("input", this.onInputChange.bind(this)), this.expandElement && this.expandElement.on("vclick", this.onExpandClicked.bind(this))
    }, focus: function () {
        this.inputElement.focus()
    }, expand: function () {
        this.editor || (this.editor = new SL.components.TextEditor({
            type: "code",
            value: this.getValue()
        }), this.editor.saved.add(function (e) {
            this.setValue(e), this.writeToBlock(), this.editor = null
        }.bind(this)), this.editor.canceled.add(function () {
            this.editor = null
        }.bind(this)))
    }, destroy: function () {
        this.editor && (this.editor.destroy(), this.editor = null), this._super()
    }, setValue: function (e) {
        this.inputElement.val(e), this._super(e)
    }, getValue: function () {
        return this.inputElement.val()
    }, onInputChange: function () {
        this.writeToBlock()
    }, onExpandClicked: function () {
        this.expand()
    }
});