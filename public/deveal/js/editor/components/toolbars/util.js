SL("editor.components.toolbars.util").Panel = Class.extend({
    init: function (e) {
        this.options = $.extend({
            width: "auto",
            height: "auto",
            maxHeight: "none",
            keydown: false,
            offsetX: 0,
            offsetY: 0,
            alignment: "r"
        }, e), this.render(), this.bind(), SL.editor.components.toolbars.util.Panel.INSTANCES.push(this)
    }, render: function () {
        this.domElement = $('<div class="toolbar-panel">'), this.contentElement = $('<div class="toolbar-panel-content">').appendTo(this.domElement), this.arrowElement = $('<div class="toolbar-panel-arrow">').appendTo(this.domElement), this.contentElement.css({
            width: this.options.width,
            height: this.options.height,
            maxHeight: this.options.maxHeight
        }), this.domElement.attr("data-alignment", this.options.alignment), "string" == typeof this.options.type && this.domElement.attr("data-panel-type", this.options.type), "number" == typeof this.options.height && this.domElement.css("overflow", "auto")
    }, bind: function () {
        this.shown = new signals.Signal, this.hidden = new signals.Signal, this.isVisible = this.isVisible.bind(this), this.onDocumentClick = this.onDocumentClick.bind(this)
    }, show: function () {
        SL.editor.components.toolbars.util.Panel.INSTANCES.forEach(function (e) {
            e !== this && e.isVisible() && e.hide()
        }), this.domElement.appendTo(SL.view.toolbars.domElement), this.layout(), this.shown.dispatch(), "function" == typeof this.options.keydown && SL.keyboard.keydown(this.options.keydown), $(document).on("click", this.onDocumentClick)
    }, hide: function () {
        this.domElement.detach(), this.hidden.dispatch(), SL.keyboard.release(this.options.keydown)
    }, toggle: function () {
        this.isVisible() ? this.hide() : this.show()
    }, isVisible: function () {
        return this.domElement.parent().length > 0
    }, layout: function () {
        if (this.options.anchor && "auto" === this.options.width && this.domElement.width(this.options.anchor.outerWidth()), this.options.anchor) {
            var e = this.options.anchor.offset(), t = this.options.anchor.outerWidth(), i = this.options.anchor.outerHeight(), n = 6, r = e.left + this.options.offsetX - this.domElement.parent().offset().left, o = e.top + this.options.offsetY;
            "b" === this.options.alignment ? (r += t / 2 - this.domElement.outerWidth() / 2, o += i) : r += t, o = Math.max(o, n), o = Math.min(o, window.innerHeight - this.domElement.outerHeight() - n), this.domElement.css({
                left: r,
                top: o
            }), this.arrowElement.css("b" === this.options.alignment ? {
                left: this.domElement.outerWidth() / 2,
                top: ""
            } : {left: "", top: e.top - o + i / 2})
        }
    }, getContentElement: function () {
        return this.contentElement
    }, onDocumentClick: function (e) {
        var t = $(e.target);
        0 === t.closest(this.options.anchor).length && 0 === t.closest(this.domElement).length && this.hide()
    }, destroy: function () {
        $(document).off("click", this.onDocumentClick);
        for (var e = 0; e < SL.editor.components.toolbars.util.Panel.INSTANCES.length; e++)SL.editor.components.toolbars.util.Panel.INSTANCES[e] === this && SL.editor.components.toolbars.util.Panel.INSTANCES.splice(e, 1);
        SL.keyboard.release(this.options.keydown), this.shown.dispose(), this.hidden.dispose(), this.domElement.remove()
    }
});
SL.editor.components.toolbars.util.Panel.INSTANCES = [];
