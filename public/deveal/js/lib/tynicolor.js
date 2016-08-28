!function () {
    function t(t) {
        var i = {r: 0, g: 0, b: 0}, s = 1, a = !1, r = !1;
        return "string" == typeof t && (t = M(t)), "object" == typeof t && (t.hasOwnProperty("r") && t.hasOwnProperty("g") && t.hasOwnProperty("b") ? (i = e(t.r, t.g, t.b), a = !0, r = "%" === String(t.r).substr(-1) ? "prgb" : "rgb") : t.hasOwnProperty("h") && t.hasOwnProperty("s") && t.hasOwnProperty("v") ? (t.s = x(t.s), t.v = x(t.v), i = o(t.h, t.s, t.v), a = !0, r = "hsv") : t.hasOwnProperty("h") && t.hasOwnProperty("s") && t.hasOwnProperty("l") && (t.s = x(t.s), t.l = x(t.l), i = n(t.h, t.s, t.l), a = !0, r = "hsl"), t.hasOwnProperty("a") && (s = t.a)), s = T(s), {
            ok: a,
            format: t.format || r,
            r: U(255, B(i.r, 0)),
            g: U(255, B(i.g, 0)),
            b: U(255, B(i.b, 0)),
            a: s
        }
    }

    function e(t, e, i) {
        return {r: 255 * L(t, 255), g: 255 * L(e, 255), b: 255 * L(i, 255)}
    }

    function i(t, e, i) {
        t = L(t, 255), e = L(e, 255), i = L(i, 255);
        var n, s, o = B(t, e, i), a = U(t, e, i), r = (o + a) / 2;
        if (o == a)n = s = 0; else {
            var l = o - a;
            switch (s = r > .5 ? l / (2 - o - a) : l / (o + a), o) {
                case t:
                    n = (e - i) / l + (i > e ? 6 : 0);
                    break;
                case e:
                    n = (i - t) / l + 2;
                    break;
                case i:
                    n = (t - e) / l + 4
            }
            n /= 6
        }
        return {h: n, s: s, l: r}
    }

    function n(t, e, i) {
        function n(t, e, i) {
            return 0 > i && (i += 1), i > 1 && (i -= 1), 1 / 6 > i ? t + 6 * (e - t) * i : .5 > i ? e : 2 / 3 > i ? t + (e - t) * (2 / 3 - i) * 6 : t
        }

        var s, o, a;
        if (t = L(t, 360), e = L(e, 100), i = L(i, 100), 0 === e)s = o = a = i; else {
            var r = .5 > i ? i * (1 + e) : i + e - i * e, l = 2 * i - r;
            s = n(l, r, t + 1 / 3), o = n(l, r, t), a = n(l, r, t - 1 / 3)
        }
        return {r: 255 * s, g: 255 * o, b: 255 * a}
    }

    function s(t, e, i) {
        t = L(t, 255), e = L(e, 255), i = L(i, 255);
        var n, s, o = B(t, e, i), a = U(t, e, i), r = o, l = o - a;
        if (s = 0 === o ? 0 : l / o, o == a)n = 0; else {
            switch (o) {
                case t:
                    n = (e - i) / l + (i > e ? 6 : 0);
                    break;
                case e:
                    n = (i - t) / l + 2;
                    break;
                case i:
                    n = (t - e) / l + 4
            }
            n /= 6
        }
        return {h: n, s: s, v: r}
    }

    function o(t, e, i) {
        t = 6 * L(t, 360), e = L(e, 100), i = L(i, 100);
        var n = P.floor(t), s = t - n, o = i * (1 - e), a = i * (1 - s * e), r = i * (1 - (1 - s) * e), l = n % 6, c = [i, a, o, o, r, i][l], d = [r, i, i, a, o, o][l], h = [o, o, r, i, i, a][l];
        return {r: 255 * c, g: 255 * d, b: 255 * h}
    }

    function a(t, e, i, n) {
        var s = [A($(t).toString(16)), A($(e).toString(16)), A($(i).toString(16))];
        return n && s[0].charAt(0) == s[0].charAt(1) && s[1].charAt(0) == s[1].charAt(1) && s[2].charAt(0) == s[2].charAt(1) ? s[0].charAt(0) + s[1].charAt(0) + s[2].charAt(0) : s.join("")
    }

    function r(t, e, i, n) {
        var s = [A(D(n)), A($(t).toString(16)), A($(e).toString(16)), A($(i).toString(16))];
        return s.join("")
    }

    function l(t, e) {
        e = 0 === e ? 0 : e || 10;
        var i = j(t).toHsl();
        return i.s -= e / 100, i.s = _(i.s), j(i)
    }

    function c(t, e) {
        e = 0 === e ? 0 : e || 10;
        var i = j(t).toHsl();
        return i.s += e / 100, i.s = _(i.s), j(i)
    }

    function d(t) {
        return j(t).desaturate(100)
    }

    function h(t, e) {
        e = 0 === e ? 0 : e || 10;
        var i = j(t).toHsl();
        return i.l += e / 100, i.l = _(i.l), j(i)
    }

    function u(t, e) {
        e = 0 === e ? 0 : e || 10;
        var i = j(t).toRgb();
        return i.r = B(0, U(255, i.r - $(255 * -(e / 100)))), i.g = B(0, U(255, i.g - $(255 * -(e / 100)))), i.b = B(0, U(255, i.b - $(255 * -(e / 100)))), j(i)
    }

    function p(t, e) {
        e = 0 === e ? 0 : e || 10;
        var i = j(t).toHsl();
        return i.l -= e / 100, i.l = _(i.l), j(i)
    }

    function f(t, e) {
        var i = j(t).toHsl(), n = ($(i.h) + e) % 360;
        return i.h = 0 > n ? 360 + n : n, j(i)
    }

    function m(t) {
        var e = j(t).toHsl();
        return e.h = (e.h + 180) % 360, j(e)
    }

    function g(t) {
        var e = j(t).toHsl(), i = e.h;
        return [j(t), j({
            h: (i + 120) % 360,
            s: e.s,
            l: e.l
        }), j({h: (i + 240) % 360, s: e.s, l: e.l})]
    }

    function v(t) {
        var e = j(t).toHsl(), i = e.h;
        return [j(t), j({h: (i + 90) % 360, s: e.s, l: e.l}), j({
            h: (i + 180) % 360,
            s: e.s,
            l: e.l
        }), j({h: (i + 270) % 360, s: e.s, l: e.l})]
    }

    function b(t) {
        var e = j(t).toHsl(), i = e.h;
        return [j(t), j({h: (i + 72) % 360, s: e.s, l: e.l}), j({
            h: (i + 216) % 360,
            s: e.s,
            l: e.l
        })]
    }

    function S(t, e, i) {
        e = e || 6, i = i || 30;
        var n = j(t).toHsl(), s = 360 / i, o = [j(t)];
        for (n.h = (n.h - (s * e >> 1) + 720) % 360; --e;)n.h = (n.h + s) % 360, o.push(j(n));
        return o
    }

    function E(t, e) {
        e = e || 6;
        for (var i = j(t).toHsv(), n = i.h, s = i.s, o = i.v, a = [], r = 1 / e; e--;)a.push(j({
            h: n,
            s: s,
            v: o
        })), o = (o + r) % 1;
        return a
    }

    function y(t) {
        var e = {};
        for (var i in t)t.hasOwnProperty(i) && (e[t[i]] = i);
        return e
    }

    function T(t) {
        return t = parseFloat(t), (isNaN(t) || 0 > t || t > 1) && (t = 1), t
    }

    function L(t, e) {
        C(t) && (t = "100%");
        var i = k(t);
        return t = U(e, B(0, parseFloat(t))), i && (t = parseInt(t * e, 10) / 100), P.abs(t - e) < 1e-6 ? 1 : t % e / parseFloat(e)
    }

    function _(t) {
        return U(1, B(0, t))
    }

    function w(t) {
        return parseInt(t, 16)
    }

    function C(t) {
        return "string" == typeof t && -1 != t.indexOf(".") && 1 === parseFloat(t)
    }

    function k(t) {
        return "string" == typeof t && -1 != t.indexOf("%")
    }

    function A(t) {
        return 1 == t.length ? "0" + t : "" + t
    }

    function x(t) {
        return 1 >= t && (t = 100 * t + "%"), t
    }

    function D(t) {
        return Math.round(255 * parseFloat(t)).toString(16)
    }

    function I(t) {
        return w(t) / 255
    }

    function M(t) {
        t = t.replace(R, "").replace(O, "").toLowerCase();
        var e = !1;
        if (H[t])t = H[t], e = !0; else if ("transparent" == t)return {
            r: 0,
            g: 0,
            b: 0,
            a: 0,
            format: "name"
        };
        var i;
        return (i = V.rgb.exec(t)) ? {
            r: i[1],
            g: i[2],
            b: i[3]
        } : (i = V.rgba.exec(t)) ? {
            r: i[1],
            g: i[2],
            b: i[3],
            a: i[4]
        } : (i = V.hsl.exec(t)) ? {
            h: i[1],
            s: i[2],
            l: i[3]
        } : (i = V.hsla.exec(t)) ? {
            h: i[1],
            s: i[2],
            l: i[3],
            a: i[4]
        } : (i = V.hsv.exec(t)) ? {
            h: i[1],
            s: i[2],
            v: i[3]
        } : (i = V.hex8.exec(t)) ? {
            a: I(i[1]),
            r: w(i[2]),
            g: w(i[3]),
            b: w(i[4]),
            format: e ? "name" : "hex8"
        } : (i = V.hex6.exec(t)) ? {
            r: w(i[1]),
            g: w(i[2]),
            b: w(i[3]),
            format: e ? "name" : "hex"
        } : (i = V.hex3.exec(t)) ? {
            r: w(i[1] + "" + i[1]),
            g: w(i[2] + "" + i[2]),
            b: w(i[3] + "" + i[3]),
            format: e ? "name" : "hex"
        } : !1
    }

    var R = /^[\s,#]+/, O = /\s+$/, N = 0, P = Math, $ = P.round, U = P.min, B = P.max, F = P.random, j = function X(e, i) {
        if (e = e ? e : "", i = i || {}, e instanceof X)return e;
        if (!(this instanceof X))return new X(e, i);
        var n = t(e);
        this._r = n.r, this._g = n.g, this._b = n.b, this._a = n.a, this._roundA = $(100 * this._a) / 100, this._format = i.format || n.format, this._gradientType = i.gradientType, this._r < 1 && (this._r = $(this._r)), this._g < 1 && (this._g = $(this._g)), this._b < 1 && (this._b = $(this._b)), this._ok = n.ok, this._tc_id = N++
    };
    j.prototype = {
        isDark: function () {
            return this.getBrightness() < 128
        }, isLight: function () {
            return !this.isDark()
        }, isValid: function () {
            return this._ok
        }, getFormat: function () {
            return this._format
        }, getAlpha: function () {
            return this._a
        }, getBrightness: function () {
            var t = this.toRgb();
            return (299 * t.r + 587 * t.g + 114 * t.b) / 1e3
        }, setAlpha: function (t) {
            return this._a = T(t), this._roundA = $(100 * this._a) / 100, this
        }, toHsv: function () {
            var t = s(this._r, this._g, this._b);
            return {h: 360 * t.h, s: t.s, v: t.v, a: this._a}
        }, toHsvString: function () {
            var t = s(this._r, this._g, this._b), e = $(360 * t.h), i = $(100 * t.s), n = $(100 * t.v);
            return 1 == this._a ? "hsv(" + e + ", " + i + "%, " + n + "%)" : "hsva(" + e + ", " + i + "%, " + n + "%, " + this._roundA + ")"
        }, toHsl: function () {
            var t = i(this._r, this._g, this._b);
            return {h: 360 * t.h, s: t.s, l: t.l, a: this._a}
        }, toHslString: function () {
            var t = i(this._r, this._g, this._b), e = $(360 * t.h), n = $(100 * t.s), s = $(100 * t.l);
            return 1 == this._a ? "hsl(" + e + ", " + n + "%, " + s + "%)" : "hsla(" + e + ", " + n + "%, " + s + "%, " + this._roundA + ")"
        }, toHex: function (t) {
            return a(this._r, this._g, this._b, t)
        }, toHexString: function (t) {
            return "#" + this.toHex(t)
        }, toHex8: function () {
            return r(this._r, this._g, this._b, this._a)
        }, toHex8String: function () {
            return "#" + this.toHex8()
        }, toRgb: function () {
            return {r: $(this._r), g: $(this._g), b: $(this._b), a: this._a}
        }, toRgbString: function () {
            return 1 == this._a ? "rgb(" + $(this._r) + ", " + $(this._g) + ", " + $(this._b) + ")" : "rgba(" + $(this._r) + ", " + $(this._g) + ", " + $(this._b) + ", " + this._roundA + ")"
        }, toPercentageRgb: function () {
            return {
                r: $(100 * L(this._r, 255)) + "%",
                g: $(100 * L(this._g, 255)) + "%",
                b: $(100 * L(this._b, 255)) + "%",
                a: this._a
            }
        }, toPercentageRgbString: function () {
            return 1 == this._a ? "rgb(" + $(100 * L(this._r, 255)) + "%, " + $(100 * L(this._g, 255)) + "%, " + $(100 * L(this._b, 255)) + "%)" : "rgba(" + $(100 * L(this._r, 255)) + "%, " + $(100 * L(this._g, 255)) + "%, " + $(100 * L(this._b, 255)) + "%, " + this._roundA + ")"
        }, toName: function () {
            return 0 === this._a ? "transparent" : this._a < 1 ? !1 : z[a(this._r, this._g, this._b, !0)] || !1
        }, toFilter: function (t) {
            var e = "#" + r(this._r, this._g, this._b, this._a), i = e, n = this._gradientType ? "GradientType = 1, " : "";
            if (t) {
                var s = j(t);
                i = s.toHex8String()
            }
            return "progid:DXImageTransform.Microsoft.gradient(" + n + "startColorstr=" + e + ",endColorstr=" + i + ")"
        }, toString: function (t) {
            var e = !!t;
            t = t || this._format;
            var i = !1, n = this._a < 1 && this._a >= 0, s = !e && n && ("hex" === t || "hex6" === t || "hex3" === t || "name" === t);
            return s ? "name" === t && 0 === this._a ? this.toName() : this.toRgbString() : ("rgb" === t && (i = this.toRgbString()), "prgb" === t && (i = this.toPercentageRgbString()), ("hex" === t || "hex6" === t) && (i = this.toHexString()), "hex3" === t && (i = this.toHexString(!0)), "hex8" === t && (i = this.toHex8String()), "name" === t && (i = this.toName()), "hsl" === t && (i = this.toHslString()), "hsv" === t && (i = this.toHsvString()), i || this.toHexString())
        }, _applyModification: function (t, e) {
            var i = t.apply(null, [this].concat([].slice.call(e)));
            return this._r = i._r, this._g = i._g, this._b = i._b, this.setAlpha(i._a), this
        }, lighten: function () {
            return this._applyModification(h, arguments)
        }, brighten: function () {
            return this._applyModification(u, arguments)
        }, darken: function () {
            return this._applyModification(p, arguments)
        }, desaturate: function () {
            return this._applyModification(l, arguments)
        }, saturate: function () {
            return this._applyModification(c, arguments)
        }, greyscale: function () {
            return this._applyModification(d, arguments)
        }, spin: function () {
            return this._applyModification(f, arguments)
        }, _applyCombination: function (t, e) {
            return t.apply(null, [this].concat([].slice.call(e)))
        }, analogous: function () {
            return this._applyCombination(S, arguments)
        }, complement: function () {
            return this._applyCombination(m, arguments)
        }, monochromatic: function () {
            return this._applyCombination(E, arguments)
        }, splitcomplement: function () {
            return this._applyCombination(b, arguments)
        }, triad: function () {
            return this._applyCombination(g, arguments)
        }, tetrad: function () {
            return this._applyCombination(v, arguments)
        }
    }, j.fromRatio = function (t, e) {
        if ("object" == typeof t) {
            var i = {};
            for (var n in t)t.hasOwnProperty(n) && (i[n] = "a" === n ? t[n] : x(t[n]));
            t = i
        }
        return j(t, e)
    }, j.equals = function (t, e) {
        return t && e ? j(t).toRgbString() == j(e).toRgbString() : !1
    }, j.random = function () {
        return j.fromRatio({r: F(), g: F(), b: F()})
    }, j.mix = function (t, e, i) {
        i = 0 === i ? 0 : i || 50;
        var n, s = j(t).toRgb(), o = j(e).toRgb(), a = i / 100, r = 2 * a - 1, l = o.a - s.a;
        n = r * l == -1 ? r : (r + l) / (1 + r * l), n = (n + 1) / 2;
        var c = 1 - n, d = {
            r: o.r * n + s.r * c,
            g: o.g * n + s.g * c,
            b: o.b * n + s.b * c,
            a: o.a * a + s.a * (1 - a)
        };
        return j(d)
    }, j.readability = function (t, e) {
        var i = j(t), n = j(e), s = i.toRgb(), o = n.toRgb(), a = i.getBrightness(), r = n.getBrightness(), l = Math.max(s.r, o.r) - Math.min(s.r, o.r) + Math.max(s.g, o.g) - Math.min(s.g, o.g) + Math.max(s.b, o.b) - Math.min(s.b, o.b);
        return {brightness: Math.abs(a - r), color: l}
    }, j.isReadable = function (t, e) {
        var i = j.readability(t, e);
        return i.brightness > 125 && i.color > 500
    }, j.mostReadable = function (t, e) {
        for (var i = null, n = 0, s = !1, o = 0; o < e.length; o++) {
            var a = j.readability(t, e[o]), r = a.brightness > 125 && a.color > 500, l = 3 * (a.brightness / 125) + a.color / 500;
            (r && !s || r && s && l > n || !r && !s && l > n) && (s = r, n = l, i = j(e[o]))
        }
        return i
    };
    var H = j.names = {
        aliceblue: "f0f8ff",
        antiquewhite: "faebd7",
        aqua: "0ff",
        aquamarine: "7fffd4",
        azure: "f0ffff",
        beige: "f5f5dc",
        bisque: "ffe4c4",
        black: "000",
        blanchedalmond: "ffebcd",
        blue: "00f",
        blueviolet: "8a2be2",
        brown: "a52a2a",
        burlywood: "deb887",
        burntsienna: "ea7e5d",
        cadetblue: "5f9ea0",
        chartreuse: "7fff00",
        chocolate: "d2691e",
        coral: "ff7f50",
        cornflowerblue: "6495ed",
        cornsilk: "fff8dc",
        crimson: "dc143c",
        cyan: "0ff",
        darkblue: "00008b",
        darkcyan: "008b8b",
        darkgoldenrod: "b8860b",
        darkgray: "a9a9a9",
        darkgreen: "006400",
        darkgrey: "a9a9a9",
        darkkhaki: "bdb76b",
        darkmagenta: "8b008b",
        darkolivegreen: "556b2f",
        darkorange: "ff8c00",
        darkorchid: "9932cc",
        darkred: "8b0000",
        darksalmon: "e9967a",
        darkseagreen: "8fbc8f",
        darkslateblue: "483d8b",
        darkslategray: "2f4f4f",
        darkslategrey: "2f4f4f",
        darkturquoise: "00ced1",
        darkviolet: "9400d3",
        deeppink: "ff1493",
        deepskyblue: "00bfff",
        dimgray: "696969",
        dimgrey: "696969",
        dodgerblue: "1e90ff",
        firebrick: "b22222",
        floralwhite: "fffaf0",
        forestgreen: "228b22",
        fuchsia: "f0f",
        gainsboro: "dcdcdc",
        ghostwhite: "f8f8ff",
        gold: "ffd700",
        goldenrod: "daa520",
        gray: "808080",
        green: "008000",
        greenyellow: "adff2f",
        grey: "808080",
        honeydew: "f0fff0",
        hotpink: "ff69b4",
        indianred: "cd5c5c",
        indigo: "4b0082",
        ivory: "fffff0",
        khaki: "f0e68c",
        lavender: "e6e6fa",
        lavenderblush: "fff0f5",
        lawngreen: "7cfc00",
        lemonchiffon: "fffacd",
        lightblue: "add8e6",
        lightcoral: "f08080",
        lightcyan: "e0ffff",
        lightgoldenrodyellow: "fafad2",
        lightgray: "d3d3d3",
        lightgreen: "90ee90",
        lightgrey: "d3d3d3",
        lightpink: "ffb6c1",
        lightsalmon: "ffa07a",
        lightseagreen: "20b2aa",
        lightskyblue: "87cefa",
        lightslategray: "789",
        lightslategrey: "789",
        lightsteelblue: "b0c4de",
        lightyellow: "ffffe0",
        lime: "0f0",
        limegreen: "32cd32",
        linen: "faf0e6",
        magenta: "f0f",
        maroon: "800000",
        mediumaquamarine: "66cdaa",
        mediumblue: "0000cd",
        mediumorchid: "ba55d3",
        mediumpurple: "9370db",
        mediumseagreen: "3cb371",
        mediumslateblue: "7b68ee",
        mediumspringgreen: "00fa9a",
        mediumturquoise: "48d1cc",
        mediumvioletred: "c71585",
        midnightblue: "191970",
        mintcream: "f5fffa",
        mistyrose: "ffe4e1",
        moccasin: "ffe4b5",
        navajowhite: "ffdead",
        navy: "000080",
        oldlace: "fdf5e6",
        olive: "808000",
        olivedrab: "6b8e23",
        orange: "ffa500",
        orangered: "ff4500",
        orchid: "da70d6",
        palegoldenrod: "eee8aa",
        palegreen: "98fb98",
        paleturquoise: "afeeee",
        palevioletred: "db7093",
        papayawhip: "ffefd5",
        peachpuff: "ffdab9",
        peru: "cd853f",
        pink: "ffc0cb",
        plum: "dda0dd",
        powderblue: "b0e0e6",
        purple: "800080",
        red: "f00",
        rosybrown: "bc8f8f",
        royalblue: "4169e1",
        saddlebrown: "8b4513",
        salmon: "fa8072",
        sandybrown: "f4a460",
        seagreen: "2e8b57",
        seashell: "fff5ee",
        sienna: "a0522d",
        silver: "c0c0c0",
        skyblue: "87ceeb",
        slateblue: "6a5acd",
        slategray: "708090",
        slategrey: "708090",
        snow: "fffafa",
        springgreen: "00ff7f",
        steelblue: "4682b4",
        tan: "d2b48c",
        teal: "008080",
        thistle: "d8bfd8",
        tomato: "ff6347",
        turquoise: "40e0d0",
        violet: "ee82ee",
        wheat: "f5deb3",
        white: "fff",
        whitesmoke: "f5f5f5",
        yellow: "ff0",
        yellowgreen: "9acd32"
    }, z = j.hexNames = y(H), V = function () {
        var t = "[-\\+]?\\d+%?", e = "[-\\+]?\\d*\\.\\d+%?", i = "(?:" + e + ")|(?:" + t + ")", n = "[\\s|\\(]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")\\s*\\)?", s = "[\\s|\\(]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")\\s*\\)?";
        return {
            rgb: new RegExp("rgb" + n),
            rgba: new RegExp("rgba" + s),
            hsl: new RegExp("hsl" + n),
            hsla: new RegExp("hsla" + s),
            hsv: new RegExp("hsv" + n),
            hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
        }
    }();
    "undefined" != typeof module && module.exports ? module.exports = j : "function" == typeof define && define.amd ? define(function () {
        return j
    }) : window.tinycolor = j
}();