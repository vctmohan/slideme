SL("editor.controllers").Selection = {
    init: function () {
        this.domElement = $('<div class="sl-block-selection editing-ui">')
    }, start: function (e, t) {
        var i = $(".projector");
        this.domElement.appendTo(i);
        var n = i.offset();
        this.offsetX = -n.left, this.offsetY = -n.top, this.startX = e + this.offsetX, this.startY = t + this.offsetY;
        var r = SL.editor.controllers.Markup.getCurrentSlide();
        this.slideBounds = SL.util.getRevealSlideBounds(r, true), this.sync(e, t)
    }, sync: function (e, t) {
        var i = {width: e + this.offsetX - this.startX, height: t + this.offsetY - this.startY};
        i.x = this.startX + Math.min(i.width, 0), i.y = this.startY + Math.min(i.height, 0), i.width = Math.abs(i.width), i.height = Math.abs(i.height), this.domElement.css({
            left: i.x,
            top: i.y,
            width: i.width,
            height: i.height
        }), i.x -= this.slideBounds.x, i.y -= this.slideBounds.y;
        var n = SL.util.getRevealCounterScale();
        i.x *= n, i.y *= n, i.width *= n, i.height *= n, SL.editor.controllers.Blocks.getCurrentBlocks().forEach(function (e) {
            e.hitTest(i) ? SL.editor.controllers.Blocks.focus(e, true, false) : SL.editor.controllers.Blocks.blur([e])
        }.bind(this))
    }, stop: function () {
        this.domElement.remove()
    }
};