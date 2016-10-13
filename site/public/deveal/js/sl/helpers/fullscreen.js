SL.helpers.Fullscreen = {
    enter: function (t) {
        t = t || document.body;
        var e = t.requestFullScreen || t.webkitRequestFullscreen || t.webkitRequestFullScreen || t.mozRequestFullScreen || t.msRequestFullscreen;
        e && e.apply(t)
    }, exit: function () {
        var t = document.exitFullscreen || document.msExitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen;
        t && t.apply(document)
    }, toggle: function () {
        SL.helpers.Fullscreen.isActive() ? SL.helpers.Fullscreen.exit() : SL.helpers.Fullscreen.enter()
    }, isEnabled: function () {
        return !!(document.fullscreenEnabled || document.mozFullscreenEnabled || document.msFullscreenEnabled || document.webkitFullscreenEnabled)
    }, isActive: function () {
        return !!(document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement)
    }
};