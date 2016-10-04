SL("helpers").StreamLive = Class.extend({
    init: function (t) {
        this.options = $.extend({
            reveal: window.Reveal,
            showErrors: true,
            subscriber: true,
            publisher: false,
            publisherID: Date.now() + "-" + Math.round(1000000 * Math.random()),
            deckID: SL.current_deck.get("id")
        }, t);

        this.ready = new signals.Signal;
        this.stateChanged = new signals.Signal;
        this.statusChanged = new signals.Signal;
        this.subscribersChanged = new signals.Signal;
        this.socketIsDisconnected = false;
        this.debugMode = !!SL.util.getQuery().debug;
    },
    connect: function () {
        if (this.options.publisher) {
            this.setupPublisher();
        } else {
            this.setupSubscriber();
        }
    },
    setupPublisher: function () {
        this.publish = this.publish.bind(this);
        this.publishable = true;
        this.options.reveal.addEventListener("slidechanged", this.publish);
        this.options.reveal.addEventListener("fragmentshown", this.publish);
        this.options.reveal.addEventListener("fragmenthidden", this.publish);
        this.options.reveal.addEventListener("overviewshown", this.publish);
        this.options.reveal.addEventListener("overviewhidden", this.publish);
        this.options.reveal.addEventListener("paused", this.publish);
        this.options.reveal.addEventListener("resumed", this.publish);

        $.ajax({
            url: "/api/v1/decks/" + this.options.deckID + "/stream.json",
            type: "GET",
            context: this
        }).done(function (t) {
            this.log("found existing stream");
            this.setState(JSON.parse(t.state), true);
            this.setupSocket();
            this.ready.dispatch();
        }).error(function () {
            this.log("no existing stream, publishing state");
            this.publish(function () {
                this.setupSocket();
                this.ready.dispatch();
            }.bind(this));
        })
    },
    setupSubscriber: function () {
        $.ajax({
            url: "/api/v1/decks/" + this.options.deckID + "/stream.json",
            type: "GET",
            context: this
        }).done(function (t) {
            this.log("found existing stream");
            this.setStatus(SL.helpers.StreamLive.STATUS_NONE);
            this.setState(JSON.parse(t.state), true);
            this.setupSocket();
            this.ready.dispatch();
        }).error(function () {
            this.retryStartTime = Date.now();
            this.setStatus(SL.helpers.StreamLive.STATUS_WAITING_FOR_PUBLISHER);
            this.log("no existing stream, retrying in " + SL.helpers.StreamLive.CONNECTION_RETRY_INTERVAL / 1000 + "s");
            setTimeout(this.setupSubscriber.bind(this), SL.helpers.StreamLive.CONNECTION_RETRY_INTERVAL);
        })
    },
    setupSocket: function () {
        if (this.options.subscriber) {
            var host = SL.config.STREAM_ENGINE_HOST; //+ "/" + SL.config.STREAM_ENGINE_LIVE_NAMESPACE;
            this.log("socket attempting to connect to", host);
            this.socket = io.connect(host, {reconnectionDelayMax: 10000});
            this.socket.on("connect", this.onSocketConnected.bind(this));
            this.socket.on("connect_error", this.onSocketDisconnected.bind(this));
            this.socket.on("disconnect", this.onSocketDisconnected.bind(this));
            this.socket.on("reconnect_attempt", this.onSocketReconnectAttempt.bind(this));
            this.socket.on("reconnect_failed", this.onSocketReconnectFailed.bind(this));
            this.socket.on("message", this.onSocketStateMessage.bind(this));
            this.socket.on("subscribers", this.onSocketSubscribersMessage.bind(this));
        }
    },
    publish: function (t, e) {
        if (this.publishable) {
            var state = this.options.reveal.getState();
            state.publisher_id = this.options.publisherID;
            console.log(this.socketIsDisconnected)
            state = $.extend(state, e);
            if (this.socketIsDisconnected === true) {
                return this.publishAfterReconnect = true;
            }
            this.log("publish stalled while disconnected");

            this.log("publish", state.publisher_id), $.ajax({
                url: "/api/v1/decks/" + this.options.deckID + "/stream.json",
                type: "PUT",
                data: {state: JSON.stringify(state)},
                success: t
            });
        }
    },
    log: function () {
        if (this.debugMode && "function" == typeof console.log.apply) {
            var t = "Stream (" + (this.options.publisher ? "publisher" : "subscriber") + "):";
            e = [t].concat(Array.prototype.slice.call(arguments));
            console.log.apply(console, e);
        }
    },
    setState: function (state, e) {
        this.publishable = false;
        if (e) {
            $(".reveal").addClass("no-transition");
        }
        this.options.reveal.setState(state);
        this.stateChanged.dispatch(state);
        setTimeout(function () {
            this.publishable = true;
            if (e) {
                $(".reveal").removeClass("no-transition");
            }
        }.bind(this), 1);
    },
    setStatus: function (status) {
        if (this.status !== status) {
            this.status = status;
            this.statusChanged.dispatch(this.status);
        }
    },
    getRetryStartTime: function () {
        return this.retryStartTime;
    },
    isPublisher: function () {
        return this.options.publisher;
    },
    showConnectionError: function () {
        this.disconnectTimeout = setTimeout(function () {
            this.connectionError || (this.connectionError = new SL.components.RetryNotification("Lost connection to server"), this.connectionError.startCountdown(0), this.connectionError.destroyed.add(function () {
                this.connectionError = null
            }.bind(this)), this.connectionError.retryClicked.add(function () {
                this.connectionError.startCountdown(0), this.socket.io.close(), this.socket.io.open()
            }.bind(this)))
        }.bind(this), 10000)
    },
    hideConnectionError: function () {
        clearTimeout(this.disconnectTimeout);
        if (this.connectionError) {
            this.connectionError.hide();
        }
    },
    onSocketStateMessage: function (t) {
        try {
            var state = JSON.parse(t.data);
            if (state.publisher_id != this.options.publisherID) {
                this.log("sync", "from: " + state.publisher_id, "to: " + this.options.publisherID);
                this.setState(state);
            }
        } catch (i) {
            this.log("unable to parse streamed deck state as JSON.");
        }
        this.setStatus(SL.helpers.StreamLive.STATUS_NONE)
    },
    onSocketSubscribersMessage: function (t) {
        this.subscribersChanged.dispatch(t.subscribers);
    },
    onSocketConnected: function () {
        this.log("socket connected");
        this.socket.emit("subscribe", {
            deck_id: this.options.deckID,
            publisher: this.options.publisher
        });
        if (this.socketIsDisconnected === true) {
            this.socketIsDisconnected = false;
            this.log("socket connection regained");
            this.setStatus(SL.helpers.StreamLive.STATUS_NONE);
            if (this.publishAfterReconnect === true) {
                this.publishAfterReconnect = false;
                this.log("publishing stalled state");
                this.publish();
            }
        }
        this.hideConnectionError();
    },
    onSocketReconnectAttempt: function () {
        if (this.connectionError) {
            this.connectionError.startCountdown(this.socket.io.backoff.duration());
        }
    },
    onSocketReconnectFailed: function () {
        if (this.connectionError) {
            this.connectionError.disableCountdown();
        }
    },
    onSocketDisconnected: function () {
        if (this.socketIsDisconnected === false) {
            this.socketIsDisconnected = true;
            this.log("socket connection lost");
            this.setStatus(SL.helpers.StreamLive.STATUS_CONNECTION_LOST);
            if (this.options.showErrors) {
                this.showConnectionError();
            }
        }
    }
});

SL.helpers.StreamLive.CONNECTION_RETRY_INTERVAL = 20000;
SL.helpers.StreamLive.STATUS_NONE = "";
SL.helpers.StreamLive.STATUS_CONNECTION_LOST = "connection_lost";
SL.helpers.StreamLive.STATUS_WAITING_FOR_PUBLISHER = "waiting_for_publisher";
