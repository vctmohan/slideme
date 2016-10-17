SL("editor.components.toolbars").Add = SL.editor.components.toolbars.Base.extend({
    init: function () {
        this._super()
    }, render: function () {
        this._super(), this.domElement.attr("data-type", "add"), SL.config.BLOCKS.forEach(function (e) {
            if (!e.hidden) {
                var t = $(['<div class="toolbar-add-block-option" data-block-type="' + e.type + '">', '<span class="toolbar-add-block-option-icon icon i-' + e.icon + '"></span>', '<span class="toolbar-add-block-option-label">' + e.label + "</span>", "</div>"].join(""));
                this.bindOption(t, e), t.appendTo(this.listElement)
            }
        }.bind(this)), this.renderSnippets()
    }, renderSnippets: function () {
        this.snippetsOptions = $(['<div class="toolbar-add-block-option">', '<span class="toolbar-add-block-option-icon icon i-document-alt-stroke"></span>', '<span class="toolbar-add-block-option-label">Snippet</span>', "</div>"].join("")), this.snippetsOptions.on("vclick", function () {
            SL.view.toolbars.push(new SL.editor.components.toolbars.AddSnippet)
        }.bind(this))
    }, sync: function () {
        this._super();
        var e = SL.view.getCurrentTheme();
        e && e.get("snippets") && !e.get("snippets").isEmpty() ? this.snippetsOptions.appendTo(this.listElement) : this.snippetsOptions.detach()
    }, bindOption: function (e, t) {
        function i() {
            l || (SL.editor.controllers.Blocks.add({
                type: t.type,
                blockOptions: {insertedFromToolbar: true}
            }))
        }

        function n(e) {
            a = true, l = false, s = e.clientX, $(document).on("mousemove", r), $(document).on("mouseup", o), e.preventDefault()
        }

        function r(e) {
            if (a && !l && e.clientX - s > 10) {
                l = true;
                var i = SL.editor.controllers.Blocks.add({
                    type: t.type,
                    silent: true,
                    center: false
                }), n = $(".reveal .slides").offset(), r = i.measure();
                i.move(e.clientX - n.left - r.width / 2, e.clientY - n.top - r.height / 2), i.onMouseDown(e)
            }
            e.preventDefault()
        }

        function o() {
            $(document).off("mousemove", r), $(document).off("mouseup", o), a = false, l = false
        }

        var s = 0, a = false, l = false;
        e.on("vclick", i), SL.editor.controllers.Capabilities.isTouchEditor() || e.on("mousedown", n)
    }
});