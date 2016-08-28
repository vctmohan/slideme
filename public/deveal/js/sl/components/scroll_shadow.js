SL("components").ScrollShadow = Class.extend({
    init: function (t) {
        this.options = $.extend({
            threshold: 20,
            shadowSize: 10,
            resizeContent: true
        }, t), this.bind(), this.render(), this.layout()
    }, bind: function () {
        this.layout = this.layout.bind(this), this.sync = this.sync.bind(this), this.onScroll = $.throttle(this.onScroll.bind(this), 100), $(window).on("resize", this.layout), this.options.contentElement.on("scroll", this.onScroll)
    }, render: function () {
        this.shadowTop = $('<div class="sl-scroll-shadow-top">').appendTo(this.options.parentElement), this.shadowBottom = $('<div class="sl-scroll-shadow-bottom">').appendTo(this.options.parentElement), this.shadowTop.height(this.options.shadowSize), this.shadowBottom.height(this.options.shadowSize)
    }, layout: function () {
        var t = this.options.parentElement.height(), e = this.options.footerElement ? this.options.footerElement.outerHeight() : 0, i = this.options.headerElement ? this.options.headerElement.outerHeight() : 0;
        (this.options.resizeContent && this.options.footerElement || this.options.headerElement) && this.options.contentElement.css("height", t - e - i), this.sync()
    }, sync: function () {
        var t = this.options.footerElement ? this.options.footerElement.outerHeight() : 0, e = this.options.headerElement ? this.options.headerElement.outerHeight() : 0, i = this.options.contentElement.scrollTop(), n = this.options.contentElement.prop("scrollHeight"), s = this.options.contentElement.outerHeight(), o = n > s + this.options.threshold, a = i / (n - s);
        this.shadowTop.css({
            opacity: o ? a : 0,
            top: e
        }), this.shadowBottom.css({opacity: o ? 1 - a : 0, bottom: t})
    }, onScroll: function () {
        this.sync()
    }, destroy: function () {
        $(window).off("resize", this.layout), this.options.contentElement.off("scroll", this.onScroll), this.options = null
    }
});