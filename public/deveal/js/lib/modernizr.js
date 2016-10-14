!function (t, e, i) {
    function n(t, e) {
        return typeof t === e
    }

    function s() {
        var t, e, i, s, o, a, r;
        for (var l in b) {
            if (t = [], e = b[l], e.name && (t.push(e.name.toLowerCase()), e.options && e.options.aliases && e.options.aliases.length))for (i = 0; i < e.options.aliases.length; i++)t.push(e.options.aliases[i].toLowerCase());
            for (s = n(e.fn, "function") ? e.fn() : e.fn, o = 0; o < t.length; o++)a = t[o], r = a.split("."), 1 === r.length ? E[r[0]] = s : 2 === r.length && (!E[r[0]] || E[r[0]] instanceof Boolean || (E[r[0]] = new Boolean(E[r[0]])), E[r[0]][r[1]] = s), v.push((s ? "" : "no-") + r.join("-"))
        }
    }

    function o(t) {
        var e = T.className, i = E._config.classPrefix || "", n = new RegExp("(^|\\s)" + i + "no-js(\\s|$)");
        e = e.replace(n, "$1" + i + "js$2"), E._config.enableClasses && (e += " " + i + t.join(" " + i), T.className = e)
    }

    function a() {
        var t = e.body;
        return t || (t = w("body"), t.fake = !0), t
    }

    function r(t, e, i, n) {
        var s, o, r, l, c = "modernizr", d = w("div"), h = a();
        if (parseInt(i, 10))for (; i--;)r = w("div"), r.id = n ? n[i] : c + (i + 1), d.appendChild(r);
        return s = ["\xad", '<style id="s', c, '">', t, "</style>"].join(""), d.id = c, (h.fake ? h : d).innerHTML += s, h.appendChild(d), h.fake && (h.style.background = "", h.style.overflow = "hidden", l = T.style.overflow, T.style.overflow = "hidden", T.appendChild(h)), o = e(d, t), h.fake ? (h.parentNode.removeChild(h), T.style.overflow = l, T.offsetHeight) : d.parentNode.removeChild(d), !!o
    }

    function l(t, e) {
        return !!~("" + t).indexOf(e)
    }

    function c(t) {
        return t.replace(/([a-z])-([a-z])/g, function (t, e, i) {
            return e + i.toUpperCase()
        }).replace(/^-/, "")
    }

    function d(t) {
        return t.replace(/([A-Z])/g, function (t, e) {
            return "-" + e.toLowerCase()
        }).replace(/^ms-/, "-ms-")
    }

    function h(e, n) {
        var s = e.length;
        if ("CSS" in t && "supports" in t.CSS) {
            for (; s--;)if (t.CSS.supports(d(e[s]), n))return !0;
            return !1
        }
        if ("CSSSupportsRule" in t) {
            for (var o = []; s--;)o.push("(" + d(e[s]) + ":" + n + ")");
            return o = o.join(" or "), r("@supports (" + o + ") { #modernizr { position: absolute; } }", function (e) {
                return "absolute" == (t.getComputedStyle ? getComputedStyle(e, null) : e.currentStyle).position
            })
        }
        return i
    }

    function u(t, e, s, o) {
        function a() {
            c && (delete x.style, delete x.modElem)
        }

        if (o = n(o, "undefined") ? !1 : o, !n(s, "undefined")) {
            var r = h(t, s);
            if (!n(r, "undefined"))return r
        }
        var c, d, u, p;
        x.style || (c = !0, x.modElem = w("modernizr"), x.style = x.modElem.style);
        for (d in t)if (u = t[d], p = x.style[u], !l(u, "-") && x.style[u] !== i) {
            if (o || n(s, "undefined"))return a(), "pfx" == e ? u : !0;
            try {
                x.style[u] = s
            } catch (f) {
            }
            if (x.style[u] != p)return a(), "pfx" == e ? u : !0
        }
        return a(), !1
    }

    function p(t, e) {
        return function () {
            return t.apply(e, arguments)
        }
    }

    function f(t, e, i) {
        var s;
        for (var o in t)if (t[o] in e)return i === !1 ? t[o] : (s = e[t[o]], n(s, "function") ? p(s, i || e) : s);
        return !1
    }

    function m(t, e, i, s, o) {
        var a = t.charAt(0).toUpperCase() + t.slice(1), r = (t + " " + k.join(a + " ") + a).split(" ");
        return n(e, "string") || n(e, "undefined") ? u(r, e, s, o) : (r = (t + " " + _.join(a + " ") + a).split(" "), f(r, e, i))
    }

    function g(t, e, n) {
        return m(t, i, i, e, n)
    }

    var v = [], b = [], S = {
        _version: "v3.0.0pre",
        _config: {classPrefix: "mz-", enableClasses: !0, usePrefixes: !0},
        _q: [],
        on: function (t, e) {
            setTimeout(function () {
                e(this[t])
            }, 0)
        },
        addTest: function (t, e, i) {
            b.push({name: t, fn: e, options: i})
        },
        addAsyncTest: function (t) {
            b.push({name: null, fn: t})
        }
    }, E = function () {
    };
    E.prototype = S, E = new E, E.addTest("applicationcache", "applicationCache" in t), E.addTest("history", function () {
        var e = navigator.userAgent;
        return -1 === e.indexOf("Android 2.") && -1 === e.indexOf("Android 4.0") || -1 === e.indexOf("Mobile Safari") || -1 !== e.indexOf("Chrome") ? t.history && "pushState" in t.history : !1
    }), E.addTest("localstorage", function () {
        var t = "modernizr";
        try {
            return localStorage.setItem(t, t), localStorage.removeItem(t), !0
        } catch (e) {
            return !1
        }
    }), E.addTest("svg", !!e.createElementNS && !!e.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect);
    var y = S._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];
    S._prefixes = y;
    var T = e.documentElement, L = "Webkit Moz O ms", _ = S._config.usePrefixes ? L.toLowerCase().split(" ") : [];
    S._domPrefixes = _;
    var w = function () {
        return e.createElement.apply(e, arguments)
    };
    E.addTest("opacity", function () {
        var t = w("div"), e = t.style;
        return e.cssText = y.join("opacity:.55;"), /^0.55$/.test(e.opacity)
    }), E.addTest("rgba", function () {
        var t = w("div"), e = t.style;
        return e.cssText = "background-color:rgba(150,255,150,.5)", ("" + e.backgroundColor).indexOf("rgba") > -1
    });
    var C = S.testStyles = r, k = S._config.usePrefixes ? L.split(" ") : [];
    S._cssomPrefixes = k;
    var A = {elem: w("modernizr")};
    E._q.push(function () {
        delete A.elem
    });
    var x = {style: A.elem.style};
    E._q.unshift(function () {
        delete x.style
    });
    S.testProp = function (t, e, n) {
        return u([t], i, e, n)
    };
    S.testAllProps = m, S.testAllProps = g, E.addTest("backgroundsize", g("backgroundSize", "100%", !0)), E.addTest("cssanimations", g("animationName", "a", !0)), E.addTest("csstransforms", g("transform", "scale(1)", !0)), E.addTest("csstransforms3d", function () {
        var t = !!g("perspective", "1px", !0), e = E._config.usePrefixes;
        if (t && (!e || "webkitPerspective" in T.style)) {
            var i = "@media (transform-3d)";
            e && (i += ",(-webkit-transform-3d)"), i += "{#modernizr{left:9px;position:absolute;height:5px;margin:0;padding:0;border:0}}", C(i, function (e) {
                t = 9 === e.offsetLeft && 5 === e.offsetHeight
            })
        }
        return t
    }), E.addTest("csstransitions", g("transition", "all", !0)), E.addTest("flexbox", g("flexBasis", "1px", !0)), E.addTest("flexboxlegacy", g("boxDirection", "reverse", !0));
    var D = S.prefixed = function (t, e, i) {
        return -1 != t.indexOf("-") && (t = c(t)), e ? m(t, e, i) : m(t, "pfx")
    };
    E.addTest("fullscreen", !(!D("exitFullscreen", e, !1) && !D("cancelFullScreen", e, !1))), s(), o(v), delete S.addTest, delete S.addAsyncTest;
    for (var I = 0; I < E._q.length; I++)E._q[I]();
    t.Modernizr = E
}(this, document);