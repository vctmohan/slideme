SL("editor.components.toolbars.groups").LineType = SL.editor.components.toolbars.groups.Base.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "line-type",
            expandable: false,
            items: [SL.editor.components.toolbars.options.LineStartType, SL.editor.components.toolbars.options.LineEndType]
        }, t))
    }
});