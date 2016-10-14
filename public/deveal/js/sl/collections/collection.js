SL("collections").Collection = Class.extend({
    init: function (t, e, i) {
        this.factory = e;
        this.crud = i || {};
        this.changed = new signals.Signal;
        this.replaced = new signals.Signal;
        this.setData(t);
    },
    setData: function (t) {
        var e = !!this.data && "undefined" != typeof this.data;
        if (this.data = t || [], "function" == typeof this.factory) {
            var i = this.data;
            this.data = [];
            for (var n = 0, s = i.length; s > n; n++) {
                var o = i[n];
                this.data.push(o instanceof this.factory ? i[n] : this.createModelInstance(i[n]))
            }
        }
        e && this.replaced.dispatch()
    }, appendData: function (t) {
        var e = this.size();
        return this.setData(this.data.concat(t)), this.data.slice(e)
    }, prependData: function (t) {
        var e = this.size();
        return this.setData(t.concat(this.data)), this.data.slice(0, e)
    }, find: function (t) {
        for (var e = 0, i = this.data.length; i > e; e++) {
            var n = this.data[e];
            if (n === t)return e
        }
        return -1
    }, contains: function (t) {
        return -1 !== this.find(t)
    }, findByProperties: function (t) {
        for (var e = 0, i = this.data.length; i > e; e++) {
            var n = this.data[e], s = true;
            for (var o in t)t.hasOwnProperty(o) && ("function" == typeof n.get ? n.get(o) != t[o] && (s = false) : n[o] != t[o] && (s = false));
            if (s)return e
        }
        return -1
    }, getByProperties: function (t) {
        return this.data[this.findByProperties(t)]
    }, getByID: function (t) {
        return this.getByProperties({id: t})
    }, remove: function (t) {
        for (var e, i = 0; i < this.data.length; i++)this.data[i] === t && (e = this.data.splice(i, 1)[0], i--);
        "undefined" != typeof e && this.changed.dispatch(null, [e])
    }, removeByProperties: function (t) {
        for (var e, i = this.findByProperties(t), n = 0; -1 !== i && n++ < 1e3;)e = this.data.splice(i, 1)[0], i = this.findByProperties(t);
        "undefined" != typeof e && this.changed.dispatch(null, [e])
    }, removeByIndex: function (t) {
        var e = this.data.splice(t, 1);
        return "undefined" != typeof e && this.changed.dispatch(null, [e]), e
    }, create: function (t, e) {
        return new Promise(function (i, n) {
            "function" == typeof this.factory ? this.crud.create ? $.ajax({
                type: "POST",
                context: this,
                url: e && e.url ? e.url : this.crud.create,
                data: t
            }).done(function (t) {
                e && e.model ? (e.model.setData(t), i(e.model)) : e && e.createModel === false ? i() : i(this.createModel(t, e))
            }).fail(function () {
                n()
            }) : i(this.createModel(t, e)) : n()
        }.bind(this))
    }, createModel: function (t, e) {
        if (e = $.extend({prepend: false}, e), "function" == typeof this.factory) {
            var i = this.createModelInstance(t);
            return e.prepend ? this.unshift(i) : this.push(i), i
        }
    }, createModelInstance: function (t, e) {
        return new this.factory(t, e)
    }, clear: function () {
        this.data.length = 0, this.changed.dispatch()
    }, swap: function (t, e) {
        var i = "number" == typeof t && t >= 0 && t < this.size(), n = "number" == typeof e && e >= 0 && e < this.size();
        if (i && n) {
            var s = this.data[t], o = this.data[e];
            this.data[t] = o, this.data[e] = s
        }
        this.changed.dispatch()
    }, shiftLeft: function (t) {
        "number" == typeof t && t > 0 && this.swap(t, t - 1)
    }, shiftRight: function (t) {
        "number" == typeof t && t < this.size() - 1 && this.swap(t, t + 1)
    }, at: function (t) {
        return this.data[t]
    }, first: function () {
        return this.at(0)
    }, last: function () {
        return this.at(this.size() - 1)
    }, size: function () {
        return this.data.length
    }, isEmpty: function () {
        return 0 === this.size()
    }, getUniqueName: function (t, e, i) {
        for (var n = -1, s = 0, o = this.data.length; o > s; s++) {
            var a = this.data[s], r = "function" == typeof a.get ? a.get(e) : a[e];
            if (r) {
                var l = r.match(new RegExp("^" + t + "\\s?(\\d+)?$"));
                l && 2 === l.length && (n = Math.max(l[1] ? parseInt(l[1], 10) : 0, n))
            }
        }
        return -1 === n ? t + (i ? " 1" : "") : t + " " + (n + 1)
    }, toJSON: function () {
        return this.map(function (t) {
            return "function" == typeof t.toJSON ? t.toJSON() : t
        })
    }, destroy: function () {
        this.changed.dispose(), this.data = null
    }, unshift: function (t) {
        var e = this.data.unshift(t);
        return this.changed.dispatch(t), e
    }, push: function (t) {
        var e = this.data.push(t);
        return this.changed.dispatch([t]), e
    }, pop: function () {
        var t = this.data.pop();
        return "undefined" != typeof t && this.changed.dispatch(null, [t]), t
    }, map: function (t, e) {
        return this.data.map(t, e)
    }, some: function (t, e) {
        return this.data.some(t, e)
    }, filter: function (t, e) {
        return this.data.filter(t, e)
    }, forEach: function (t, e) {
        return this.data.forEach(t, e)
    }
});