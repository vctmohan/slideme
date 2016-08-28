SL("editor.controllers").Contrast = {
    init: function () {
        this.contrast = -1, this.sync = this.sync.bind(this), this.bind(), this.sync()
    }, bind: function () {
        this.changed = new signals.Signal, Reveal.addEventListener("ready", this.sync), Reveal.addEventListener("slidechanged", function () {
            setTimeout(this.sync, 1)
        }.bind(this))
    }, sync: function () {
        var e = SL.util.deck.getBackgroundContrast();
        e !== this.contrast && (this.contrast = e, $("html").attr("data-deck-contrast", Math.round(10 * e)), this.changed.dispatch(this.contrast))
    }, get: function () {
        return -1 === this.contrast && this.sync(), this.contrast
    }
};