SL("editor.components.toolbars.groups").BorderSVG = SL.editor.components.toolbars.groups.Base.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "border-svg",
            label: "Border",
            items: [SL.editor.components.toolbars.options.ShapeStrokeWidth, SL.editor.components.toolbars.options.ShapeStrokeColor]
        }, t))
    }, sync: function () {
        this.block.supportsStroke() ? (this.domElement.show(), this.block.hasStroke() ? (this.expand(), this.options.forEach(function (e) {
            e.readFromBlock()
        })) : this.collapse()) : this.domElement.hide()
    }, trigger: function () {
        this.block.toggleStroke(), this.sync()
    }
});