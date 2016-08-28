SL("collections").Loadable = SL.collections.Collection.extend({
    init: function () {
        this._super.apply(this, arguments), this.loadStatus = "", this.loadStarted = new signals.Signal, this.loadCompleted = new signals.Signal, this.loadFailed = new signals.Signal
    }, load: function () {
    }, unload: function () {
        this.loadXHR && (this.loadXHR.abort(), this.loadXHR = null), this.loadStatus = "", this.clear()
    }, onLoadStarted: function () {
        this.loadStatus = "loading", this.loadStarted.dispatch()
    }, onLoadCompleted: function () {
        this.loadStatus = "loaded", this.loadCompleted.dispatch()
    }, onLoadFailed: function () {
        this.loadStatus = "failed", this.loadFailed.dispatch()
    }, isLoading: function () {
        return "loading" === this.loadStatus
    }, isLoaded: function () {
        return "loaded" === this.loadStatus
    }, destroy: function () {
        this.loadStarted.dispose(), this.loadCompleted.dispose(), this.loadFailed.dispose(), this._super()
    }
});