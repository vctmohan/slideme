!function () {
    var t = !1, e = /xyz/.test(function () {
    }) ? /\b_super\b/ : /.*/;
    this.Class = function () {
    },

        Class.extend = function (i) {
            function n() {
                !t && this.init && this.init.apply(this, arguments)
            }

            var s = this.prototype;
            t = !0;
            var o = new this;
            t = !1;
            for (var a in i)o[a] = "function" == typeof i[a] && "function" == typeof s[a] && e.test(i[a]) ? function (t, e) {
                return function () {
                    var i = this._super;
                    this._super = s[t];
                    var n = e.apply(this, arguments);
                    return this._super = i, n
                }
            }(a, i[a]) : i[a];
            return n.prototype = o, n.constructor = n, n.extend = arguments.callee, n
        }
}()