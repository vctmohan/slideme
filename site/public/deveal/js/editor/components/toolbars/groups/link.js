SL("editor.components.toolbars.groups").Link = SL.editor.components.toolbars.groups.Base.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "link",
            label: "link",
            items: [SL.editor.components.toolbars.options.LinkURL]
        }, t))
    }, sync: function () {
        this.block.isLinked() ? this.expand() : this.collapse()
    }, trigger: function () {
        this.block.setLinkURL(this.block.isLinked() ? null : ""), this.sync(), this.isExpanded() && !SL.editor.controllers.Capabilities.isTouchEditor() && this.options && this.options[0] && "function" == typeof this.options[0].focus && setTimeout(function () {
            this.options[0].focus()
        }.bind(this), 200)
    }
});