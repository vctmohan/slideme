SL.util.device = {
    HAS_TOUCH: !!("ontouchstart" in window),
    IS_PHONE: /iphone|ipod|android|windows\sphone/gi.test(navigator.userAgent),
    IS_TABLET: /ipad/gi.test(navigator.userAgent),
    isMac: function () {
        return /Mac/.test(navigator.platform)
    },
    isWindows: function () {
        return /Win/g.test(navigator.platform)
    },
    isLinux: function () {
        return /Linux/g.test(navigator.platform)
    },
    isIE: function () {
        return /MSIE\s[0-9]/gi.test(navigator.userAgent) || /Trident\/7.0;(.*)rv:\d\d/.test(navigator.userAgent)
    },
    isChrome: function () {
        return /chrome/gi.test(navigator.userAgent)
    },
    isSafari: function () {
        return /safari/gi.test(navigator.userAgent) && !SL.util.device.isChrome()
    },
    isSafariDesktop: function () {
        return SL.util.device.isSafari() && !SL.util.device.isChrome() && !SL.util.device.IS_PHONE && !SL.util.device.IS_TABLET
    },
    isOpera: function () {
        return !!window.opera
    },
    isFirefox: function () {
        return /firefox\/\d+\.?\d+/gi.test(navigator.userAgent)
    },
    isPhantomJS: function () {
        return /PhantomJS/gi.test(navigator.userAgent)
    },
    supportedByEditor: function () {
        return Modernizr.history && Modernizr.csstransforms && !SL.util.device.isOpera()
    },
    getScrollBarWidth: function () {
        var t = $("<div>").css({
            width: "100px",
            height: "100px",
            overflow: "scroll",
            position: "absolute",
            top: "-9999px"
        });
        t.appendTo(document.body);
        var e = t.prop("offsetWidth") - t.prop("clientWidth");
        return t.remove(), e
    }
}