SL("editor.components.toolbars").Edit = SL.editor.components.toolbars.Base.extend({
    init: function (e) {
        this.block = e, this.options = [], this._super()
    }, render: function () {
        this._super(), this.domElement.attr("data-type", "edit"), this.block.getToolbarOptions().forEach(this.renderOption.bind(this)), SL.util.user.canUseCustomCSS() && SL.view.isDeveloperMode() && this.renderOption(SL.editor.components.toolbars.options.ClassName)
    }, renderOption: function (e) {
        var t = new e(this.block);
        t.appendTo(this.listElement), t.changed && t.changed.add(this.sync.bind(this)), this.options.push(t)
    }, appendTo: function () {
        this._super.apply(this, arguments), this.sync()
    }, destroy: function () {
        for (; this.options.length;)this.options.pop().destroy();
        this._super()
    }
});