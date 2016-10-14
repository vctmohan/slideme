!function (t, e) {
    "object" == typeof exports ? module.exports = e(require("spin.js")) : "function" == typeof define && define.amd ? define(["spin"], e) : t.Ladda = e(t.Spinner)
}(this, function (t) {
    "use strict";
    function e(t) {
        if ("undefined" == typeof t)return void console.warn("Ladda button target must be defined.");
        t.querySelector(".ladda-label") || (t.innerHTML = '<span class="ladda-label">' + t.innerHTML + "</span>");
        var e, i = t.querySelector(".ladda-spinner");
        i || (i = document.createElement("span"), i.className = "ladda-spinner"), t.appendChild(i);
        var n, s = {
            start: function () {
                return e || (e = a(t)), t.setAttribute("disabled", ""), t.setAttribute("data-loading", ""), clearTimeout(n), e.spin(i), this.setProgress(0), this
            }, startAfter: function (t) {
                return clearTimeout(n), n = setTimeout(function () {
                    s.start()
                }, t), this
            }, stop: function () {
                return t.removeAttribute("disabled"), t.removeAttribute("data-loading"), clearTimeout(n), e && (n = setTimeout(function () {
                    e.stop()
                }, 1e3)), this
            }, toggle: function () {
                return this.isLoading() ? this.stop() : this.start(), this
            }, setProgress: function (e) {
                e = Math.max(Math.min(e, 1), 0);
                var i = t.querySelector(".ladda-progress");
                0 === e && i && i.parentNode ? i.parentNode.removeChild(i) : (i || (i = document.createElement("div"), i.className = "ladda-progress", t.appendChild(i)), i.style.width = (e || 0) * t.offsetWidth + "px")
            }, enable: function () {
                return this.stop(), this
            }, disable: function () {
                return this.stop(), t.setAttribute("disabled", ""), this
            }, isLoading: function () {
                return t.hasAttribute("data-loading")
            }, remove: function () {
                clearTimeout(n), t.removeAttribute("disabled", ""), t.removeAttribute("data-loading", ""), e && (e.stop(), e = null);
                for (var i = 0, o = l.length; o > i; i++)if (s === l[i]) {
                    l.splice(i, 1);
                    break
                }
            }
        };
        return l.push(s), s
    }

    function i(t, e) {
        for (; t.parentNode && t.tagName !== e;)t = t.parentNode;
        return e === t.tagName ? t : void 0
    }

    function n(t) {
        for (var e = ["input", "textarea", "select"], i = [], n = 0; n < e.length; n++)for (var s = t.getElementsByTagName(e[n]), o = 0; o < s.length; o++)s[o].hasAttribute("required") && i.push(s[o]);
        return i
    }

    function s(t, s) {
        s = s || {};
        var o = [];
        "string" == typeof t ? o = r(document.querySelectorAll(t)) : "object" == typeof t && "string" == typeof t.nodeName && (o = [t]);
        for (var a = 0, l = o.length; l > a; a++)!function () {
            var t = o[a];
            if ("function" == typeof t.addEventListener) {
                var r = e(t), l = -1;
                t.addEventListener("click", function () {
                    var e = !0, o = i(t, "FORM");
                    if ("undefined" != typeof o)for (var a = n(o), c = 0; c < a.length; c++)"" === a[c].value.replace(/^\s+|\s+$/g, "") && (e = !1), "checkbox" !== a[c].type && "radio" !== a[c].type || a[c].checked || (e = !1);
                    e && (r.startAfter(1), "number" == typeof s.timeout && (clearTimeout(l), l = setTimeout(r.stop, s.timeout)), "function" == typeof s.callback && s.callback.apply(null, [r]))
                }, !1)
            }
        }()
    }

    function o() {
        for (var t = 0, e = l.length; e > t; t++)l[t].stop()
    }

    function a(e) {
        var i, n = e.offsetHeight;
        0 === n && (n = parseFloat(window.getComputedStyle(e).height)), n > 32 && (n *= .8), e.hasAttribute("data-spinner-size") && (n = parseInt(e.getAttribute("data-spinner-size"), 10)), e.hasAttribute("data-spinner-color") && (i = e.getAttribute("data-spinner-color"));
        var s = 12, o = .2 * n, a = .6 * o, r = 7 > o ? 2 : 3;
        return new t({
            color: i || "#fff",
            lines: s,
            radius: o,
            length: a,
            width: r,
            zIndex: "auto",
            top: "auto",
            left: "auto",
            className: ""
        })
    }

    function r(t) {
        for (var e = [], i = 0; i < t.length; i++)e.push(t[i]);
        return e
    }

    var l = [];
    return {bind: s, create: e, stopAll: o}
});