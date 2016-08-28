SL("editor.components.toolbars").EditMultiple = SL.editor.components.toolbars.Base.extend({
    init: function () {
        this.options = [], this._super()
    }, render: function () {
        this._super(), this.domElement.attr("data-type", "edit-multiple"), [SL.editor.components.toolbars.options.BlockAlignHorizontal, SL.editor.components.toolbars.options.BlockAlignVertical, SL.editor.components.toolbars.options.BlockDepth, SL.editor.components.toolbars.options.BlockActions].forEach(this.renderOption.bind(this))
    }, renderOption: function (e) {
        var t = new e(SL.editor.controllers.Blocks.getFocusedBlocks()[0]);
        t.appendTo(this.listElement), this.options.push(t)
    }, destroy: function () {
        for (; this.options.length;)this.options.pop().destroy();
        this._super()
    }
});