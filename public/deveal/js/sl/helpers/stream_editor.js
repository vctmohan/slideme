SL("helpers").StreamEditor = Class.extend({
    init: function (t) {
        this.options = $.extend({}, t);
        this.statusChanged = new signals.Signal;
        this.reconnecting = new signals.Signal;
        this.messageReceived = new signals.Signal;
        this.debugMode = !!SL.util.getQuery().debug;
    },
    connect: function () {
        if (this.socket) {
            this.isConnected();
            this.log("manual reconnect", t);
            this.socket.io.close();
            this.socket.io.open();
        } else {
            var t = SL.config.STREAM_ENGINE_HOST + "/" + SL.config.STREAM_ENGINE_EDITOR_NAMESPACE;
            this.log("connecting to", t);
        this.socket = io.connect(t, {reconnectionDelayMax: 1e4}), this.socket.on("connect", this.onSocketConnect.bind(this)), this.socket.on("reconnect_attempt", this.onSocketReconnectAttempt.bind(this)), this.socket.on("reconnect_failed", this.onSocketReconnectFailed.bind(this)), this.socket.on("reconnect", this.onSocketReconnect.bind(this)), this.socket.on("disconnect", this.onSocketDisconnect.bind(this)), this.socket.on("message", this.onSocketMessage.bind(this))
        }
        return this.isConnected() ? Promise.resolve() : new Promise(function (t, e) {
            var i = function () {
                t(), this.socket.removeEventListener("connect", i), this.socket.removeEventListener("connect_error", n)
            }.bind(this), n = function () {
                e(), this.socket.removeEventListener("connect", i), this.socket.removeEventListener("connect_error", n)
            }.bind(this);
            this.socket.on("connect", i), this.socket.on("connect_error", n)
        }.bind(this))
    }, broadcast: function (t) {
        this.emit("broadcast", JSON.stringify(t))
    }, emit: function () {
        this.log("emit", arguments), this.socket.emit.apply(this.socket, arguments)
    }, log: function () {
        if (this.debugMode && "function" == typeof console.log.apply) {
            var t = ["Stream:"].concat(Array.prototype.slice.call(arguments));
            console.log.apply(console, t)
        }
    }, setStatus: function (t) {
        this.status !== t && (this.status = t, this.statusChanged.dispatch(this.status))
    }, isConnected: function () {
        return this.socket.connected === true
    }, onSocketMessage: function (t) {
        try {
            var e = JSON.parse(t.data)
        } catch (i) {
            this.log("unable to parse streamed socket message as JSON.")
        }
        this.log("message", e), this.messageReceived.dispatch(e)
    }, onSocketConnect: function () {
        this.log("connected"), this.emit("subscribe", {
            deck_id: this.options.deckID,
            user_id: SL.current_user.get("id"),
            slide_id: this.options.slideID
        }), this.setStatus(SL.helpers.StreamEditor.STATUS_CONNECTED)
    }, onSocketDisconnect: function () {
        this.log("disconnected"), this.setStatus(SL.helpers.StreamEditor.STATUS_DISCONNECTED)
    }, onSocketReconnectAttempt: function () {
        this.setStatus(SL.helpers.StreamEditor.STATUS_RECONNECTING), this.reconnecting.dispatch(this.socket.io.backoff.duration())
    }, onSocketReconnectFailed: function () {
        this.log("reconnect failed"), this.setStatus(SL.helpers.StreamEditor.STATUS_RECONNECT_FAILED)
    }, onSocketReconnect: function () {
        this.log("reconnected"), this.setStatus(SL.helpers.StreamEditor.STATUS_RECONNECTED)
    }
});

SL.helpers.StreamEditor.STATUS_CONNECTED = "connected";
SL.helpers.StreamEditor.STATUS_RECONNECTED = "reconnected";
SL.helpers.StreamEditor.STATUS_RECONNECT_FAILED = "reconnect_failed";
SL.helpers.StreamEditor.STATUS_DISCONNECTED = "disconnected";
SL.helpers.StreamEditor.singleton = function () {
    return this._instance || (this._instance = new SL.helpers.StreamEditor({
        deckID: SLConfig.deck.id,
        slideID: SL.util.deck.getSlideID(Reveal.getCurrentSlide())
    })), this._instance
};