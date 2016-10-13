!function (e) {
    var t;
    return e.event.fix = function (e) {
        return function (t) {
            return t = e.apply(this, arguments), (0 === t.type.indexOf("copy") || 0 === t.type.indexOf("paste")) && (t.clipboardData = t.originalEvent.clipboardData), t
        }
    }(e.event.fix), t = {callback: e.noop, matchType: /image.*/}, e.fn.pasteImageReader = function (i) {
        return "function" == typeof i && (i = {callback: i}), i = e.extend({}, t, i), this.each(function () {
            var t, n;
            return n = this, t = e(this), t.bind("paste", function (e) {
                var t, r;
                return r = !1, t = e.clipboardData, Array.prototype.forEach.call(t.types, function (e, o) {
                    var s, a;
                    if (!r)return t.items && (e.match(i.matchType) || t.items[o].type.match(i.matchType)) ? (s = t.items[o].getAsFile(), a = new FileReader, a.onload = function (e) {
                        return i.callback.call(n, {dataURL: e.target.result, event: e, file: s, name: s.name})
                    }, a.readAsDataURL(s), r = !0) : void 0
                })
            })
        })
    }
}(jQuery);