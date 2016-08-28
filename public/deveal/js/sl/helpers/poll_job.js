SL("helpers").PollJob = Class.extend({
    init: function (t) {
        this.options = $.extend({
            interval: 1e3,
            timeout: Number.MAX_VALUE,
            retries: Number.MAX_VALUE
        }, t), this.interval = -1, this.running = false, this.poll = this.poll.bind(this), this.ended = new signals.Signal, this.polled = new signals.Signal
    }, start: function () {
        this.running = true, this.pollStart = Date.now(), this.pollTimes = 0, clearInterval(this.interval), this.interval = setInterval(this.poll, this.options.interval)
    }, stop: function () {
        this.running = false, clearInterval(this.interval)
    }, poll: function () {
        this.pollTimes++, Date.now() - this.pollStart > this.options.timeout || this.pollTimes > this.options.retries ? (this.stop(), this.ended.dispatch()) : this.polled.dispatch()
    }
});