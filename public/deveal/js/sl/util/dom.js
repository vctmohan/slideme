SL.util.dom = {
    scrollIntoViewIfNeeded: function (t) {
        t && ("function" == typeof t.scrollIntoViewIfNeeded ? t.scrollIntoViewIfNeeded.apply(t, [].slice.call(arguments, 1)) : "function" == typeof t.scrollIntoView && t.scrollIntoView())
    },
    preventTouchOverflowScrolling: function (t) {
        t = $(t);
        var e, i, n;
        t.get(0).addEventListener("touchstart", function (t) {
            e = this.scrollTop > 0, i = this.scrollTop < this.scrollHeight - this.clientHeight, n = t.pageY
        }), t.get(0).addEventListener("touchmove", function (t) {
            var s = t.pageY > n, o = !s;
            n = t.pageY, s && e || o && i ? t.stopPropagation() : t.preventDefault()
        })
    },
    insertCSRF: function (t, e) {
        "undefined" == typeof e && (e = $('meta[name="csrf-token"]').attr("content")), e && (t.find('input[name="authenticity_token"]').remove(), t.append('<input name="authenticity_token" type="hidden" value="' + e + '" />'))
    },
    calculateStyle: function (t) {
        window.getComputedStyle($(t).get(0)).opacity
    }
};