SL.activity = {
    init: function () {
        this.initialized || (this.initialized = true, this.history = [Date.now()], this.listeners = [], this.bind(), setInterval(this.checkListeners.bind(this), 500))
    }, bind: function () {
        this.onUserInput = $.throttle(this.onUserInput.bind(this), 100), document.addEventListener("mousedown", this.onUserInput), document.addEventListener("mousemove", this.onUserInput), document.addEventListener("touchstart", this.onUserInput), document.addEventListener("touchmove", this.onUserInput), document.addEventListener("keydown", this.onUserInput), window.addEventListener("scroll", this.onUserInput), window.addEventListener("mousewheel", this.onUserInput)
    }, checkListeners: function () {
        this.listeners.forEach(function (t) {
            this.hasBeenInactiveFor(t.duration) ? t.active === true && (t.active = false, "function" == typeof t.inactiveCallback && t.inactiveCallback()) : t.active === false && (t.active = true, "function" == typeof t.activeCallback && t.activeCallback())
        }, this)
    }, hasBeenInactiveFor: function (t) {
        return Date.now() - this.history[0] > t
    }, register: function (t, e, i) {
        this.initialized || this.init(), this.listeners.push({
            active: !this.hasBeenInactiveFor(t),
            duration: t,
            activeCallback: e,
            inactiveCallback: i
        })
    }, onUserInput: function () {
        this.history.unshift(Date.now()), this.history.splice(1e3)
    }
};