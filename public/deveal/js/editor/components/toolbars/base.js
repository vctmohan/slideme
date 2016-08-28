SL("editor.components.toolbars").Base = Class.extend({
    init: function () {
        this.render()
    }, render: function () {
        this.domElement = $('<div class="toolbar">'), this.listElement = $('<div class="toolbar-list">').appendTo(this.domElement), this.scrollShadow = new SL.components.ScrollShadow({
            parentElement: this.domElement,
            contentElement: this.listElement,
            resizeContent: false
        })
    }, appendTo: function (e) {
        this.domElement.appendTo(e), this.scrollShadow.sync()
    }, collapse: function () {
        this.getAllOptions().forEach(function (e) {
            "object" == typeof e.panel && e.panel.hide()
        })
    }, sync: function () {
        this.getAllOptions().forEach(function (e) {
            "function" == typeof e.sync && e.sync()
        })
    }, move: function (e, t) {
        this.domElement.css({left: e, top: t}), this.scrollShadow.sync()
    }, measure: function () {
        var e = this.domElement.position();
        return {x: e.left, y: e.top, width: this.domElement.outerWidth(), height: this.domElement.outerHeight()}
    }, hasOpenPanel: function () {
        return this.getAllOptions().some(function (e) {
            return !("object" != typeof e.panel || !e.panel.isVisible())
        })
    }, getAllOptions: function () {
        var e = [];
        return "object" == typeof this.options && this.options.length && (e = e.concat(this.options), this.options.forEach(function (t) {
            "object" == typeof t.options && t.options.length && (e = e.concat(t.options))
        })), e
    }, destroyAfter: function (e) {
        this.collapse(), clearTimeout(this.destroyTimeout), "number" == typeof e && (this.destroyTimeout = setTimeout(this.destroy.bind(this), e))
    }, destroy: function () {
        this.domElement.remove(), this.scrollShadow.destroy()
    }
});