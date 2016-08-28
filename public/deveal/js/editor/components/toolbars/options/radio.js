SL("editor.components.toolbars.options").Radio = SL.editor.components.toolbars.options.Value.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "radio", items: []}, t))
    }, render: function () {
        this._super(), this.domElement.addClass("toolbar-radio"), this.domElement.attr("data-number-of-items", this.config.items.length), this.innerElement = $('<div class="toolbar-radio-inner">').appendTo(this.domElement), this.config.items.forEach(function (e) {
            this.innerElement.append(['<div class="toolbar-radio-item" data-value="' + e.value + '">', e.icon ? '<span class="icon i-' + e.icon + '"></span>' : e.title, "</div>"].join(""))
        }.bind(this))
    }, bind: function () {
        this._super(), this.domElement.find(".toolbar-radio-item").on("vclick", this.onListItemClicked.bind(this))
    }, setValue: function (e, t) {
        this.hasValue(e) && (this.domElement.find(".toolbar-radio-item").removeClass("selected"), this.domElement.find('.toolbar-radio-item[data-value="' + e + '"]').first().addClass("selected"), this._super(e, t))
    }, hasValue: function (e) {
        return this.config.items.some(function (t) {
            return t.value === e
        })
    }, onListItemClicked: function (e) {
        var t = $(e.currentTarget).attr("data-value");
        t && this.setValue(t, true)
    }
});