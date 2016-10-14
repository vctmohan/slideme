SL("editor.components.toolbars").AddSnippet = SL.editor.components.toolbars.Base.extend({
    init: function () {
        this._super()
    }, render: function () {
        this._super(), this.domElement.attr("data-type", "add"), this.sync()
    }, sync: function () {
        this._super();
        var e = SL.view.getCurrentTheme();
        if (e) {
            var t = e.get("snippets");
            t && !t.isEmpty() && t.forEach(function (e) {
                var t = $('<div class="toolbar-add-snippet-option">');
                t.text(e.get("title")), t.appendTo(this.listElement), t.on("vclick", this.onSnippetClicked.bind(this, e))
            }.bind(this))
        }
    }, insert: function (e, t) {
        SL.editor.controllers.Blocks.add({
            type: "snippet", slide: e, afterInit: function (e) {
                e.setCustomHTML(t), e.resizeToFitContent()
            }
        })
    }, onSnippetClicked: function (e) {
        var t = $(Reveal.getCurrentSlide());
        if (e.templateHasVariables()) {
            var i = SL.popup.open(SL.components.popup.InsertSnippet, {snippet: e});
            i.snippetInserted.add(function (e) {
                this.insert(t, e)
            }.bind(this))
        } else {
            var n = e.get("template").replace(SL.models.ThemeSnippet.TEMPLATE_SELECTION_TAG, "");
            this.insert(t, n)
        }
    }
});