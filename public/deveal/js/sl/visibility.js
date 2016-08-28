SL.visibility = {
    init: function () {
        this.changed = new signals.Signal;
        if ("undefined" != typeof document.hidden) {
            this.hiddenProperty = "hidden";
            this.visibilityChangeEvent = "visibilitychange";
        }
        else {
            if ("undefined" != typeof document.msHidden) {
                (this.hiddenProperty = "msHidden", this.visibilityChangeEvent = "msvisibilitychange")
            } else {
                if ("undefined" != typeof document.webkitHidden) {
                    (this.hiddenProperty = "webkitHidden", this.visibilityChangeEvent = "webkitvisibilitychange")
                }
            }
        }

        this.supported = "boolean" == typeof document[this.hiddenProperty];
        if (this.supported) {
            this.bind();
        }


    }, isVisible: function () {
        return this.supported ? !document[this.hiddenProperty] : true
    }, isHidden: function () {
        return this.supported ? document[this.hiddenProperty] : false
    }, bind: function () {
        document.addEventListener(this.visibilityChangeEvent, this.onVisibilityChange.bind(this))
    }, onVisibilityChange: function () {
        this.changed.dispatch()
    }
};