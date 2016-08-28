SL.components.RetryNotification = SL.components.Notification.extend({
    init: function (t, e) {
        e = $.extend({optional: false}, e), this._super(t, e), this.retryClicked = new signals.Signal
    }, render: function () {
        this._super(), this.retryOptions = $('<div class="retry-options"></div>'), this.retryOptions.appendTo(this.domElement), this.retryMessage = $('<div class="retry-countdown"></div>'), this.retryButton = $('<button class="button white retry-button">Retry</button>'), this.retryButton.on("vclick", this.onRetryClicked.bind(this)), this.retryButton.appendTo(this.retryOptions)
    }, bind: function () {
        this._super(), this.updateCountdown = this.updateCountdown.bind(this)
    }, startCountdown: function (t) {
        clearInterval(this.updateInterval), this.retryStart = Date.now(), this.retryDuration = t, this.updateInterval = setInterval(this.updateCountdown, 250), this.updateCountdown(), this.retryMessage.prependTo(this.retryOptions), this.layout()
    }, updateCountdown: function () {
        var t = this.retryDuration - (Date.now() - this.retryStart);
        t /= 1e3, this.retryMessage.text(this.retryDuration < 2e3 || 0 >= t ? "Retrying..." : "Retrying in " + Math.ceil(t) + "s")
    }, disableCountdown: function () {
        clearInterval(this.updateInterval), this.retryMessage.remove(), this.layout()
    }, onRetryClicked: function () {
        this.retryClicked.dispatch()
    }, destroy: function () {
        clearInterval(this.updateInterval), this.retryClicked && (this.retryClicked.dispose(), this.retryClicked = null), this._super()
    }
});