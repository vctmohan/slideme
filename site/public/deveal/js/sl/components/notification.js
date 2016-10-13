SL("components").Notification = Class.extend({
    init: function (t, e) {
        this.html = t, this.options = $.extend({
            type: "",
            duration: 2500 + 15 * this.html.length,
            optional: true
        }, e), "negative" === this.options.type && (this.options.duration = 1.5 * this.options.duration), this.destroyed = new signals.Signal, this.hideTimeout = -1, this.render(), this.bind(), this.show(), this.layout()
    }, render: function () {
        0 === $(".sl-notifications").length && $(document.body).append('<div class="sl-notifications"></div>'), this.domElement = $('<p class="sl-notification">').html(this.html).addClass(this.options.type).appendTo($(".sl-notifications"))
    }, bind: function () {
        this.hide = this.hide.bind(this), this.destroy = this.destroy.bind(this), this.options.optional && (this.domElement.on("mouseenter", this.stopTimeout.bind(this)), this.domElement.on("mouseleave", this.startTimeout.bind(this)), this.domElement.on("click", this.destroy.bind(this)))
    }, startTimeout: function () {
        this.stopTimeout(), this.hideTimeout = setTimeout(this.hide, this.options.duration)
    }, stopTimeout: function () {
        clearTimeout(this.hideTimeout)
    }, show: function () {
        this.isDestroyed !== true && setTimeout(function () {
            this.domElement.addClass("show"), this.options.optional && this.startTimeout()
        }.bind(this), 1)
    }, hide: function () {
        this.domElement.addClass("hide"), this.hideTimeout = setTimeout(this.destroy.bind(this), 400), this.layout()
    }, layout: function () {
        var t = 0;
        $(".sl-notification:not(.hide)").get().reverse().forEach(function (e) {
            t -= $(e).outerHeight() + 10, e.style.top = t + "px"
        })
    }, destroy: function () {
        clearTimeout(this.hideTimeout), this.isDestroyed = true, this.options = null, this.domElement.remove(), this.layout(), this.destroyed.dispatch(), this.destroyed.dispose(), this.destroy = function () {
        }
    }
});