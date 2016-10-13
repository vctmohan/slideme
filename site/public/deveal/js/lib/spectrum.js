!function (e, t, i) {
    "use strict";
    function n(e, i, n, r) {
        for (var o = [], s = 0; s < e.length; s++) {
            var a = e[s];
            if (a) {
                var l = tinycolor(a), c = l.toHsl().l < .5 ? "sp-thumb-el sp-thumb-dark" : "sp-thumb-el sp-thumb-light";
                c += tinycolor.equals(i, a) ? " sp-thumb-active" : "";
                var d = l.toString(r.preferredFormat || "rgb"), h = f ? "background-color:" + l.toRgbString() : "filter:" + l.toFilter();
                o.push('<span title="' + d + '" data-color="' + l.toRgbString() + '" class="' + c + '"><span class="sp-thumb-inner" style="' + h + ';" /></span>')
            } else {
                var u = "sp-clear-display";
                o.push(t("<div />").append(t('<span data-color="" style="background-color:transparent;" class="' + u + '"></span>').attr("title", r.noColorSelectedText)).html())
            }
        }
        return "<div class='sp-cf " + n + "'>" + o.join("") + "</div>"
    }

    function r() {
        for (var e = 0; e < m.length; e++)m[e] && m[e].hide()
    }

    function o(e, i) {
        var n = t.extend({}, p, e);
        return n.callbacks = {
            move: d(n.move, i),
            change: d(n.change, i),
            show: d(n.show, i),
            hide: d(n.hide, i),
            beforeShow: d(n.beforeShow, i)
        }, n
    }

    function s(s, l) {
        function d() {
            if (H.showPaletteOnly && (H.showPalette = !0), Mt.text(H.showPaletteOnly ? H.togglePaletteMoreText : H.togglePaletteLessText), H.palette) {
                dt = H.palette.slice(0), ht = t.isArray(dt[0]) ? dt : [dt], ut = {};
                for (var e = 0; e < ht.length; e++)for (var i = 0; i < ht[e].length; i++) {
                    var n = tinycolor(ht[e][i]).toRgbString();
                    ut[n] = !0
                }
            }
            yt.toggleClass("sp-flat", V), yt.toggleClass("sp-input-disabled", !H.showInput), yt.toggleClass("sp-alpha-enabled", H.showAlpha), yt.toggleClass("sp-clear-enabled", Kt), yt.toggleClass("sp-buttons-disabled", !H.showButtons), yt.toggleClass("sp-palette-buttons-disabled", !H.togglePaletteOnly), yt.toggleClass("sp-palette-disabled", !H.showPalette), yt.toggleClass("sp-selection-palette-disabled", !H.showSelectionPalette), yt.toggleClass("sp-palette-only", H.showPaletteOnly), yt.toggleClass("sp-initial-disabled", !H.showInitial), yt.addClass(H.className).addClass(H.containerClassName), U()
        }

        function p() {
            function e(e) {
                return e.data && e.data.ignore ? (F(t(e.target).closest(".sp-thumb-el").data("color")), M()) : (F(t(e.target).closest(".sp-thumb-el").data("color")), M(), N(!0), H.hideAfterPaletteSelect && (V ? X.hide(B()) : L())), !1
            }

            if (g && yt.find("*:not(input)").attr("unselectable", "on"), d(), Nt && vt.after(Ut).hide(), Kt || Bt.hide(), V)vt.after(yt).hide(); else {
                var i = "parent" === H.appendTo ? vt.parent() : t(H.appendTo);
                1 !== i.length && (i = t("body")), i.append(yt)
            }
            y(), $t.bind("click.spectrum touchstart.spectrum", function (e) {
                Ct || I(), e.stopPropagation(), t(e.target).is("input") || e.preventDefault()
            }), (vt.is(":disabled") || H.disabled === !0) && z(), yt.click(c), Dt.change(x), Dt.bind("paste", function () {
                setTimeout(x, 1)
            }), Dt.keydown(function (e) {
                13 == e.keyCode && x()
            }), Ft.text(H.cancelText), Ft.addClass(H.cancelClassName), Ft.bind("click.spectrum", function (e) {
                e.stopPropagation(), e.preventDefault(), L("cancel")
            }), Bt.attr("title", H.clearText), Bt.bind("click.spectrum", function (e) {
                e.stopPropagation(), e.preventDefault(), jt = !0, M(), V && N(!0)
            }), Pt.text(H.chooseText), Pt.addClass(H.chooseClassName), Pt.bind("click.spectrum", function (e) {
                e.stopPropagation(), e.preventDefault(), P() && (N(!0), L())
            }), Mt.text(H.showPaletteOnly ? H.togglePaletteMoreText : H.togglePaletteLessText), Mt.bind("click.spectrum", function (e) {
                e.stopPropagation(), e.preventDefault(), H.showPaletteOnly = !H.showPaletteOnly, H.showPaletteOnly || V || yt.css("left", "-=" + (wt.outerWidth(!0) + 5)), d()
            }), h(xt, function (e, t, i) {
                ct = e / nt, jt = !1, i.shiftKey && (ct = Math.round(10 * ct) / 10), M()
            }, E, A), h(kt, function (e, t) {
                st = parseFloat(t / tt), jt = !1, H.showAlpha || (ct = 1), M()
            }, E, A), h(St, function (e, t, i) {
                if (i.shiftKey) {
                    if (!ft) {
                        var n = at * Y, r = J - lt * J, o = Math.abs(e - n) > Math.abs(t - r);
                        ft = o ? "x" : "y"
                    }
                } else ft = null;
                var s = !ft || "x" === ft, a = !ft || "y" === ft;
                s && (at = parseFloat(e / Y)), a && (lt = parseFloat((J - t) / J)), jt = !1, H.showAlpha || (ct = 1), M()
            }, E, A), Wt ? (F(Wt), R(), Vt = Ht || tinycolor(Wt).format, w(Wt)) : R(), V && D();
            var n = g ? "mousedown.spectrum" : "mousedown.spectrum touchstart.spectrum";
            Lt.delegate(".sp-thumb-el", n, e), Tt.delegate(".sp-thumb-el:nth-child(1)", n, {ignore: !0}, e)
        }

        function y() {
            if (j && e.localStorage) {
                try {
                    var i = e.localStorage[j].split(",#");
                    i.length > 1 && (delete e.localStorage[j], t.each(i, function (e, t) {
                        w(t)
                    }))
                } catch (n) {
                }
                try {
                    pt = e.localStorage[j].split(";")
                } catch (n) {
                }
            }
        }

        function w(i) {
            if (q) {
                var n = tinycolor(i).toRgbString();
                if (!ut[n] && -1 === t.inArray(n, pt))for (pt.push(n); pt.length > mt;)pt.shift();
                if (j && e.localStorage)try {
                    e.localStorage[j] = pt.join(";")
                } catch (r) {
                }
            }
        }

        function S() {
            var e = [];
            if (H.showPalette)for (var t = 0; t < pt.length; t++) {
                var i = tinycolor(pt[t]).toRgbString();
                ut[i] || e.push(pt[t])
            }
            return e.reverse().slice(0, H.maxSelectionSize)
        }

        function _() {
            var e = B(), i = t.map(ht, function (t, i) {
                return n(t, e, "sp-palette-row sp-palette-row-" + i, H)
            });
            y(), pt && i.push(n(S(), e, "sp-palette-row sp-palette-row-selection", H)), Lt.html(i.join(""))
        }

        function k() {
            if (H.showInitial) {
                var e = zt, t = B();
                Tt.html(n([e, t], t, "sp-palette-row-initial", H))
            }
        }

        function E() {
            (0 >= J || 0 >= Y || 0 >= tt) && U(), yt.addClass(gt), ft = null, vt.trigger("dragstart.spectrum", [B()])
        }

        function A() {
            yt.removeClass(gt), vt.trigger("dragstop.spectrum", [B()])
        }

        function x() {
            var e = Dt.val();
            if (null !== e && "" !== e || !Kt) {
                var t = tinycolor(e);
                t.isValid() ? (F(t), N(!0)) : Dt.addClass("sp-validation-error")
            } else F(null), N(!0)
        }

        function I() {
            Z ? L() : D()
        }

        function D() {
            var i = t.Event("beforeShow.spectrum");
            return Z ? void U() : (vt.trigger(i, [B()]), void(X.beforeShow(B()) === !1 || i.isDefaultPrevented() || (r(), Z = !0, t(bt).bind("click.spectrum", L), t(e).bind("resize.spectrum", Q), Ut.addClass("sp-active"), yt.removeClass("sp-hidden"), U(), R(), zt = B(), k(), X.show(zt), vt.trigger("show.spectrum", [zt]))))
        }

        function L(i) {
            if ((!i || "click" != i.type || 2 != i.button) && Z && !V) {
                Z = !1, t(bt).unbind("click.spectrum", L), t(e).unbind("resize.spectrum", Q), Ut.removeClass("sp-active"), yt.addClass("sp-hidden");
                var n = !tinycolor.equals(B(), zt);
                n && (qt && "cancel" !== i ? N(!0) : T()), X.hide(B()), vt.trigger("hide.spectrum", [B()])
            }
        }

        function T() {
            F(zt, !0)
        }

        function F(e, t) {
            if (tinycolor.equals(e, B()))return void R();
            var i, n;
            !e && Kt ? jt = !0 : (jt = !1, i = tinycolor(e), n = i.toHsv(), st = n.h % 360 / 360, at = n.s, lt = n.v, ct = n.a), R(), i && i.isValid() && !t && (Vt = Ht || i.getFormat())
        }

        function B(e) {
            return e = e || {}, Kt && jt ? null : tinycolor.fromRatio({
                h: st,
                s: at,
                v: lt,
                a: Math.round(100 * ct) / 100
            }, {format: e.format || Vt})
        }

        function P() {
            return !Dt.hasClass("sp-validation-error")
        }

        function M() {
            R(), X.move(B()), vt.trigger("move.spectrum", [B()])
        }

        function R() {
            Dt.removeClass("sp-validation-error"), G();
            var e = tinycolor.fromRatio({h: st, s: 1, v: 1});
            St.css("background-color", e.toHexString());
            var t = Vt;
            1 > ct && (0 !== ct || "name" !== t) && ("hex" === t || "hex3" === t || "hex6" === t || "name" === t) && (t = "rgb");
            var i = B({format: t}), n = "";
            if (Ot.removeClass("sp-clear-display"), Ot.css("background-color", "transparent"), !i && Kt)Ot.addClass("sp-clear-display"); else {
                var r = i.toHexString(), o = i.toRgbString();
                if (f || 1 === i.alpha ? Ot.css("background-color", o) : (Ot.css("background-color", "transparent"), Ot.css("filter", i.toFilter())), H.showAlpha) {
                    var s = i.toRgb();
                    s.a = 0;
                    var a = tinycolor(s).toRgbString(), l = "linear-gradient(left, " + a + ", " + r + ")";
                    g ? At.css("filter", tinycolor(a).toFilter({gradientType: 1}, r)) : (At.css("background", "-webkit-" + l), At.css("background", "-moz-" + l), At.css("background", "-ms-" + l), At.css("background", "linear-gradient(to right, " + a + ", " + r + ")"))
                }
                n = i.toString(t)
            }
            H.showInput && Dt.val(n), H.showPalette && _(), k()
        }

        function G() {
            var e = at, t = lt;
            if (Kt && jt)It.hide(), Et.hide(), _t.hide(); else {
                It.show(), Et.show(), _t.show();
                var i = e * Y, n = J - t * J;
                i = Math.max(-et, Math.min(Y - et, i - et)), n = Math.max(-et, Math.min(J - et, n - et)), _t.css({
                    top: n + "px",
                    left: i + "px"
                });
                var r = ct * nt;
                It.css({left: r - rt / 2 + "px"});
                var o = st * tt;
                Et.css({top: o - ot + "px"})
            }
        }

        function N(e) {
            var t = B(), i = "", n = !tinycolor.equals(t, zt);
            t && (i = t.toString(Vt), w(t)), Rt && vt.val(i), zt = t, e && n && (X.change(t), vt.trigger("change", [t]))
        }

        function U() {
            Y = St.width(), J = St.height(), et = _t.height(), it = kt.width(), tt = kt.height(), ot = Et.height(), nt = xt.width(), rt = It.width(), V || (yt.css("position", "absolute"), yt.offset(a(yt, $t, H))), G(), H.showPalette && _(), vt.trigger("reflow.spectrum")
        }

        function $() {
            vt.show(), $t.unbind("click.spectrum touchstart.spectrum"), yt.remove(), Ut.remove(), m[Xt.id] = null
        }

        function O(e, n) {
            return e === i ? t.extend({}, H) : n === i ? H[e] : (H[e] = n, void d())
        }

        function W() {
            Ct = !1, vt.attr("disabled", !1), $t.removeClass("sp-disabled")
        }

        function z() {
            L(), Ct = !0, vt.attr("disabled", !0), $t.addClass("sp-disabled")
        }

        var H = o(l, s), V = H.flat, q = H.showSelectionPalette, j = H.localStorageKey, K = H.theme, X = H.callbacks, Q = u(U, 10), Z = !1, Y = 0, J = 0, et = 0, tt = 0, it = 0, nt = 0, rt = 0, ot = 0, st = 0, at = 0, lt = 0, ct = 1, dt = [], ht = [], ut = {}, pt = H.selectionPalette.slice(0), mt = H.maxSelectionSize, gt = "sp-dragging", ft = null, bt = s.ownerDocument, vt = (bt.body, t(s)), Ct = !1, yt = t(C, bt).addClass(K), wt = yt.find(".sp-picker-container"), St = yt.find(".sp-color"), _t = yt.find(".sp-dragger"), kt = yt.find(".sp-hue"), Et = yt.find(".sp-slider"), At = yt.find(".sp-alpha-inner"), xt = yt.find(".sp-alpha"), It = yt.find(".sp-alpha-handle"), Dt = yt.find(".sp-input"), Lt = yt.find(".sp-palette"), Tt = yt.find(".sp-initial"), Ft = yt.find(".sp-cancel"), Bt = yt.find(".sp-clear"), Pt = yt.find(".sp-choose"), Mt = yt.find(".sp-palette-toggle"), Rt = vt.is("input"), Gt = Rt && b && "color" === vt.attr("type"), Nt = Rt && !V, Ut = Nt ? t(v).addClass(K).addClass(H.className).addClass(H.replacerClassName) : t([]), $t = Nt ? Ut : vt, Ot = Ut.find(".sp-preview-inner"), Wt = H.color || Rt && vt.val(), zt = !1, Ht = H.preferredFormat, Vt = Ht, qt = !H.showButtons || H.clickoutFiresChange, jt = !Wt, Kt = H.allowEmpty && !Gt;
        p();
        var Xt = {
            show: D, hide: L, toggle: I, reflow: U, option: O, enable: W, disable: z, set: function (e) {
                F(e), N()
            }, get: B, destroy: $, container: yt, saveCurrentSelection: function () {
                w(B())
            }
        };
        return Xt.id = m.push(Xt) - 1, Xt
    }

    function a(e, i, n) {
        var r = 0, o = e.outerWidth(), s = e.outerHeight(), a = i.outerHeight(), l = i.outerWidth(), c = e[0].ownerDocument, d = c.documentElement, h = d.clientWidth + t(c).scrollLeft(), u = d.clientHeight + t(c).scrollTop(), p = i.offset();
        return p.left -= o / 2 - l / 2 - n.offsetX, p.top += a + n.offsetY, p.left -= Math.min(p.left, p.left + o > h && h > o ? Math.abs(p.left + o - h) : 0), p.top -= Math.min(p.top, p.top + s > u && u > s ? Math.abs(s + a - r) : r), p
    }

    function l() {
    }

    function c(e) {
        e.stopPropagation()
    }

    function d(e, t) {
        var i = Array.prototype.slice, n = i.call(arguments, 2);
        return function () {
            return e.apply(t, n.concat(i.call(arguments)))
        }
    }

    function h(i, n, r, o) {
        function s(e) {
            e.stopPropagation && e.stopPropagation(), e.preventDefault && e.preventDefault(), e.returnValue = !1
        }

        function a(e) {
            if (h) {
                if (g && document.documentMode < 9 && !e.button)return c();
                var t = e.originalEvent.touches, r = t ? t[0].pageX : e.pageX, o = t ? t[0].pageY : e.pageY, a = Math.max(0, Math.min(r - u.left, m)), l = Math.max(0, Math.min(o - u.top, p));
                f && s(e), n.apply(i, [a, l, e])
            }
        }

        function l(e) {
            {
                var n = e.which ? 3 == e.which : 2 == e.button;
                e.originalEvent.touches
            }
            n || h || r.apply(i, arguments) !== !1 && (h = !0, p = t(i).height(), m = t(i).width(), u = t(i).offset(), t(d).bind(b), t(d.body).addClass("sp-dragging"), f || a(e), s(e))
        }

        function c() {
            h && (t(d).unbind(b), t(d.body).removeClass("sp-dragging"), o.apply(i, arguments)), h = !1
        }

        n = n || function () {
            }, r = r || function () {
            }, o = o || function () {
            };
        var d = i.ownerDocument || document, h = !1, u = {}, p = 0, m = 0, f = "ontouchstart" in e, b = {};
        b.selectstart = s, b.dragstart = s, b["touchmove mousemove"] = a, b["touchend mouseup"] = c, t(i).bind("touchstart mousedown", l)
    }

    function u(e, t, i) {
        var n;
        return function () {
            var r = this, o = arguments, s = function () {
                n = null, e.apply(r, o)
            };
            i && clearTimeout(n), (i || !n) && (n = setTimeout(s, t))
        }
    }

    var p = {
        beforeShow: l,
        move: l,
        change: l,
        show: l,
        hide: l,
        color: !1,
        flat: !1,
        showInput: !1,
        allowEmpty: !1,
        showButtons: !0,
        clickoutFiresChange: !1,
        showInitial: !1,
        showPalette: !1,
        showPaletteOnly: !1,
        hideAfterPaletteSelect: !1,
        togglePaletteOnly: !1,
        showSelectionPalette: !0,
        localStorageKey: !1,
        appendTo: "body",
        maxSelectionSize: 7,
        cancelText: "cancel",
        cancelClassName: "",
        chooseText: "choose",
        chooseClassName: "",
        togglePaletteMoreText: "more",
        togglePaletteLessText: "less",
        clearText: "Clear Color Selection",
        noColorSelectedText: "No Color Selected",
        preferredFormat: !1,
        className: "",
        containerClassName: "",
        replacerClassName: "",
        showAlpha: !1,
        theme: "sp-light",
        palette: [["#ffffff", "#000000", "#ff0000", "#ff8000", "#ffff00", "#008000", "#0000ff", "#4b0082", "#9400d3"]],
        selectionPalette: [],
        disabled: !1,
        offsetX: 0,
        offsetY: 0
    }, m = [], g = !!/msie/i.exec(e.navigator.userAgent), f = function () {
        function e(e, t) {
            return !!~("" + e).indexOf(t)
        }

        var t = document.createElement("div"), i = t.style;
        return i.cssText = "background-color:rgba(0,0,0,.5)", e(i.backgroundColor, "rgba") || e(i.backgroundColor, "hsla")
    }(), b = function () {
        var e = t("<input type='color' value='!' />")[0];
        return "color" === e.type && "!" !== e.value
    }(), v = ["<div class='sp-replacer'>", "<div class='sp-preview'><div class='sp-preview-inner'></div></div>", "<div class='sp-dd'>&#9660;</div>", "</div>"].join(""), C = function () {
        var e = "";
        if (g)for (var t = 1; 6 >= t; t++)e += "<div class='sp-" + t + "'></div>";
        return ["<div class='sp-container sp-hidden'>", "<div class='sp-palette-container'>", "<div class='sp-palette sp-thumb sp-cf'></div>", "<div class='sp-palette-button-container sp-cf'>", "<button type='button' class='sp-palette-toggle'></button>", "</div>", "</div>", "<div class='sp-picker-container'>", "<div class='sp-top sp-cf'>", "<div class='sp-fill'></div>", "<div class='sp-top-inner'>", "<div class='sp-color'>", "<div class='sp-sat'>", "<div class='sp-val'>", "<div class='sp-dragger'></div>", "</div>", "</div>", "</div>", "<div class='sp-clear sp-clear-display'>", "</div>", "<div class='sp-hue'>", "<div class='sp-slider'></div>", e, "</div>", "</div>", "<div class='sp-alpha'><div class='sp-alpha-inner'><div class='sp-alpha-handle'></div></div></div>", "</div>", "<div class='sp-input-container sp-cf'>", "<input class='sp-input' type='text' spellcheck='false'  />", "</div>", "<div class='sp-initial sp-thumb sp-cf'></div>", "<div class='sp-button-container sp-cf'>", "<a class='sp-cancel' href='#'></a>", "<button type='button' class='sp-choose'></button>", "</div>", "</div>", "</div>"].join("")
    }(), y = "spectrum.id";
    t.fn.spectrum = function (e) {
        if ("string" == typeof e) {
            var i = this, n = Array.prototype.slice.call(arguments, 1);
            return this.each(function () {
                var r = m[t(this).data(y)];
                if (r) {
                    var o = r[e];
                    if (!o)throw new Error("Spectrum: no such method: '" + e + "'");
                    "get" == e ? i = r.get() : "container" == e ? i = r.container : "option" == e ? i = r.option.apply(r, n) : "destroy" == e ? (r.destroy(), t(this).removeData(y)) : o.apply(r, n)
                }
            }), i
        }
        return this.spectrum("destroy").each(function () {
            var i = t.extend({}, e, t(this).data()), n = s(this, i);
            t(this).data(y, n.id)
        })
    }, t.fn.spectrum.load = !0, t.fn.spectrum.loadOpts = {}, t.fn.spectrum.draggable = h, t.fn.spectrum.defaults = p, t.spectrum = {}, t.spectrum.localization = {}, t.spectrum.palettes = {}, t.fn.spectrum.processNativeColorInputs = function () {
        b || t("input[type=color]").spectrum({preferredFormat: "hex6"})
    }, function () {
        function t(e) {
            var t = {r: 0, g: 0, b: 0}, n = 1, o = !1, a = !1;
            return "string" == typeof e && (e = B(e)), "object" == typeof e && (e.hasOwnProperty("r") && e.hasOwnProperty("g") && e.hasOwnProperty("b") ? (t = i(e.r, e.g, e.b), o = !0, a = "%" === String(e.r).substr(-1) ? "prgb" : "rgb") : e.hasOwnProperty("h") && e.hasOwnProperty("s") && e.hasOwnProperty("v") ? (e.s = L(e.s), e.v = L(e.v), t = s(e.h, e.s, e.v), o = !0, a = "hsv") : e.hasOwnProperty("h") && e.hasOwnProperty("s") && e.hasOwnProperty("l") && (e.s = L(e.s), e.l = L(e.l), t = r(e.h, e.s, e.l), o = !0, a = "hsl"), e.hasOwnProperty("a") && (n = e.a)), n = _(n), {
                ok: o,
                format: e.format || a,
                r: U(255, $(t.r, 0)),
                g: U(255, $(t.g, 0)),
                b: U(255, $(t.b, 0)),
                a: n
            }
        }

        function i(e, t, i) {
            return {r: 255 * k(e, 255), g: 255 * k(t, 255), b: 255 * k(i, 255)}
        }

        function n(e, t, i) {
            e = k(e, 255), t = k(t, 255), i = k(i, 255);
            var n, r, o = $(e, t, i), s = U(e, t, i), a = (o + s) / 2;
            if (o == s)n = r = 0; else {
                var l = o - s;
                switch (r = a > .5 ? l / (2 - o - s) : l / (o + s), o) {
                    case e:
                        n = (t - i) / l + (i > t ? 6 : 0);
                        break;
                    case t:
                        n = (i - e) / l + 2;
                        break;
                    case i:
                        n = (e - t) / l + 4
                }
                n /= 6
            }
            return {h: n, s: r, l: a}
        }

        function r(e, t, i) {
            function n(e, t, i) {
                return 0 > i && (i += 1), i > 1 && (i -= 1), 1 / 6 > i ? e + 6 * (t - e) * i : .5 > i ? t : 2 / 3 > i ? e + (t - e) * (2 / 3 - i) * 6 : e
            }

            var r, o, s;
            if (e = k(e, 360), t = k(t, 100), i = k(i, 100), 0 === t)r = o = s = i; else {
                var a = .5 > i ? i * (1 + t) : i + t - i * t, l = 2 * i - a;
                r = n(l, a, e + 1 / 3), o = n(l, a, e), s = n(l, a, e - 1 / 3)
            }
            return {r: 255 * r, g: 255 * o, b: 255 * s}
        }

        function o(e, t, i) {
            e = k(e, 255), t = k(t, 255), i = k(i, 255);
            var n, r, o = $(e, t, i), s = U(e, t, i), a = o, l = o - s;
            if (r = 0 === o ? 0 : l / o, o == s)n = 0; else {
                switch (o) {
                    case e:
                        n = (t - i) / l + (i > t ? 6 : 0);
                        break;
                    case t:
                        n = (i - e) / l + 2;
                        break;
                    case i:
                        n = (e - t) / l + 4
                }
                n /= 6
            }
            return {h: n, s: r, v: a}
        }

        function s(e, t, i) {
            e = 6 * k(e, 360), t = k(t, 100), i = k(i, 100);
            var n = G.floor(e), r = e - n, o = i * (1 - t), s = i * (1 - r * t), a = i * (1 - (1 - r) * t), l = n % 6, c = [i, s, o, o, a, i][l], d = [a, i, i, s, o, o][l], h = [o, o, a, i, i, s][l];
            return {r: 255 * c, g: 255 * d, b: 255 * h}
        }

        function a(e, t, i, n) {
            var r = [D(N(e).toString(16)), D(N(t).toString(16)), D(N(i).toString(16))];
            return n && r[0].charAt(0) == r[0].charAt(1) && r[1].charAt(0) == r[1].charAt(1) && r[2].charAt(0) == r[2].charAt(1) ? r[0].charAt(0) + r[1].charAt(0) + r[2].charAt(0) : r.join("")
        }

        function l(e, t, i, n) {
            var r = [D(T(n)), D(N(e).toString(16)), D(N(t).toString(16)), D(N(i).toString(16))];
            return r.join("")
        }

        function c(e, t) {
            t = 0 === t ? 0 : t || 10;
            var i = W(e).toHsl();
            return i.s -= t / 100, i.s = E(i.s), W(i)
        }

        function d(e, t) {
            t = 0 === t ? 0 : t || 10;
            var i = W(e).toHsl();
            return i.s += t / 100, i.s = E(i.s), W(i)
        }

        function h(e) {
            return W(e).desaturate(100)
        }

        function u(e, t) {
            t = 0 === t ? 0 : t || 10;
            var i = W(e).toHsl();
            return i.l += t / 100, i.l = E(i.l), W(i)
        }

        function p(e, t) {
            t = 0 === t ? 0 : t || 10;
            var i = W(e).toRgb();
            return i.r = $(0, U(255, i.r - N(255 * -(t / 100)))), i.g = $(0, U(255, i.g - N(255 * -(t / 100)))), i.b = $(0, U(255, i.b - N(255 * -(t / 100)))), W(i)
        }

        function m(e, t) {
            t = 0 === t ? 0 : t || 10;
            var i = W(e).toHsl();
            return i.l -= t / 100, i.l = E(i.l), W(i)
        }

        function g(e, t) {
            var i = W(e).toHsl(), n = (N(i.h) + t) % 360;
            return i.h = 0 > n ? 360 + n : n, W(i)
        }

        function f(e) {
            var t = W(e).toHsl();
            return t.h = (t.h + 180) % 360, W(t)
        }

        function b(e) {
            var t = W(e).toHsl(), i = t.h;
            return [W(e), W({h: (i + 120) % 360, s: t.s, l: t.l}), W({h: (i + 240) % 360, s: t.s, l: t.l})]
        }

        function v(e) {
            var t = W(e).toHsl(), i = t.h;
            return [W(e), W({h: (i + 90) % 360, s: t.s, l: t.l}), W({
                h: (i + 180) % 360,
                s: t.s,
                l: t.l
            }), W({h: (i + 270) % 360, s: t.s, l: t.l})]
        }

        function C(e) {
            var t = W(e).toHsl(), i = t.h;
            return [W(e), W({h: (i + 72) % 360, s: t.s, l: t.l}), W({h: (i + 216) % 360, s: t.s, l: t.l})]
        }

        function y(e, t, i) {
            t = t || 6, i = i || 30;
            var n = W(e).toHsl(), r = 360 / i, o = [W(e)];
            for (n.h = (n.h - (r * t >> 1) + 720) % 360; --t;)n.h = (n.h + r) % 360, o.push(W(n));
            return o
        }

        function w(e, t) {
            t = t || 6;
            for (var i = W(e).toHsv(), n = i.h, r = i.s, o = i.v, s = [], a = 1 / t; t--;)s.push(W({
                h: n,
                s: r,
                v: o
            })), o = (o + a) % 1;
            return s
        }

        function S(e) {
            var t = {};
            for (var i in e)e.hasOwnProperty(i) && (t[e[i]] = i);
            return t
        }

        function _(e) {
            return e = parseFloat(e), (isNaN(e) || 0 > e || e > 1) && (e = 1), e
        }

        function k(e, t) {
            x(e) && (e = "100%");
            var i = I(e);
            return e = U(t, $(0, parseFloat(e))), i && (e = parseInt(e * t, 10) / 100), G.abs(e - t) < 1e-6 ? 1 : e % t / parseFloat(t)
        }

        function E(e) {
            return U(1, $(0, e))
        }

        function A(e) {
            return parseInt(e, 16)
        }

        function x(e) {
            return "string" == typeof e && -1 != e.indexOf(".") && 1 === parseFloat(e)
        }

        function I(e) {
            return "string" == typeof e && -1 != e.indexOf("%")
        }

        function D(e) {
            return 1 == e.length ? "0" + e : "" + e
        }

        function L(e) {
            return 1 >= e && (e = 100 * e + "%"), e
        }

        function T(e) {
            return Math.round(255 * parseFloat(e)).toString(16)
        }

        function F(e) {
            return A(e) / 255
        }

        function B(e) {
            e = e.replace(P, "").replace(M, "").toLowerCase();
            var t = !1;
            if (z[e])e = z[e], t = !0; else if ("transparent" == e)return {r: 0, g: 0, b: 0, a: 0, format: "name"};
            var i;
            return (i = V.rgb.exec(e)) ? {r: i[1], g: i[2], b: i[3]} : (i = V.rgba.exec(e)) ? {
                r: i[1],
                g: i[2],
                b: i[3],
                a: i[4]
            } : (i = V.hsl.exec(e)) ? {h: i[1], s: i[2], l: i[3]} : (i = V.hsla.exec(e)) ? {
                h: i[1],
                s: i[2],
                l: i[3],
                a: i[4]
            } : (i = V.hsv.exec(e)) ? {h: i[1], s: i[2], v: i[3]} : (i = V.hex8.exec(e)) ? {
                a: F(i[1]),
                r: A(i[2]),
                g: A(i[3]),
                b: A(i[4]),
                format: t ? "name" : "hex8"
            } : (i = V.hex6.exec(e)) ? {
                r: A(i[1]),
                g: A(i[2]),
                b: A(i[3]),
                format: t ? "name" : "hex"
            } : (i = V.hex3.exec(e)) ? {
                r: A(i[1] + "" + i[1]),
                g: A(i[2] + "" + i[2]),
                b: A(i[3] + "" + i[3]),
                format: t ? "name" : "hex"
            } : !1
        }

        var P = /^[\s,#]+/, M = /\s+$/, R = 0, G = Math, N = G.round, U = G.min, $ = G.max, O = G.random, W = function q(e, i) {
            if (e = e ? e : "", i = i || {}, e instanceof q)return e;
            if (!(this instanceof q))return new q(e, i);
            var n = t(e);
            this._r = n.r, this._g = n.g, this._b = n.b, this._a = n.a, this._roundA = N(100 * this._a) / 100, this._format = i.format || n.format, this._gradientType = i.gradientType, this._r < 1 && (this._r = N(this._r)), this._g < 1 && (this._g = N(this._g)), this._b < 1 && (this._b = N(this._b)), this._ok = n.ok, this._tc_id = R++
        };
        W.prototype = {
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
                var e = this.toRgb();
                return (299 * e.r + 587 * e.g + 114 * e.b) / 1e3
            }, setAlpha: function (e) {
                return this._a = _(e), this._roundA = N(100 * this._a) / 100, this
            }, toHsv: function () {
                var e = o(this._r, this._g, this._b);
                return {h: 360 * e.h, s: e.s, v: e.v, a: this._a}
            }, toHsvString: function () {
                var e = o(this._r, this._g, this._b), t = N(360 * e.h), i = N(100 * e.s), n = N(100 * e.v);
                return 1 == this._a ? "hsv(" + t + ", " + i + "%, " + n + "%)" : "hsva(" + t + ", " + i + "%, " + n + "%, " + this._roundA + ")"
            }, toHsl: function () {
                var e = n(this._r, this._g, this._b);
                return {h: 360 * e.h, s: e.s, l: e.l, a: this._a}
            }, toHslString: function () {
                var e = n(this._r, this._g, this._b), t = N(360 * e.h), i = N(100 * e.s), r = N(100 * e.l);
                return 1 == this._a ? "hsl(" + t + ", " + i + "%, " + r + "%)" : "hsla(" + t + ", " + i + "%, " + r + "%, " + this._roundA + ")"
            }, toHex: function (e) {
                return a(this._r, this._g, this._b, e)
            }, toHexString: function (e) {
                return "#" + this.toHex(e)
            }, toHex8: function () {
                return l(this._r, this._g, this._b, this._a)
            }, toHex8String: function () {
                return "#" + this.toHex8()
            }, toRgb: function () {
                return {r: N(this._r), g: N(this._g), b: N(this._b), a: this._a}
            }, toRgbString: function () {
                return 1 == this._a ? "rgb(" + N(this._r) + ", " + N(this._g) + ", " + N(this._b) + ")" : "rgba(" + N(this._r) + ", " + N(this._g) + ", " + N(this._b) + ", " + this._roundA + ")"
            }, toPercentageRgb: function () {
                return {
                    r: N(100 * k(this._r, 255)) + "%",
                    g: N(100 * k(this._g, 255)) + "%",
                    b: N(100 * k(this._b, 255)) + "%",
                    a: this._a
                }
            }, toPercentageRgbString: function () {
                return 1 == this._a ? "rgb(" + N(100 * k(this._r, 255)) + "%, " + N(100 * k(this._g, 255)) + "%, " + N(100 * k(this._b, 255)) + "%)" : "rgba(" + N(100 * k(this._r, 255)) + "%, " + N(100 * k(this._g, 255)) + "%, " + N(100 * k(this._b, 255)) + "%, " + this._roundA + ")"
            }, toName: function () {
                return 0 === this._a ? "transparent" : this._a < 1 ? !1 : H[a(this._r, this._g, this._b, !0)] || !1
            }, toFilter: function (e) {
                var t = "#" + l(this._r, this._g, this._b, this._a), i = t, n = this._gradientType ? "GradientType = 1, " : "";
                if (e) {
                    var r = W(e);
                    i = r.toHex8String()
                }
                return "progid:DXImageTransform.Microsoft.gradient(" + n + "startColorstr=" + t + ",endColorstr=" + i + ")"
            }, toString: function (e) {
                var t = !!e;
                e = e || this._format;
                var i = !1, n = this._a < 1 && this._a >= 0, r = !t && n && ("hex" === e || "hex6" === e || "hex3" === e || "name" === e);
                return r ? "name" === e && 0 === this._a ? this.toName() : this.toRgbString() : ("rgb" === e && (i = this.toRgbString()), "prgb" === e && (i = this.toPercentageRgbString()), ("hex" === e || "hex6" === e) && (i = this.toHexString()), "hex3" === e && (i = this.toHexString(!0)), "hex8" === e && (i = this.toHex8String()), "name" === e && (i = this.toName()), "hsl" === e && (i = this.toHslString()), "hsv" === e && (i = this.toHsvString()), i || this.toHexString())
            }, _applyModification: function (e, t) {
                var i = e.apply(null, [this].concat([].slice.call(t)));
                return this._r = i._r, this._g = i._g, this._b = i._b, this.setAlpha(i._a), this
            }, lighten: function () {
                return this._applyModification(u, arguments)
            }, brighten: function () {
                return this._applyModification(p, arguments)
            }, darken: function () {
                return this._applyModification(m, arguments)
            }, desaturate: function () {
                return this._applyModification(c, arguments)
            }, saturate: function () {
                return this._applyModification(d, arguments)
            }, greyscale: function () {
                return this._applyModification(h, arguments)
            }, spin: function () {
                return this._applyModification(g, arguments)
            }, _applyCombination: function (e, t) {
                return e.apply(null, [this].concat([].slice.call(t)))
            }, analogous: function () {
                return this._applyCombination(y, arguments)
            }, complement: function () {
                return this._applyCombination(f, arguments)
            }, monochromatic: function () {
                return this._applyCombination(w, arguments)
            }, splitcomplement: function () {
                return this._applyCombination(C, arguments)
            }, triad: function () {
                return this._applyCombination(b, arguments)
            }, tetrad: function () {
                return this._applyCombination(v, arguments)
            }
        }, W.fromRatio = function (e, t) {
            if ("object" == typeof e) {
                var i = {};
                for (var n in e)e.hasOwnProperty(n) && (i[n] = "a" === n ? e[n] : L(e[n]));
                e = i
            }
            return W(e, t)
        }, W.equals = function (e, t) {
            return e && t ? W(e).toRgbString() == W(t).toRgbString() : !1
        }, W.random = function () {
            return W.fromRatio({r: O(), g: O(), b: O()})
        }, W.mix = function (e, t, i) {
            i = 0 === i ? 0 : i || 50;
            var n, r = W(e).toRgb(), o = W(t).toRgb(), s = i / 100, a = 2 * s - 1, l = o.a - r.a;
            n = a * l == -1 ? a : (a + l) / (1 + a * l), n = (n + 1) / 2;
            var c = 1 - n, d = {
                r: o.r * n + r.r * c,
                g: o.g * n + r.g * c,
                b: o.b * n + r.b * c,
                a: o.a * s + r.a * (1 - s)
            };
            return W(d)
        }, W.readability = function (e, t) {
            var i = W(e), n = W(t), r = i.toRgb(), o = n.toRgb(), s = i.getBrightness(), a = n.getBrightness(), l = Math.max(r.r, o.r) - Math.min(r.r, o.r) + Math.max(r.g, o.g) - Math.min(r.g, o.g) + Math.max(r.b, o.b) - Math.min(r.b, o.b);
            return {brightness: Math.abs(s - a), color: l}
        }, W.isReadable = function (e, t) {
            var i = W.readability(e, t);
            return i.brightness > 125 && i.color > 500
        }, W.mostReadable = function (e, t) {
            for (var i = null, n = 0, r = !1, o = 0; o < t.length; o++) {
                var s = W.readability(e, t[o]), a = s.brightness > 125 && s.color > 500, l = 3 * (s.brightness / 125) + s.color / 500;
                (a && !r || a && r && l > n || !a && !r && l > n) && (r = a, n = l, i = W(t[o]))
            }
            return i
        };
        var z = W.names = {
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
        }, H = W.hexNames = S(z), V = function () {
            var e = "[-\\+]?\\d+%?", t = "[-\\+]?\\d*\\.\\d+%?", i = "(?:" + t + ")|(?:" + e + ")", n = "[\\s|\\(]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")\\s*\\)?", r = "[\\s|\\(]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")[,|\\s]+(" + i + ")\\s*\\)?";
            return {
                rgb: new RegExp("rgb" + n),
                rgba: new RegExp("rgba" + r),
                hsl: new RegExp("hsl" + n),
                hsla: new RegExp("hsla" + r),
                hsv: new RegExp("hsv" + n),
                hex3: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
                hex6: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
                hex8: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
            }
        }();
        e.tinycolor = W
    }(), t(function () {
        t.fn.spectrum.load && t.fn.spectrum.processNativeColorInputs()
    })
}(window, jQuery);