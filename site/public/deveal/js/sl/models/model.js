SL("models").Model = Class.extend({
    init: function (t) {
        this.setData(t)
    }, setData: function (t) {
        this.data = t || {}
    }, getData: function () {
        return this.data
    }, setAll: function (t) {
        for (var e in t)this.set(e, t[e])
    }, set: function (t, e) {
        this.data[t] = e
    }, get: function (t) {
        if ("string" == typeof t && /\./.test(t)) {
            for (var e = t.split("."), i = this.data; e.length && i;)t = e.shift(), i = i[t];
            return i
        }
        return this.data[t]
    }, has: function (t) {
        var e = this.get(t);
        return !!e || e === false || 0 === e
    }, toJSON: function () {
        return JSON.parse(JSON.stringify(this.data))
    }
});