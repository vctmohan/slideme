SL("editor.components.toolbars.groups").BorderCSS = SL.editor.components.toolbars.groups.Base.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "border-css",
            label: "Border",
            items: [SL.editor.components.toolbars.options.BorderStyle, SL.editor.components.toolbars.options.BorderWidth, SL.editor.components.toolbars.options.BorderRadius, SL.editor.components.toolbars.options.BorderColor]
        }, t))
    }, sync: function () {
        var e = this.block.get("style.border-style");
        e && "none" !== e ? this.expand() : this.collapse()
    }, trigger: function () {
        this.block.isset("style.border-style") ? (this.block.unset("style.border-style"), this.block.unset("style.border-radius")) : (this.block.set("style.border-style", "solid"), this.block.isset("style.border-width") || this.block.set("style.border-width", 1), this.block.isset("style.border-color") || this.block.set("style.border-color", "#000000")), this.sync()
    }
});