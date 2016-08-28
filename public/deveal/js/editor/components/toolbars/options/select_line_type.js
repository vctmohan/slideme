SL("editor.components.toolbars.options").SelectLineType = SL.editor.components.toolbars.options.Select.extend({
    init: function (e, t) {
        this._super(e, $.extend({panelWidth: 75, panelMaxHeight: 430, panelAlignment: "b"}, t))
    }, renderItem: function (e) {
        var t = $('<div class="toolbar-select-item" data-value="' + e.value + '">');
        t.appendTo(this.panel.contentElement), this.createPreviewSVG(t, e.value, 59, 40)
    }, displaySelectedValue: function () {
        this.triggerElement.find("svg").remove(), this.createPreviewSVG(this.triggerElement, this.value, 44, 40)
    }, createPreviewSVG: function (e, t, i, n) {
        var r = document.createElementNS(SL.util.svg.NAMESPACE, "svg");
        r.setAttribute("xmlns", SL.util.svg.NAMESPACE), r.setAttribute("version", "1.1"), r.setAttribute("width", i), r.setAttribute("height", n), r.setAttribute("viewBox", "0 0 " + i + " " + n), r.setAttribute("preserveAspectRatio", "xMidYMid"), SL.editor.blocks.Line.generate(r, {
            interactive: false,
            startType: "line-start-type" === this.config.type ? t : null,
            endType: "line-end-type" === this.config.type ? t : null,
            color: "#333333",
            width: 6,
            x1: 0,
            y1: n / 2,
            x2: i,
            y2: n / 2
        }), e.append(r)
    }
});