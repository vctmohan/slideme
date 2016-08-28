SL("editor.controllers").Grid = {
    init: function () {
        this.color = "rgba(150, 150, 150, 0.2)", this.paint = this.paint.bind(this), this.bind(), this.render(), setTimeout(function () {
            SL.editor.controllers.Grid.show()
        }, 1)
    }, render: function () {
        this.domElement = $('<div class="sl-block-grid">'), this.canvasElement = $('<canvas class="sl-block-grid-inner">').appendTo(this.domElement)
    }, bind: function () {
        SL.editor.controllers.Contrast.changed.add(this.onContrastChange.bind(this))
    }, show: function () {
        this.isEnabled() && (this.domElement.appendTo($(".projector .reveal")), this.setContrast(SL.editor.controllers.Contrast.get()), this.paint(), $(window).on("resize", this.paint))
    }, hide: function () {
        this.domElement.remove(), $(window).off("resize", this.paint)
    }, paint: function () {
        var e = SL.util.getRevealSlideBounds(SL.editor.controllers.Markup.getCurrentSlide(), true), t = Math.round(window.devicePixelRatio || 1), i = e.width * t, n = e.height * t, r = this.getRows(), o = this.getCols(), s = Math.round(i / o), a = Math.round(n / r), l = SL.view.getSlideSize({scaled: true}), c = (window.innerWidth - SL.view.getSidebarWidth() - l.width) / 2, d = (window.innerHeight - l.height) / 2;
        this.canvasElement.css({left: Math.max(c, 10), top: d}), this.canvasElement.attr({
            width: i,
            height: n
        }), this.canvasElement.css({width: i / t, height: n / t});
        var h = this.canvasElement.get(0).getContext("2d");
        h.clearRect(0, 0, i, n);
        for (var u = 1; o > u; u++)h.fillStyle = this.color, h.fillRect(Math.floor(u * s), 0, 1 * t, n);
        for (var p = 1; r > p; p++)h.fillStyle = this.color, h.fillRect(0, Math.floor(p * a), i, 1 * t)
    }, refresh: function () {
        this.isEnabled() ? this.show() : this.hide()
    }, getRows: function () {
        return 10
    }, getCols: function () {
        return 12
    }, setContrast: function (e) {
        this.color = .15 > e ? "rgba(255, 255, 255, 0.10)" : .45 > e ? "rgba(255, 255, 255, 0.15)" : .85 > e ? "rgba(255, 255, 255, 0.20)" : "rgba(150, 150, 150, 0.20)"
    }, 
    isEnabled: function () {
        result = true;
        if(SL.editor.controllers.Capabilities.isTouchEditor()) {
            result = false; 
        }else{
            result = SL.current_user.settings.get("editor_grid");
        }
        return result;
    }, 
    onContrastChange: function (e) {
        this.setContrast(e), this.isEnabled() && this.paint()
    }
};