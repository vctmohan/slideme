SL("editor.components.toolbars.groups").Base = Class.extend({
    init: function (e, t) {
        this.block = e, this.config = $.extend({
            label: "Group",
            items: [],
            expandable: true
        }, t), this.options = [], this.render(), this.bind()
    }, render: function () {
        this.domElement = $('<div class="toolbar-option toolbar-group">'), this.config.type && this.domElement.attr("data-group-type", this.config.type), this.config.expandable ? (this.triggerElement = $('<div class="toolbar-group-trigger">').appendTo(this.domElement), this.triggerElement.append('<span class="label">' + this.config.label + "</span>"), this.triggerElement.append('<span class="checkbox icon i-checkmark"></span>'), this.optionsElement = $('<div class="toolbar-group-options">').appendTo(this.domElement), this.optionsInnerElement = $('<div class="toolbar-group-options-inner">').appendTo(this.optionsElement)) : this.optionsInnerElement = $('<div class="toolbar-group-inner">').appendTo(this.domElement), this.config.items.forEach(this.renderOption.bind(this))
    }, renderOption: function (e) {
        var t = new e(this.block);
        t.appendTo(this.optionsInnerElement), this.options.push(t)
    }, bind: function () {
        this.domElement.find(".toolbar-group-trigger").on("vclick", this.onClicked.bind(this))
    }, appendTo: function (e) {
        this.domElement.appendTo(e)
    }, sync: function () {
        this.expand()
    }, trigger: function () {
    }, expand: function () {
        this.config.expandable && (this.domElement.addClass("expanded"), this.optionsElement.height(this.optionsInnerElement.prop("scrollHeight") + 2)), this.options.forEach(function (e) {
            "function" == typeof e.readFromBlock && e.readFromBlock()
        })
    }, collapse: function () {
        this.domElement.removeClass("expanded"), this.optionsElement.height(0)
    }, isExpanded: function () {
        return this.domElement.hasClass("expanded")
    }, onClicked: function (e) {
        e.preventDefault(), this.trigger()
    }, destroy: function () {
        for (; this.options.length;)this.options.pop().destroy();
        this.domElement.remove()
    }
});