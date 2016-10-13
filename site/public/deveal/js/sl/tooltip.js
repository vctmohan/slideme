SL.tooltip = function () {
    function t() {
        a = $("<div>").addClass("sl-tooltip"), r = $('<p class="sl-tooltip-inner">').appendTo(a), l = $('<div class="sl-tooltip-arrow">').appendTo(a), c = $('<div class="sl-tooltip-arrow-fill">').appendTo(l), e()
    }

    function e() {
        n = n.bind(this), $(document).on("keydown, mousedown", function () {
            SL.tooltip.hide()
        }), SL.util.device.IS_PHONE || SL.util.device.IS_TABLET || ($(document.body).delegate("[data-tooltip]", "mouseenter", function (t) {
            var e = $(t.currentTarget);
            if (!e.is("[no-tooltip]")) {
                var n = e.attr("data-tooltip"), s = e.attr("data-tooltip-delay"), o = e.attr("data-tooltip-align"), a = e.attr("data-tooltip-alignment"), r = e.attr("data-tooltip-maxwidth"), l = e.attr("data-tooltip-maxheight"), c = e.attr("data-tooltip-ox"), d = e.attr("data-tooltip-oy"), h = e.attr("data-tooltip-x"), u = e.attr("data-tooltip-y");
                if (n) {
                    var p = {
                        anchor: e,
                        align: o,
                        alignment: a,
                        delay: parseInt(s, 10),
                        maxwidth: parseInt(r, 10),
                        maxheight: parseInt(l, 10)
                    };
                    c && (p.ox = parseFloat(c)), d && (p.oy = parseFloat(d)), h && u && (p.x = parseFloat(h), p.y = parseFloat(u), p.anchor = null), i(n, p)
                }
            }
        }), $(document.body).delegate("[data-tooltip]", "mouseleave", s))
    }

    function i(t, e) {
        if (!SL.util.device.IS_PHONE && !SL.util.device.IS_TABLET) {
            d = e || {}, clearTimeout(p);
            var s = Date.now() - f;
            if ("number" == typeof d.delay && s > 500)return p = setTimeout(i.bind(this, t, d), d.delay), void delete d.delay;
            a.css("opacity", 0), a.appendTo(document.body), r.html(t), a.css({
                left: 0,
                top: 0,
                "max-width": d.maxwidth ? d.maxwidth : null,
                "max-height": d.maxheight ? d.maxheight : null
            }), d.align && a.css("text-align", d.align), n(), a.stop(!0, !0).animate({opacity: 1}, {duration: 150}), $(window).on("resize scroll", n)
        }
    }

    function n() {
        var t = $(d.anchor);
        if (t.length) {
            var e = d.alignment || "auto", i = 10, n = $(window).scrollLeft(), s = $(window).scrollTop(), o = t.offset();
            o.x = o.left, o.y = o.top, d.anchor.parents(".reveal .slides").length && "undefined" != typeof window.Reveal && (o = SL.util.getRevealElementGlobalOffset(d.anchor));
            var c = t.outerWidth(), p = t.outerHeight(), f = r.outerWidth(), m = r.outerHeight(), g = o.x - $(window).scrollLeft(), v = o.y - $(window).scrollTop(), b = f / 2, S = m / 2;
            switch ("number" == typeof d.ox && (g += d.ox), "number" == typeof d.oy && (v += d.oy), "auto" === e && (e = o.y - (m + i + h) < s ? "b" : "t"), e) {
                case"t":
                    g += (c - f) / 2, v -= m + h + u;
                    break;
                case"b":
                    g += (c - f) / 2, v += p + h + u;
                    break;
                case"l":
                    g -= f + h + u, v += (p - m) / 2;
                    break;
                case"r":
                    g += c + h + u, v += (p - m) / 2
            }
            g = Math.min(Math.max(g, i), window.innerWidth - f - i), v = Math.min(Math.max(v, i), window.innerHeight - m - i);
            var E = h + 3;
            switch (e) {
                case"t":
                    b = o.x - g - n + c / 2, S = m, b = Math.min(Math.max(b, E), f - E);
                    break;
                case"b":
                    b = o.x - g - n + c / 2, S = -h, b = Math.min(Math.max(b, E), f - E);
                    break;
                case"l":
                    b = f, S = o.y - v - s + p / 2, S = Math.min(Math.max(S, E), m - E);
                    break;
                case"r":
                    b = -h, S = o.y - v - s + p / 2, S = Math.min(Math.max(S, E), m - E)
            }
            l.css({
                left: Math.round(b),
                top: Math.round(S)
            }), a.css({
                left: Math.round(g),
                top: Math.round(v)
            }).attr("data-alignment", e)
        }
    }

    function s() {
        o() && (f = Date.now()), clearTimeout(p), a.remove().stop(!0, !0), $(window).off("resize scroll", n)
    }

    function o() {
        return a.parent().length > 0
    }

    var a, r, l, c, d, h = 6, u = 4, p = -1, f = -1;
    return t(), {
        show: function (t, e) {
            i(t, e)
        }, hide: function () {
            s()
        }, anchorTo: function (t, e, i) {
            var n = {};
            "undefined" != typeof e && (n["data-tooltip"] = e), "number" == typeof i.delay && (n["data-tooltip-delay"] = i.delay), "string" == typeof i.alignment && (n["data-tooltip-alignment"] = i.alignment), $(t).attr(n)
        }
    }
}();