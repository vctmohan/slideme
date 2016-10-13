!function (t) {
    function e(t, e, i, n, s) {
        this._listener = e, this._isOnce = i, this.context = n, this._signal = t, this._priority = s || 0
    }

    var i = {VERSION: "0.6.1"};
    e.prototype = {
        active: !0, execute: function (t) {
            var e;
            return this.active && (e = this._listener.apply(this.context, t), this._isOnce && this.detach()), e
        }, detach: function () {
            return this._signal.remove(this._listener)
        }, getListener: function () {
            return this._listener
        }, dispose: function () {
            this.detach(), this._destroy()
        }, _destroy: function () {
            delete this._signal, delete this._isOnce, delete this._listener, delete this.context
        }, isOnce: function () {
            return this._isOnce
        }, toString: function () {
            return "[SignalBinding isOnce: " + this._isOnce + ", active: " + this.active + "]"
        }
    }, i.Signal = function () {
        this._bindings = []
    }, i.Signal.prototype = {
        _shouldPropagate: !0,
        active: !0,
        _registerListener: function (t, i, n, s) {
            if ("function" != typeof t)throw new Error("listener is a required param of add() and addOnce() and should be a Function.");
            var o, a = this._indexOfListener(t);
            if (-1 !== a) {
                if (o = this._bindings[a], o.isOnce() !== i)throw new Error("You cannot add" + (i ? "" : "Once") + "() then add" + (i ? "Once" : "") + "() the same listener without removing the relationship first.")
            } else o = new e(this, t, i, n, s), this._addBinding(o);
            return o
        },
        _addBinding: function (t) {
            var e = this._bindings.length;
            do--e; while (this._bindings[e] && t._priority <= this._bindings[e]._priority);
            this._bindings.splice(e + 1, 0, t)
        },
        _indexOfListener: function (t) {
            for (var e = this._bindings.length; e--;)if (this._bindings[e]._listener === t)return e;
            return -1
        },
        add: function (t, e, i) {
            return this._registerListener(t, !1, e, i)
        },
        addOnce: function (t, e, i) {
            return this._registerListener(t, !0, e, i)
        },
        remove: function (t) {
            if ("function" != typeof t)throw new Error("listener is a required param of remove() and should be a Function.");
            var e = this._indexOfListener(t);
            return -1 !== e && (this._bindings[e]._destroy(), this._bindings.splice(e, 1)), t
        },
        removeAll: function () {
            for (var t = this._bindings.length; t--;)this._bindings[t]._destroy();
            this._bindings.length = 0
        },
        getNumListeners: function () {
            return this._bindings.length
        },
        halt: function () {
            this._shouldPropagate = !1
        },
        dispatch: function () {
            if (this.active) {
                var t = Array.prototype.slice.call(arguments), e = this._bindings.slice(), i = this._bindings.length;
                this._shouldPropagate = !0;
                do i--; while (e[i] && this._shouldPropagate && e[i].execute(t) !== !1)
            }
        },
        dispose: function () {
            this.removeAll(), delete this._bindings
        },
        toString: function () {
            return "[Signal active: " + this.active + " numListeners: " + this.getNumListeners() + "]"
        }
    }, t.signals = i
}(window || global || this);