!function (t) {
    t.extend({
        debounce: function (t, e, i, n) {
            3 == arguments.length && "boolean" != typeof i && (n = i, i = !1);
            var s;
            return function () {
                var o = arguments;
                n = n || this, i && !s && t.apply(n, o), clearTimeout(s), s = setTimeout(function () {
                    i || t.apply(n, o), s = null
                }, e)
            }
        }, throttle: function (t, e, i) {
            var n, s, o;
            return function () {
                s = arguments, o = !0, i = i || this, n || function () {
                    o ? (t.apply(i, s), o = !1, n = setTimeout(arguments.callee, e)) : n = null
                }()
            }
        }
    })
}(jQuery);