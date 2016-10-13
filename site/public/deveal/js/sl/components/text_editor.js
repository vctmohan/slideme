SL("components").TextEditor = Class.extend({
    init: function (t) {
        this.options = $.extend({
            type: "",
            value: ""
        }, t), this.saved = new signals.Signal, this.canceled = new signals.Signal, this.render(), this.bind(), this.originalValue = this.options.value || "", "string" == typeof this.options.value && this.setValue(this.options.value), SL.editor.controllers.Capabilities.isTouchEditor() || this.focusInput()
    }, render: function () {
        this.domElement = $('<div class="sl-text-editor">').appendTo(document.body), this.innerElement = $('<div class="sl-text-editor-inner">').appendTo(this.domElement), this.domElement.attr("data-type", this.options.type), "html" === this.options.type ? this.renderHTMLInput() : this.renderTextInput(), this.footerElement = $(['<div class="sl-text-editor-footer">', '<button class="button l outline white cancel-button">Cancel</button>', '<button class="button l positive save-button">Save</button>', "</div>"].join("")).appendTo(this.innerElement), setTimeout(function () {
            this.domElement.addClass("visible")
        }.bind(this), 1)
    }, renderTextInput: function () {
        this.inputElement = $('<textarea class="sl-text-editor-input">').appendTo(this.innerElement), "code" === this.options.type && this.inputElement.tabby({tabString: "    "})
    }, renderHTMLInput: function () {
        this.inputElement = $('<div class="editor sl-text-editor-input">').appendTo(this.innerElement), this.codeEditor && "function" == typeof this.codeEditor.destroy && (this.codeEditor.destroy(), this.codeEditor = null);
        try {
            this.codeEditor = ace.edit(this.inputElement.get(0)), this.codeEditor.setTheme("ace/theme/monokai"), this.codeEditor.setDisplayIndentGuides(true), this.codeEditor.setShowPrintMargin(false), this.codeEditor.getSession().setMode("ace/mode/html")
        } catch (t) {
            console.log("An error occurred while initializing the Ace editor.")
        }
    }, bind: function () {
        this.footerElement.find(".save-button").on("click", this.save.bind(this)), this.footerElement.find(".cancel-button").on("click", this.cancel.bind(this)), this.onKeyDown = this.onKeyDown.bind(this), SL.keyboard.keydown(this.onKeyDown), this.onBackgroundClicked = this.onBackgroundClicked.bind(this), this.domElement.on("vclick", this.onBackgroundClicked)
    }, save: function () {
        this.saved.dispatch(this.getValue()), this.destroy()
    }, cancel: function () {
        var t = this.originalValue || "", e = this.getValue() || "";
        e !== t ? this.cancelPrompt || (this.cancelPrompt = SL.prompt({
            title: "Discard unsaved changes?",
            type: "select",
            data: [{html: "<h3>Cancel</h3>"}, {
                html: "<h3>Discard</h3>",
                selected: true,
                className: "negative",
                callback: function () {
                    this.canceled.dispatch(), this.destroy()
                }.bind(this)
            }]
        }), this.cancelPrompt.destroyed.add(function () {
            this.cancelPrompt = null
        }.bind(this))) : (this.canceled.dispatch(), this.destroy())
    }, focusInput: function () {
        this.codeEditor ? this.codeEditor.focus() : this.inputElement.focus()
    }, setValue: function (t) {
        this.originalValue = t || "", this.codeEditor ? this.codeEditor.env.document.setValue(t) : this.inputElement.val(t)
    }, getValue: function () {
        return this.codeEditor ? this.codeEditor.env.document.getValue() : this.inputElement.val()
    }, onBackgroundClicked: function (t) {
        $(t.target).is(this.domElement) && (this.cancel(), t.preventDefault())
    }, onKeyDown: function (t) {
        return 27 === t.keyCode ? (this.cancel(), false) : (t.metaKey || t.ctrlKey) && 83 === t.keyCode ? (this.save(), false) : true
    }, destroy: function () {
        this.saved.dispose(), this.canceled.dispose(), SL.keyboard.release(this.onKeyDown), this.domElement.remove()
    }
});