SL("editor.components.toolbars.options").Multi = SL.editor.components.toolbars.options.Base.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "multi", items: []}, t))
    }, render: function () {
        this._super(), this.domElement.addClass("toolbar-multi"), this.domElement.attr("data-number-of-items", this.config.items.length), this.innerElement = $('<div class="toolbar-multi-inner">').appendTo(this.domElement), this.config.items.forEach(function (e) {
            var t = $(['<div class="toolbar-multi-item" data-value="' + e.value + '">', e.icon ? '<span class="icon i-' + e.icon + '"></span>' : e.title, "</div>"].join(""));
            e.tooltip && t.attr("data-tooltip", e.tooltip), t.appendTo(this.innerElement)
        }.bind(this))
    }, bind: function () {
        this._super(), this.domElement.find(".toolbar-multi-item").on("vclick", this.onListItemClicked.bind(this))
    }, trigger: function () {
    }, onListItemClicked: function (e) {
        var t = $(e.currentTarget).attr("data-value");
        t && this.trigger(t)
    }
});