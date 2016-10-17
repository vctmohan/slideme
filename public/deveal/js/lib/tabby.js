!function (e) {
    function t(e, t, r) {
        var o = e.scrollTop;
        e.setSelectionRange ? i(e, t, r) : document.selection && n(e, t, r), e.scrollTop = o
    }

    function i(e, t, i) {
        var n = e.selectionStart, r = e.selectionEnd;
        if (n == r)t ? n - i.tabString == e.value.substring(n - i.tabString.length, n) ? (e.value = e.value.substring(0, n - i.tabString.length) + e.value.substring(n), e.focus(), e.setSelectionRange(n - i.tabString.length, n - i.tabString.length)) : n - i.tabString == e.value.substring(n, n + i.tabString.length) && (e.value = e.value.substring(0, n) + e.value.substring(n + i.tabString.length), e.focus(), e.setSelectionRange(n, n)) : (e.value = e.value.substring(0, n) + i.tabString + e.value.substring(n), e.focus(), e.setSelectionRange(n + i.tabString.length, n + i.tabString.length)); else {
            for (; n < e.value.length && e.value.charAt(n).match(/[ \t]/);)n++;
            var o = e.value.split("\n"), s = new Array, a = 0, l = 0;
            for (var c in o)l = a + o[c].length, s.push({
                start: a,
                end: l,
                selected: n >= a && l > n || l >= r && r > a || a > n && r > l
            }), a = l + 1;
            var d = 0;
            for (var c in s)if (s[c].selected) {
                var h = s[c].start + d;
                t && i.tabString == e.value.substring(h, h + i.tabString.length) ? (e.value = e.value.substring(0, h) + e.value.substring(h + i.tabString.length), d -= i.tabString.length) : t || (e.value = e.value.substring(0, h) + i.tabString + e.value.substring(h), d += i.tabString.length)
            }
            e.focus();
            var u = n + (d > 0 ? i.tabString.length : 0 > d ? -i.tabString.length : 0), p = r + d;
            e.setSelectionRange(u, p)
        }
    }

    function n(t, i, n) {
        var r = document.selection.createRange();
        if (t == r.parentElement())if ("" == r.text)if (i) {
            var o = r.getBookmark();
            r.moveStart("character", -n.tabString.length), n.tabString == r.text ? r.text = "" : (r.moveToBookmark(o), r.moveEnd("character", n.tabString.length), n.tabString == r.text && (r.text = "")), r.collapse(!0), r.select()
        } else r.text = n.tabString, r.collapse(!1), r.select(); else {
            var s = r.text, a = s.length, l = s.split("\r\n"), c = document.body.createTextRange();
            c.moveToElementText(t), c.setEndPoint("EndToStart", r);
            var d = c.text, h = d.split("\r\n"), u = d.length, p = document.body.createTextRange();
            p.moveToElementText(t), p.setEndPoint("StartToEnd", r);
            var m = p.text, g = document.body.createTextRange();
            g.moveToElementText(t), g.setEndPoint("StartToEnd", c);
            var f = g.text, b = e(t).html();
            e("#r3").text(u + " + " + a + " + " + m.length + " = " + b.length), u + f.length < b.length ? (h.push(""), u += 2, i && n.tabString == l[0].substring(0, n.tabString.length) ? l[0] = l[0].substring(n.tabString.length) : i || (l[0] = n.tabString + l[0])) : i && n.tabString == h[h.length - 1].substring(0, n.tabString.length) ? h[h.length - 1] = h[h.length - 1].substring(n.tabString.length) : i || (h[h.length - 1] = n.tabString + h[h.length - 1]);
            for (var v = 1; v < l.length; v++)i && n.tabString == l[v].substring(0, n.tabString.length) ? l[v] = l[v].substring(n.tabString.length) : i || (l[v] = n.tabString + l[v]);
            1 == h.length && 0 == u && (i && n.tabString == l[0].substring(0, n.tabString.length) ? l[0] = l[0].substring(n.tabString.length) : i || (l[0] = n.tabString + l[0])), u + a + m.length < b.length && (l.push(""), a += 2), c.text = h.join("\r\n"), r.text = l.join("\r\n");
            var C = document.body.createTextRange();
            C.moveToElementText(t), u > 0 ? C.setEndPoint("StartToEnd", c) : C.setEndPoint("StartToStart", c), C.setEndPoint("EndToEnd", r), C.select()
        }
    }

    e.fn.tabby = function (i) {
        var n = e.extend({}, e.fn.tabby.defaults, i), r = e.fn.tabby.pressed;
        return this.each(function () {
            $this = e(this);
            var i = e.meta ? e.extend({}, n, $this.data()) : n;
            $this.bind("keydown", function (n) {
                var o = e.fn.tabby.catch_kc(n);
                return 16 == o && (r.shft = !0), 17 == o && (r.ctrl = !0, setTimeout(function () {
                    e.fn.tabby.pressed.ctrl = !1
                }, 1e3)), 18 == o && (r.alt = !0, setTimeout(function () {
                    e.fn.tabby.pressed.alt = !1
                }, 1e3)), 9 != o || r.ctrl || r.alt ? void 0 : (n.preventDefault, r.last = o, setTimeout(function () {
                    e.fn.tabby.pressed.last = null
                }, 0), t(e(n.target).get(0), r.shft, i), !1)
            }).bind("keyup", function (t) {
                16 == e.fn.tabby.catch_kc(t) && (r.shft = !1)
            }).bind("blur", function (t) {
                9 == r.last && e(t.target).one("focus", function () {
                    r.last = null
                }).get(0).focus()
            })
        })
    }, e.fn.tabby.catch_kc = function (e) {
        return e.keyCode ? e.keyCode : e.charCode ? e.charCode : e.which
    }, e.fn.tabby.pressed = {
        shft: !1,
        ctrl: !1,
        alt: !1,
        last: null
    }, e.fn.tabby.defaults = {tabString: String.fromCharCode(9)}
}(jQuery)