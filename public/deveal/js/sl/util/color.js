SL.util.color = {
    getContrast: function (t) {
        var e = window.tinycolor(t).toRgb(), i = (299 * e.r + 587 * e.g + 114 * e.b) / 1e3;
        return i / 255
    }, getBrightness: function (t) {
        var e = window.tinycolor(t).toRgb(), i = e.r / 255 * .3 + e.g / 255 * .59 + (e.b / 255 + .11);
        return i / 2
    }, getImageColor: function (t, e) {
        return new Promise(function (i, n) {
            var s = document.createElement("img");
            s.addEventListener("load", function () {
                var t, o = document.createElement("canvas"), a = o.getContext && o.getContext("2d"), r = {
                    r: 0,
                    g: 0,
                    b: 0,
                    a: 0
                };
                a || n();
                var l = o.height = s.naturalHeight || s.offsetHeight || s.height, c = o.width = s.naturalWidth || s.offsetWidth || s.width;
                a.drawImage(s, 0, 0);
                try {
                    t = a.getImageData(0, 0, c, l)
                } catch (d) {
                    n()
                }
                var h = 4, u = t.data.length, p = 0;
                if ("number" != typeof e && (e = 8, "number" == typeof u))for (; u / e > 5e4;)e += 8;
                for (; (h += 4 * e) < u;)++p, r.r += t.data[h], r.g += t.data[h + 1], r.b += t.data[h + 2], r.a += t.data[h + 3];
                r.r = ~~(r.r / p), r.g = ~~(r.g / p), r.b = ~~(r.b / p), r.a = ~~(r.a / p), r.a = r.a / 255, i(r)
            }), s.addEventListener("error", function () {
                n()
            }), s.setAttribute("crossorigin", "anonymous"), s.setAttribute("src", t)
        })
    }
};