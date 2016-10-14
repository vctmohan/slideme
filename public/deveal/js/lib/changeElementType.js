!function (t) {
    t.fn.changeElementType = function (e) {
        this.each(function (i, n) {
            var s = {};
            t.each(n.attributes, function (t, e) {
                s[e.nodeName] = e.nodeValue
            });
            var o = t("<" + e + "/>", s).append(t(n).contents());
            return t(n).replaceWith(o), o
        })
    }
}(jQuery);