!function (t, e) {
    function i(t) {
        return t.call.apply(t.bind, arguments)
    }

    function n(t, e) {
        if (!t)throw Error();
        if (2 < arguments.length) {
            var i = Array.prototype.slice.call(arguments, 2);
            return function () {
                var n = Array.prototype.slice.call(arguments);
                return Array.prototype.unshift.apply(n, i), t.apply(e, n)
            }
        }
        return function () {
            return t.apply(e, arguments)
        }
    }

    function s() {
        return s = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? i : n, s.apply(null, arguments)
    }

    function o(t, e) {
        this.J = t, this.t = e || t, this.C = this.t.document
    }

    function a(t, i, n) {
        t = t.C.getElementsByTagName(i)[0], t || (t = e.documentElement), t && t.lastChild && t.insertBefore(n, t.lastChild)
    }

    function r(t, e) {
        function i() {
            t.C.body ? e() : setTimeout(i, 0)
        }

        i()
    }

    function l(t, e, i) {
        e = e || [], i = i || [];
        for (var n = t.className.split(/\s+/), s = 0; s < e.length; s += 1) {
            for (var o = !1, a = 0; a < n.length; a += 1)if (e[s] === n[a]) {
                o = !0;
                break
            }
            o || n.push(e[s])
        }
        for (e = [], s = 0; s < n.length; s += 1) {
            for (o = !1, a = 0; a < i.length; a += 1)if (n[s] === i[a]) {
                o = !0;
                break
            }
            o || e.push(n[s])
        }
        t.className = e.join(" ").replace(/\s+/g, " ").replace(/^\s+|\s+$/, "")
    }

    function c(t, e) {
        for (var i = t.className.split(/\s+/), n = 0, s = i.length; s > n; n++)if (i[n] == e)return !0;
        return !1
    }

    function d(t) {
        if ("string" == typeof t.ma)return t.ma;
        var e = t.t.location.protocol;
        return "about:" == e && (e = t.J.location.protocol), "https:" == e ? "https:" : "http:"
    }

    function h(t, e) {
        var i = t.createElement("link", {rel: "stylesheet", href: e}), n = !1;
        i.onload = function () {
            n || (n = !0)
        }, i.onerror = function () {
            n || (n = !0)
        }, a(t, "head", i)
    }

    function u(e, i, n, s) {
        var o = e.C.getElementsByTagName("head")[0];
        if (o) {
            var a = e.createElement("script", {src: i}), r = !1;
            return a.onload = a.onreadystatechange = function () {
                r || this.readyState && "loaded" != this.readyState && "complete" != this.readyState || (r = !0, n && n(null), a.onload = a.onreadystatechange = null, "HEAD" == a.parentNode.tagName && o.removeChild(a))
            }, o.appendChild(a), t.setTimeout(function () {
                r || (r = !0, n && n(Error("Script load timeout")))
            }, s || 5e3), a
        }
        return null
    }

    function p(t, e) {
        this.X = t, this.fa = e
    }

    function f(t, e, i, n) {
        this.c = null != t ? t : null, this.g = null != e ? e : null, this.A = null != i ? i : null, this.e = null != n ? n : null
    }

    function m(t) {
        t = q.exec(t);
        var e = null, i = null, n = null, s = null;
        return t && (null !== t[1] && t[1] && (e = parseInt(t[1], 10)), null !== t[2] && t[2] && (i = parseInt(t[2], 10)), null !== t[3] && t[3] && (n = parseInt(t[3], 10)), null !== t[4] && t[4] && (s = /^[0-9]+$/.test(t[4]) ? parseInt(t[4], 10) : t[4])), new f(e, i, n, s)
    }

    function g(t, e, i, n, s, o, a, r) {
        this.M = t, this.k = r
    }

    function v(t) {
        this.a = t
    }

    function b(t) {
        var e = y(t.a, /(iPod|iPad|iPhone|Android|Windows Phone|BB\d{2}|BlackBerry)/, 1);
        return "" != e ? (/BB\d{2}/.test(e) && (e = "BlackBerry"), e) : (t = y(t.a, /(Linux|Mac_PowerPC|Macintosh|Windows|CrOS|PlayStation|CrKey)/, 1), "" != t ? ("Mac_PowerPC" == t ? t = "Macintosh" : "PlayStation" == t && (t = "Linux"), t) : "Unknown")
    }

    function S(t) {
        var e = y(t.a, /(OS X|Windows NT|Android) ([^;)]+)/, 2);
        if (e || (e = y(t.a, /Windows Phone( OS)? ([^;)]+)/, 2)) || (e = y(t.a, /(iPhone )?OS ([\d_]+)/, 2)))return e;
        if (e = y(t.a, /(?:Linux|CrOS|CrKey) ([^;)]+)/, 1))for (var e = e.split(/\s/), i = 0; i < e.length; i += 1)if (/^[\d\._]+$/.test(e[i]))return e[i];
        return (t = y(t.a, /(BB\d{2}|BlackBerry).*?Version\/([^\s]*)/, 2)) ? t : "Unknown"
    }

    function E(t) {
        var e = b(t), i = m(S(t)), n = m(y(t.a, /AppleWeb(?:K|k)it\/([\d\.\+]+)/, 1)), s = "Unknown", o = new f, o = "Unknown", a = !1;
        return /OPR\/[\d.]+/.test(t.a) ? s = "Opera" : -1 != t.a.indexOf("Chrome") || -1 != t.a.indexOf("CrMo") || -1 != t.a.indexOf("CriOS") ? s = "Chrome" : /Silk\/\d/.test(t.a) ? s = "Silk" : "BlackBerry" == e || "Android" == e ? s = "BuiltinBrowser" : -1 != t.a.indexOf("PhantomJS") ? s = "PhantomJS" : -1 != t.a.indexOf("Safari") ? s = "Safari" : -1 != t.a.indexOf("AdobeAIR") ? s = "AdobeAIR" : -1 != t.a.indexOf("PlayStation") && (s = "BuiltinBrowser"), "BuiltinBrowser" == s ? o = "Unknown" : "Silk" == s ? o = y(t.a, /Silk\/([\d\._]+)/, 1) : "Chrome" == s ? o = y(t.a, /(Chrome|CrMo|CriOS)\/([\d\.]+)/, 2) : -1 != t.a.indexOf("Version/") ? o = y(t.a, /Version\/([\d\.\w]+)/, 1) : "AdobeAIR" == s ? o = y(t.a, /AdobeAIR\/([\d\.]+)/, 1) : "Opera" == s ? o = y(t.a, /OPR\/([\d.]+)/, 1) : "PhantomJS" == s && (o = y(t.a, /PhantomJS\/([\d.]+)/, 1)), o = m(o), a = "AdobeAIR" == s ? 2 < o.c || 2 == o.c && 5 <= o.g : "BlackBerry" == e ? 10 <= i.c : "Android" == e ? 2 < i.c || 2 == i.c && 1 < i.g : 526 <= n.c || 525 <= n.c && 13 <= n.g, new g(s, 0, 0, 0, 0, 0, 0, new p(a, 536 > n.c || 536 == n.c && 11 > n.g))
    }

    function y(t, e, i) {
        return (t = t.match(e)) && t[i] ? t[i] : ""
    }

    function T(t) {
        this.la = t || "-"
    }

    function L(t, e) {
        this.M = t, this.Y = 4, this.N = "n";
        var i = (e || "n4").match(/^([nio])([1-9])$/i);
        i && (this.N = i[1], this.Y = parseInt(i[2], 10))
    }

    function _(t) {
        return t.N + t.Y
    }

    function w(t) {
        var e = 4, i = "n", n = null;
        return t && ((n = t.match(/(normal|oblique|italic)/i)) && n[1] && (i = n[1].substr(0, 1).toLowerCase()), (n = t.match(/([1-9]00|normal|bold)/i)) && n[1] && (/bold/i.test(n[1]) ? e = 7 : /[1-9]00/.test(n[1]) && (e = parseInt(n[1].substr(0, 1), 10)))), i + e
    }

    function C(t, e) {
        this.d = t, this.p = t.t.document.documentElement, this.P = e, this.j = "wf", this.h = new T("-"), this.ga = !1 !== e.events, this.B = !1 !== e.classes
    }

    function k(t) {
        if (t.B) {
            var e = c(t.p, t.h.e(t.j, "active")), i = [], n = [t.h.e(t.j, "loading")];
            e || i.push(t.h.e(t.j, "inactive")), l(t.p, i, n)
        }
        A(t, "inactive")
    }

    function A(t, e, i) {
        t.ga && t.P[e] && (i ? t.P[e](i.getName(), _(i)) : t.P[e]())
    }

    function x() {
        this.w = {}
    }

    function D(t, e) {
        this.d = t, this.G = e, this.m = this.d.createElement("span", {"aria-hidden": "true"}, this.G)
    }

    function I(t) {
        a(t.d, "body", t.m)
    }

    function M(t) {
        var e;
        e = [];
        for (var i = t.M.split(/,\s*/), n = 0; n < i.length; n++) {
            var s = i[n].replace(/['"]/g, "");
            e.push(-1 == s.indexOf(" ") ? s : "'" + s + "'")
        }
        return e = e.join(","), i = "normal", "o" === t.N ? i = "oblique" : "i" === t.N && (i = "italic"), "display:block;position:absolute;top:-999px;left:-999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:" + e + ";" + ("font-style:" + i + ";font-weight:" + (t.Y + "00") + ";")
    }

    function R(t, e, i, n, s, o, a, r) {
        this.Z = t, this.ja = e, this.d = i, this.s = n, this.G = r || "BESbswy", this.k = s, this.I = {}, this.W = o || 3e3, this.ba = a || null, this.F = this.D = null, t = new D(this.d, this.G), I(t);
        for (var l in Z)Z.hasOwnProperty(l) && (e = new L(Z[l], _(this.s)), e = M(e), t.m.style.cssText = e, this.I[Z[l]] = t.m.offsetWidth);
        t.remove()
    }

    function O(t, e, i) {
        for (var n in Z)if (Z.hasOwnProperty(n) && e === t.I[Z[n]] && i === t.I[Z[n]])return !0;
        return !1
    }

    function N(t) {
        var e = t.D.m.offsetWidth, i = t.F.m.offsetWidth;
        e === t.I.serif && i === t.I["sans-serif"] || t.k.fa && O(t, e, i) ? K() - t.na >= t.W ? t.k.fa && O(t, e, i) && (null === t.ba || t.ba.hasOwnProperty(t.s.getName())) ? $(t, t.Z) : $(t, t.ja) : P(t) : $(t, t.Z)
    }

    function P(t) {
        setTimeout(s(function () {
            N(this)
        }, t), 25)
    }

    function $(t, e) {
        t.D.remove(), t.F.remove(), e(t.s)
    }

    function U(t, e, i, n) {
        this.d = e, this.u = i, this.R = 0, this.da = this.aa = !1, this.W = n, this.k = t.k
    }

    function B(t, e, i, n, o) {
        if (i = i || {}, 0 === e.length && o)k(t.u); else for (t.R += e.length, o && (t.aa = o), o = 0; o < e.length; o++) {
            var a = e[o], r = i[a.getName()], c = t.u, d = a;
            c.B && l(c.p, [c.h.e(c.j, d.getName(), _(d).toString(), "loading")]), A(c, "fontloading", d), c = null, c = new R(s(t.ha, t), s(t.ia, t), t.d, a, t.k, t.W, n, r), c.start()
        }
    }

    function F(t) {
        0 == --t.R && t.aa && (t.da ? (t = t.u, t.B && l(t.p, [t.h.e(t.j, "active")], [t.h.e(t.j, "loading"), t.h.e(t.j, "inactive")]), A(t, "active")) : k(t.u))
    }

    function j(t) {
        this.J = t, this.v = new x, this.oa = new v(t.navigator.userAgent), this.a = this.oa.parse(), this.T = this.U = 0, this.Q = this.S = !0
    }

    function H(t, e, i, n, s) {
        var o = 0 == --t.U;
        (t.Q || t.S) && setTimeout(function () {
            B(e, i, n || null, s || null, o)
        }, 0)
    }

    function z(t, e, i) {
        this.O = t ? t : e + te, this.q = [], this.V = [], this.ea = i || ""
    }

    function V(t) {
        this.q = t, this.ca = [], this.L = {}
    }

    function X(t, e) {
        this.a = new v(navigator.userAgent).parse(), this.d = t, this.f = e
    }

    function W(t, e) {
        this.d = t, this.f = e, this.o = []
    }

    function Y(t, e) {
        this.d = t, this.f = e, this.o = []
    }

    function G(t, e) {
        this.d = t, this.f = e, this.o = []
    }

    function J(t, e) {
        this.d = t, this.f = e
    }

    var K = Date.now || function () {
            return +new Date
        };
    o.prototype.createElement = function (t, e, i) {
        if (t = this.C.createElement(t), e)for (var n in e)e.hasOwnProperty(n) && ("style" == n ? t.style.cssText = e[n] : t.setAttribute(n, e[n]));
        return i && t.appendChild(this.C.createTextNode(i)), t
    };
    var q = /^([0-9]+)(?:[\._-]([0-9]+))?(?:[\._-]([0-9]+))?(?:[\._+-]?(.*))?$/;
    f.prototype.compare = function (t) {
        return this.c > t.c || this.c === t.c && this.g > t.g || this.c === t.c && this.g === t.g && this.A > t.A ? 1 : this.c < t.c || this.c === t.c && this.g < t.g || this.c === t.c && this.g === t.g && this.A < t.A ? -1 : 0
    }, f.prototype.toString = function () {
        return [this.c, this.g || "", this.A || "", this.e || ""].join("")
    }, g.prototype.getName = function () {
        return this.M
    };
    var Q = new g("Unknown", 0, 0, 0, 0, 0, 0, new p(!1, !1));
    v.prototype.parse = function () {
        var t;
        if (-1 != this.a.indexOf("MSIE") || -1 != this.a.indexOf("Trident/")) {
            t = b(this);
            var e = m(S(this)), i = null, n = y(this.a, /Trident\/([\d\w\.]+)/, 1), i = m(-1 != this.a.indexOf("MSIE") ? y(this.a, /MSIE ([\d\w\.]+)/, 1) : y(this.a, /rv:([\d\w\.]+)/, 1));
            "" != n && m(n), t = new g("MSIE", 0, 0, 0, 0, 0, 0, new p("Windows" == t && 6 <= i.c || "Windows Phone" == t && 8 <= e.c, !1))
        } else if (-1 != this.a.indexOf("Opera"))t:if (t = m(y(this.a, /Presto\/([\d\w\.]+)/, 1)), m(S(this)), null !== t.c || m(y(this.a, /rv:([^\)]+)/, 1)), -1 != this.a.indexOf("Opera Mini/"))t = m(y(this.a, /Opera Mini\/([\d\.]+)/, 1)), t = new g("OperaMini", 0, 0, 0, b(this), 0, 0, new p(!1, !1)); else {
            if (-1 != this.a.indexOf("Version/") && (t = m(y(this.a, /Version\/([\d\.]+)/, 1)), null !== t.c)) {
                t = new g("Opera", 0, 0, 0, b(this), 0, 0, new p(10 <= t.c, !1));
                break t
            }
            t = m(y(this.a, /Opera[\/ ]([\d\.]+)/, 1)), t = null !== t.c ? new g("Opera", 0, 0, 0, b(this), 0, 0, new p(10 <= t.c, !1)) : new g("Opera", 0, 0, 0, b(this), 0, 0, new p(!1, !1))
        } else/OPR\/[\d.]+/.test(this.a) ? t = E(this) : /AppleWeb(K|k)it/.test(this.a) ? t = E(this) : -1 != this.a.indexOf("Gecko") ? (t = "Unknown", e = new f, m(S(this)), e = !1, -1 != this.a.indexOf("Firefox") ? (t = "Firefox", e = m(y(this.a, /Firefox\/([\d\w\.]+)/, 1)), e = 3 <= e.c && 5 <= e.g) : -1 != this.a.indexOf("Mozilla") && (t = "Mozilla"), i = m(y(this.a, /rv:([^\)]+)/, 1)), e || (e = 1 < i.c || 1 == i.c && 9 < i.g || 1 == i.c && 9 == i.g && 2 <= i.A), t = new g(t, 0, 0, 0, b(this), 0, 0, new p(e, !1))) : t = Q;
        return t
    }, T.prototype.e = function () {
        for (var t = [], e = 0; e < arguments.length; e++)t.push(arguments[e].replace(/[\W_]+/g, "").toLowerCase());
        return t.join(this.la)
    }, L.prototype.getName = function () {
        return this.M
    }, D.prototype.remove = function () {
        var t = this.m;
        t.parentNode && t.parentNode.removeChild(t)
    };
    var Z = {ra: "serif", qa: "sans-serif", pa: "monospace"};
    R.prototype.start = function () {
        this.D = new D(this.d, this.G), I(this.D), this.F = new D(this.d, this.G), I(this.F), this.na = K();
        var t = new L(this.s.getName() + ",serif", _(this.s)), t = M(t);
        this.D.m.style.cssText = t, t = new L(this.s.getName() + ",sans-serif", _(this.s)), t = M(t), this.F.m.style.cssText = t, N(this)
    }, U.prototype.ha = function (t) {
        var e = this.u;
        e.B && l(e.p, [e.h.e(e.j, t.getName(), _(t).toString(), "active")], [e.h.e(e.j, t.getName(), _(t).toString(), "loading"), e.h.e(e.j, t.getName(), _(t).toString(), "inactive")]), A(e, "fontactive", t), this.da = !0, F(this)
    }, U.prototype.ia = function (t) {
        var e = this.u;
        if (e.B) {
            var i = c(e.p, e.h.e(e.j, t.getName(), _(t).toString(), "active")), n = [], s = [e.h.e(e.j, t.getName(), _(t).toString(), "loading")];
            i || n.push(e.h.e(e.j, t.getName(), _(t).toString(), "inactive")), l(e.p, n, s)
        }
        A(e, "fontinactive", t), F(this)
    }, j.prototype.load = function (t) {
        this.d = new o(this.J, t.context || this.J), this.S = !1 !== t.events, this.Q = !1 !== t.classes;
        var e = new C(this.d, t), i = [], n = t.timeout;
        e.B && l(e.p, [e.h.e(e.j, "loading")]), A(e, "loading");
        var a, i = this.v, r = this.d, c = [];
        for (a in t)if (t.hasOwnProperty(a)) {
            var d = i.w[a];
            d && c.push(d(t[a], r))
        }
        for (i = c, this.T = this.U = i.length, t = new U(this.a, this.d, e, n), n = 0, a = i.length; a > n; n++)r = i[n], r.K(this.a, s(this.ka, this, r, e, t))
    }, j.prototype.ka = function (t, e, i, n) {
        var s = this;
        n ? t.load(function (t, e, n) {
            H(s, i, t, e, n)
        }) : (t = 0 == --this.U, this.T--, t && 0 == this.T ? k(e) : (this.Q || this.S) && B(i, [], {}, null, t))
    };
    var te = "//fonts.googleapis.com/css";
    z.prototype.e = function () {
        if (0 == this.q.length)throw Error("No fonts to load!");
        if (-1 != this.O.indexOf("kit="))return this.O;
        for (var t = this.q.length, e = [], i = 0; t > i; i++)e.push(this.q[i].replace(/ /g, "+"));
        return t = this.O + "?family=" + e.join("%7C"), 0 < this.V.length && (t += "&subset=" + this.V.join(",")), 0 < this.ea.length && (t += "&text=" + encodeURIComponent(this.ea)), t
    };
    var ee = {
        latin: "BESbswy",
        cyrillic: "&#1081;&#1103;&#1046;",
        greek: "&#945;&#946;&#931;",
        khmer: "&#x1780;&#x1781;&#x1782;",
        Hanuman: "&#x1780;&#x1781;&#x1782;"
    }, ie = {
        thin: "1",
        extralight: "2",
        "extra-light": "2",
        ultralight: "2",
        "ultra-light": "2",
        light: "3",
        regular: "4",
        book: "4",
        medium: "5",
        "semi-bold": "6",
        semibold: "6",
        "demi-bold": "6",
        demibold: "6",
        bold: "7",
        "extra-bold": "8",
        extrabold: "8",
        "ultra-bold": "8",
        ultrabold: "8",
        black: "9",
        heavy: "9",
        l: "3",
        r: "4",
        b: "7"
    }, ne = {
        i: "i",
        italic: "i",
        n: "n",
        normal: "n"
    }, se = /^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$/;
    V.prototype.parse = function () {
        for (var t = this.q.length, e = 0; t > e; e++) {
            var i = this.q[e].split(":"), n = i[0].replace(/\+/g, " "), s = ["n4"];
            if (2 <= i.length) {
                var o, a = i[1];
                if (o = [], a)for (var a = a.split(","), r = a.length, l = 0; r > l; l++) {
                    var c;
                    if (c = a[l], c.match(/^[\w-]+$/)) {
                        c = se.exec(c.toLowerCase());
                        var d = void 0;
                        if (null == c)d = ""; else {
                            if (d = void 0, d = c[1], null == d || "" == d)d = "4"; else var h = ie[d], d = h ? h : isNaN(d) ? "4" : d.substr(0, 1);
                            c = c[2], d = [null == c || "" == c ? "n" : ne[c], d].join("")
                        }
                        c = d
                    } else c = "";
                    c && o.push(c)
                }
                0 < o.length && (s = o), 3 == i.length && (i = i[2], o = [], i = i ? i.split(",") : o, 0 < i.length && (i = ee[i[0]]) && (this.L[n] = i))
            }
            for (this.L[n] || (i = ee[n]) && (this.L[n] = i), i = 0; i < s.length; i += 1)this.ca.push(new L(n, s[i]))
        }
    };
    var oe = {Arimo: !0, Cousine: !0, Tinos: !0};
    X.prototype.K = function (t, e) {
        e(t.k.X)
    }, X.prototype.load = function (t) {
        var e = this.d;
        "MSIE" == this.a.getName() && 1 != this.f.blocking ? r(e, s(this.$, this, t)) : this.$(t)
    }, X.prototype.$ = function (t) {
        for (var e = this.d, i = new z(this.f.api, d(e), this.f.text), n = this.f.families, s = n.length, o = 0; s > o; o++) {
            var a = n[o].split(":");
            3 == a.length && i.V.push(a.pop());
            var r = "";
            2 == a.length && "" != a[1] && (r = ":"), i.q.push(a.join(r))
        }
        n = new V(n), n.parse(), h(e, i.e()), t(n.ca, n.L, oe)
    }, W.prototype.H = function (t) {
        var e = this.d;
        return d(this.d) + (this.f.api || "//f.fontdeck.com/s/css/js/") + (e.t.location.hostname || e.J.location.hostname) + "/" + t + ".js"
    }, W.prototype.K = function (t, e) {
        var i = this.f.id, n = this.d.t, s = this;
        i ? (n.__webfontfontdeckmodule__ || (n.__webfontfontdeckmodule__ = {}), n.__webfontfontdeckmodule__[i] = function (t, i) {
            for (var n = 0, o = i.fonts.length; o > n; ++n) {
                var a = i.fonts[n];
                s.o.push(new L(a.name, w("font-weight:" + a.weight + ";font-style:" + a.style)))
            }
            e(t)
        }, u(this.d, this.H(i), function (t) {
            t && e(!1)
        })) : e(!1)
    }, W.prototype.load = function (t) {
        t(this.o)
    }, Y.prototype.H = function (t) {
        var e = d(this.d);
        return (this.f.api || e + "//use.typekit.net") + "/" + t + ".js"
    }, Y.prototype.K = function (t, e) {
        var i = this.f.id, n = this.d.t, s = this;
        i ? u(this.d, this.H(i), function (t) {
            if (t)e(!1); else {
                if (n.Typekit && n.Typekit.config && n.Typekit.config.fn) {
                    t = n.Typekit.config.fn;
                    for (var i = 0; i < t.length; i += 2)for (var o = t[i], a = t[i + 1], r = 0; r < a.length; r++)s.o.push(new L(o, a[r]));
                    try {
                        n.Typekit.load({events: !1, classes: !1})
                    } catch (l) {
                    }
                }
                e(!0)
            }
        }, 2e3) : e(!1)
    }, Y.prototype.load = function (t) {
        t(this.o)
    }, G.prototype.K = function (t, e) {
        var i = this, n = i.f.projectId, s = i.f.version;
        if (n) {
            var o = i.d.t;
            u(this.d, i.H(n, s), function (s) {
                if (s)e(!1); else {
                    if (o["__mti_fntLst" + n] && (s = o["__mti_fntLst" + n]()))for (var a = 0; a < s.length; a++)i.o.push(new L(s[a].fontfamily));
                    e(t.k.X)
                }
            }).id = "__MonotypeAPIScript__" + n
        } else e(!1)
    }, G.prototype.H = function (t, e) {
        var i = d(this.d), n = (this.f.api || "fast.fonts.net/jsapi").replace(/^.*http(s?):(\/\/)?/, "");
        return i + "//" + n + "/" + t + ".js" + (e ? "?v=" + e : "")
    }, G.prototype.load = function (t) {
        t(this.o)
    }, J.prototype.load = function (t) {
        var e, i, n = this.f.urls || [], s = this.f.families || [], o = this.f.testStrings || {};
        for (e = 0, i = n.length; i > e; e++)h(this.d, n[e]);
        for (n = [], e = 0, i = s.length; i > e; e++) {
            var a = s[e].split(":");
            if (a[1])for (var r = a[1].split(","), l = 0; l < r.length; l += 1)n.push(new L(a[0], r[l]));
            else n.push(new L(a[0]))
        }
        t(n, o)
    }, J.prototype.K = function (t, e) {
        return e(t.k.X)
    };
    var ae = new j(this);
    ae.v.w.custom = function (t, e) {
        return new J(e, t)
    }, ae.v.w.fontdeck = function (t, e) {
        return new W(e, t)
    }, ae.v.w.monotype = function (t, e) {
        return new G(e, t)
    }, ae.v.w.typekit = function (t, e) {
        return new Y(e, t)
    }, ae.v.w.google = function (t, e) {
        return new X(e, t)
    }, this.WebFont || (this.WebFont = {}, this.WebFont.load = s(ae.load, ae), this.WebFontConfig && ae.load(this.WebFontConfig))
}(this, document);