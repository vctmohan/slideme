!function (t, e) {
    "object" == typeof exports ? module.exports = e() : "function" == typeof define && define.amd ? define(e) : t.Spinner = e()
}(this, function () {
    "use strict";
    function t(t, e) {
        var i, n = document.createElement(t || "div");
        for (i in e)n[i] = e[i];
        return n
    }

    function e(t) {
        for (var e = 1, i = arguments.length; i > e; e++)t.appendChild(arguments[e]);
        return t
    }

    function i(t, e, i, n) {
        var s = ["opacity", e, ~~(100 * t), i, n].join("-"), o = .01 + i / n * 100, a = Math.max(1 - (1 - t) / e * (100 - o), t), r = c.substring(0, c.indexOf("Animation")).toLowerCase(), l = r && "-" + r + "-" || "";
        return h[s] || (u.insertRule("@" + l + "keyframes " + s + "{0%{opacity:" + a + "}" + o + "%{opacity:" + t + "}" + (o + .01) + "%{opacity:1}" + (o + e) % 100 + "%{opacity:" + t + "}100%{opacity:" + a + "}}", u.cssRules.length), h[s] = 1), s
    }

    function n(t, e) {
        var i, n, s = t.style;
        if (void 0 !== s[e])return e;
        for (e = e.charAt(0).toUpperCase() + e.slice(1), n = 0; n < d.length; n++)if (i = d[n] + e, void 0 !== s[i])return i
    }

    function s(t, e) {
        for (var i in e)t.style[n(t, i) || i] = e[i];
        return t
    }

    function o(t) {
        for (var e = 1; e < arguments.length; e++) {
            var i = arguments[e];
            for (var n in i)void 0 === t[n] && (t[n] = i[n])
        }
        return t
    }

    function a(t) {
        for (var e = {
            x: t.offsetLeft,
            y: t.offsetTop
        }; t = t.offsetParent;)e.x += t.offsetLeft, e.y += t.offsetTop;
        return e
    }

    function r(t) {
        return "undefined" == typeof this ? new r(t) : void(this.opts = o(t || {}, r.defaults, p))
    }

    function l() {
        function i(e, i) {
            return t("<" + e + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', i)
        }

        u.addRule(".spin-vml", "behavior:url(#default#VML)"), r.prototype.lines = function (t, n) {
            function o() {
                return s(i("group", {
                    coordsize: c + " " + c,
                    coordorigin: -l + " " + -l
                }), {width: c, height: c})
            }

            function a(t, a, r) {
                e(h, e(s(o(), {
                    rotation: 360 / n.lines * t + "deg",
                    left: ~~a
                }), e(s(i("roundrect", {arcsize: n.corners}), {
                    width: l,
                    height: n.width,
                    left: n.radius,
                    top: -n.width >> 1,
                    filter: r
                }), i("fill", {
                    color: n.color,
                    opacity: n.opacity
                }), i("stroke", {opacity: 0}))))
            }

            var r, l = n.length + n.width, c = 2 * l, d = 2 * -(n.width + n.length) + "px", h = s(o(), {
                position: "absolute",
                top: d,
                left: d
            });
            if (n.shadow)for (r = 1; r <= n.lines; r++)a(r, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
            for (r = 1; r <= n.lines; r++)a(r);
            return e(t, h)
        }, r.prototype.opacity = function (t, e, i, n) {
            var s = t.firstChild;
            n = n.shadow && n.lines || 0, s && e + n < s.childNodes.length && (s = s.childNodes[e + n], s = s && s.firstChild, s = s && s.firstChild, s && (s.opacity = i))
        }
    }

    var c, d = ["webkit", "Moz", "ms", "O"], h = {}, u = function () {
        var i = t("style", {type: "text/css"});
        return e(document.getElementsByTagName("head")[0], i), i.sheet || i.styleSheet
    }(), p = {
        lines: 12,
        length: 7,
        width: 5,
        radius: 10,
        rotate: 0,
        corners: 1,
        color: "#000",
        direction: 1,
        speed: 1,
        trail: 100,
        opacity: .25,
        fps: 20,
        zIndex: 2e9,
        className: "spinner",
        top: "auto",
        left: "auto",
        position: "relative"
    };
    r.defaults = {}, o(r.prototype, {
        spin: function (e) {
            this.stop();
            var i, n, o = this, r = o.opts, l = o.el = s(t(0, {className: r.className}), {
                position: r.position,
                width: 0,
                zIndex: r.zIndex
            }), d = r.radius + r.length + r.width;
            if (e && (e.insertBefore(l, e.firstChild || null), n = a(e), i = a(l), s(l, {
                    left: ("auto" == r.left ? n.x - i.x + (e.offsetWidth >> 1) : parseInt(r.left, 10) + d) + "px",
                    top: ("auto" == r.top ? n.y - i.y + (e.offsetHeight >> 1) : parseInt(r.top, 10) + d) + "px"
                })), l.setAttribute("role", "progressbar"), o.lines(l, o.opts), !c) {
                var h, u = 0, p = (r.lines - 1) * (1 - r.direction) / 2, f = r.fps, m = f / r.speed, g = (1 - r.opacity) / (m * r.trail / 100), v = m / r.lines;
                !function b() {
                    u++;
                    for (var t = 0; t < r.lines; t++)h = Math.max(1 - (u + (r.lines - t) * v) % m * g, r.opacity), o.opacity(l, t * r.direction + p, h, r);
                    o.timeout = o.el && setTimeout(b, ~~(1e3 / f))
                }()
            }
            return o
        }, stop: function () {
            var t = this.el;
            return t && (clearTimeout(this.timeout), t.parentNode && t.parentNode.removeChild(t), this.el = void 0), this
        }, lines: function (n, o) {
            function a(e, i) {
                return s(t(), {
                    position: "absolute",
                    width: o.length + o.width + "px",
                    height: o.width + "px",
                    background: e,
                    boxShadow: i,
                    transformOrigin: "left",
                    transform: "rotate(" + ~~(360 / o.lines * l + o.rotate) + "deg) translate(" + o.radius + "px,0)",
                    borderRadius: (o.corners * o.width >> 1) + "px"
                })
            }

            for (var r, l = 0, d = (o.lines - 1) * (1 - o.direction) / 2; l < o.lines; l++)r = s(t(), {
                position: "absolute",
                top: 1 + ~(o.width / 2) + "px",
                transform: o.hwaccel ? "translate3d(0,0,0)" : "",
                opacity: o.opacity,
                animation: c && i(o.opacity, o.trail, d + l * o.direction, o.lines) + " " + 1 / o.speed + "s linear infinite"
            }), o.shadow && e(r, s(a("#000", "0 0 4px #000"), {top: "2px"})), e(n, e(r, a(o.color, "0 0 1px rgba(0,0,0,.1)")));
            return n
        }, opacity: function (t, e, i) {
            e < t.childNodes.length && (t.childNodes[e].style.opacity = i)
        }
    });
    var f = s(t("group"), {behavior: "url(#default#VML)"});
    return !n(f, "transform") && f.adj ? l() : c = n(f, "animation"), r
});