SL.util.trig = {
    distanceBetween: function (t, e) {
        var i = t.x - e.x, n = t.y - e.y;
        return Math.sqrt(i * i + n * n)
    }, intersection: function (t, e) {
        return {
            width: Math.max(0, Math.min(t.x + t.width, e.x + e.width) - Math.max(t.x, e.x)),
            height: Math.max(0, Math.min(t.y + t.height, e.y + e.height) - Math.max(t.y, e.y))
        }
    }, intersects: function (t, e, i) {
        "undefined" == typeof i && (i = 0);
        var n = SL.util.trig.intersection(t, e);
        return n.width > t.width * i && n.height > t.height * i
    }, isPointWithinRect: function (t, e, i) {
        return t > i.x && t < i.x + i.width && e > i.y && e < i.y + i.height
    }, findLineIntersection: function (t, e, i, n) {
        var s = {x: e.x - t.x, y: e.y - t.y}, o = {
            x: n.x - i.x,
            y: n.y - i.y
        }, a = (-s.y * (t.x - i.x) + s.x * (t.y - i.y)) / (-o.x * s.y + s.x * o.y), r = (o.x * (t.y - i.y) - o.y * (t.x - i.x)) / (-o.x * s.y + s.x * o.y);
        return a >= 0 && 1 >= a && r >= 0 && 1 >= r ? {
            x: t.x + r * s.x,
            y: t.y + r * s.y
        } : null
    }
};