SL("editor.controllers").Mode = {
    init: function (e, t) {
        this.editor = e, this.modes = t, this.modeActivated = new signals.Signal, this.modeDeactivated = new signals.Signal;
        for (var i in this.modes)this.modes[i].activated.add(this.onModeActivated.bind(this, i)), this.modes[i].deactivated.add(this.onModeDeactivated.bind(this, i))
    }, clear: function () {
        var e = this.get($("html").attr("data-mode"));
        e && e.isActive() && e.deactivate()
    }, change: function (e) {
        this.clear();
        var t = this.get(e);
        t && t.activate()
    }, toggle: function (e) {
        var t = this.get(e);
        if (t && t.isActive())t.deactivate(); else if (t) {
            var i = $("html").attr("data-mode");
            i && i !== e && (currentMode = this.get(i), currentMode && currentMode.isActive() && currentMode.deactivate()), t.activate()
        }
    }, get: function (e) {
        return e || (e = $("html").attr("data-mode")), this.modes[e] ? this.modes[e] : null
    }, onModeActivated: function (e) {
        this.modeActivated.dispatch(e)
    }, onModeDeactivated: function (e) {
        this.modeDeactivated.dispatch(e)
    }
};