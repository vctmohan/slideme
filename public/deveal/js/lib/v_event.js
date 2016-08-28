!function (t, e, i) {
    "function" == typeof define && define.amd ? define(["jquery"], function (n) {
        return i(n, t, e), n.mobile
    }) : i(t.jQuery, t, e)
}(this, document,function (t, e, i) {
    !function (t, e, i, n) {
        function s(t) {
            for (; t && "undefined" != typeof t.originalEvent;)t = t.originalEvent;
            return t
        }

        function o(e, i) {
            var o, a, r, l, c, d, h, u, p, f = e.type;
            if (e = t.Event(e), e.type = i, o = e.originalEvent, a = t.event.props, f.search(/^(mouse|click)/) > -1 && (a = D), o)for (h = a.length, l; h;)l = a[--h], e[l] = o[l];
            if (f.search(/mouse(down|up)|click/) > -1 && !e.which && (e.which = 1), -1 !== f.search(/^touch/) && (r = s(o), f = r.touches, c = r.changedTouches, d = f && f.length ? f[0] : c && c.length ? c[0] : n))for (u = 0, p = A.length; p > u; u++)l = A[u], e[l] = d[l];
            return e
        }

        function a(e) {
            for (var i, n, s = {}; e;) {
                i = t.data(e, w);
                for (n in i)i[n] && (s[n] = s.hasVirtualBinding = !0);
                e = e.parentNode
            }
            return s
        }

        function r(e, i) {
            for (var n; e;) {
                if (n = t.data(e, w), n && (!i || n[i]))return e;
                e = e.parentNode
            }
            return null
        }

        function l() {
            U = !1
        }

        function c() {
            U = !0
        }

        function d() {
            H = 0, P.length = 0, $ = !1, c()
        }

        function h() {
            l()
        }

        function u() {
            p(), M = setTimeout(function () {
                M = 0, d()
            }, t.vmouse.resetTimerDuration)
        }

        function p() {
            M && (clearTimeout(M), M = 0)
        }

        function f(e, i, n) {
            var s;
            return (n && n[e] || !n && r(i.target, e)) && (s = o(i, e), t(i.target).trigger(s)), s
        }

        function m(e) {
            var i, n = t.data(e.target, C);
            $ || H && H === n || (i = f("v" + e.type, e), i && (i.isDefaultPrevented() && e.preventDefault(), i.isPropagationStopped() && e.stopPropagation(), i.isImmediatePropagationStopped() && e.stopImmediatePropagation()))
        }

        function g(e) {
            var i, n, o, r = s(e).touches;
            r && 1 === r.length && (i = e.target, n = a(i), n.hasVirtualBinding && (H = j++, t.data(i, C, H), p(), h(), N = !1, o = s(e).touches[0], R = o.pageX, O = o.pageY, f("vmouseover", e, n), f("vmousedown", e, n)))
        }

        function v(t) {
            U || (N || f("vmousecancel", t, a(t.target)), N = !0, u())
        }

        function b(e) {
            if (!U) {
                var i = s(e).touches[0], n = N, o = t.vmouse.moveDistanceThreshold, r = a(e.target);
                N = N || Math.abs(i.pageX - R) > o || Math.abs(i.pageY - O) > o, N && !n && f("vmousecancel", e, r), f("vmousemove", e, r), u()
            }
        }

        function S(t) {
            if (!U) {
                c();
                var e, i, n = a(t.target);
                f("vmouseup", t, n), N || (e = f("vclick", t, n), e && e.isDefaultPrevented() && (i = s(t).changedTouches[0], P.push({
                    touchID: H,
                    x: i.clientX,
                    y: i.clientY
                }), $ = !0)), f("vmouseout", t, n), N = !1, u()
            }
        }

        function E(e) {
            var i, n = t.data(e, w);
            if (n)for (i in n)if (n[i])return !0;
            return !1
        }

        function y() {
        }

        function T(e) {
            var i = e.substr(1);
            return {
                setup: function () {
                    E(this) || t.data(this, w, {});
                    var n = t.data(this, w);
                    n[e] = !0, I[e] = (I[e] || 0) + 1, 1 === I[e] && F.bind(i, m), t(this).bind(i, y), B && (I.touchstart = (I.touchstart || 0) + 1, 1 === I.touchstart && F.bind("touchstart", g).bind("touchend", S).bind("touchmove", b).bind("scroll", v))
                }, teardown: function () {
                    --I[e], I[e] || F.unbind(i, m), B && (--I.touchstart, I.touchstart || F.unbind("touchstart", g).unbind("touchmove", b).unbind("touchend", S).unbind("scroll", v));
                    var n = t(this), s = t.data(this, w);
                    s && (s[e] = !1), n.unbind(i, y), E(this) || n.removeData(w)
                }
            }
        }

        var L, _, w = "virtualMouseBindings", C = "virtualTouchID", k = "vmouseover vmousedown vmousemove vmouseup vclick vmouseout vmousecancel".split(" "), A = "clientX clientY pageX pageY screenX screenY".split(" "), x = t.event.mouseHooks ? t.event.mouseHooks.props : [], D = t.event.props.concat(x), I = {}, M = 0, R = 0, O = 0, N = !1, P = [], $ = !1, U = !1, B = "addEventListener" in i, F = t(i), j = 1, H = 0;
        for (t.vmouse = {
            moveDistanceThreshold: 10,
            clickDistanceThreshold: 10,
            resetTimerDuration: 1500
        }, _ = 0; _ < k.length; _++)t.event.special[k[_]] = T(k[_]);
        B && i.addEventListener("click", function (e) {
            var i, n, s, o, a, r, l = P.length, c = e.target;
            if (l)for (i = e.clientX, n = e.clientY, L = t.vmouse.clickDistanceThreshold, s = c; s;) {
                for (o = 0; l > o; o++)if (a = P[o], r = 0, s === c && Math.abs(a.x - i) < L && Math.abs(a.y - n) < L || t.data(s, C) === a.touchID)return e.preventDefault(), void e.stopPropagation();
                s = s.parentNode
            }
        }, !0)
    }(t, e, i)
});