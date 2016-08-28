SL.helpers.ThemeController = {
    paint: function (t, e) {
        e = e || {};
        var i = $(".reveal-viewport");
        if (0 === i.length || "undefined" == typeof window.Reveal)return false;
        if (this.cleanup(), i.addClass("theme-font-" + t.get("font")), i.addClass("theme-color-" + t.get("color")), Reveal.configure($.extend({
                center: t.get("center"),
                rolling_links: t.get("rolling_links"),
                transition: t.get("transition"),
                backgroundTransition: t.get("background_transition")
            }, e)), t.get("html")) {
            var n = $("#theme-html-output");
            n.length ? n.html(t.get("html")) : $(".reveal").append('<div id="theme-html-output">' + t.get("html") + "</div>")
        } else $("#theme-html-output").remove();
        if ("string" == typeof e.globalCSS)if (e.globalCSS.length) {
            var s = $("#global-css-output");
            s.length ? s.html(e.globalCSS) : $("head").append('<style id="global-css-output">' + e.globalCSS + "</style>")
        } else $("#global-css-output").remove();
        if (t.get("css")) {
            var o = $("#theme-css-output");
            o.length ? o.html(t.get("css")) : $("head").append('<style id="theme-css-output">' + t.get("css") + "</style>")
        } else $("#theme-css-output").remove();
        if (e.js !== false)if (t.get("js")) {
            var a = $("#theme-js-output");
            a.text() !== t.get("js") && (a.remove(), $("body").append('<script id="theme-js-output">' + t.get("js") + "</script>"))
        } else $("#theme-js-output").remove();
        SL.util.deck.sortInjectedStyles(), SL.fonts.loadDeckFont(t.get("font"))
    }, cleanup: function () {
        var t = $(".reveal-viewport"), e = $(".reveal");
        t.attr("class", t.attr("class").replace(/theme\-(font|color)\-([a-z0-9-])*/gi, "")), SL.config.THEME_TRANSITIONS.forEach(function (t) {
            e.removeClass(t.id)
        })
    }
};