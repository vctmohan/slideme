SL("views.decks").LiveClient = SL.views.Base.extend({
    init: function () {
        this._super();
        SL.util.setupReveal({
            touch: false,
            history: false,
            keyboard: false,
            controls: false,
            progress: false,
            showNotes: false,
            slideNumber: false,
            autoSlide: 0,
            openLinksInTabs: true,
            trackEvents: true
        });
        Reveal.addEventListener("ready", this.onRevealReady.bind(this));
        this.stream = new SL.helpers.StreamLive({showErrors: true});
        this.stream.ready.add(this.onStreamReady.bind(this));
        this.stream.stateChanged.add(this.onStreamStateChanged.bind(this));
        this.stream.statusChanged.add(this.onStreamStatusChanged.bind(this));
        this.render();
        this.bind();
        this.stream.connect();
    },
    render: function () {
        var t = SL.current_deck.get("user");
        e = SL.routes.DECK(t.username, SL.current_deck.get("slug"));
        i = t.thumbnail_url;
        this.summaryBubble = $(['<a class="summary-bubble hidden" href="' + e + '" target="_blank">', '<div class="summary-bubble-picture" style="background-image: url(' + i + ')"></div>', '<div class="summary-bubble-content"></div>', "</a>"].join("")).appendTo(document.body);
        this.summaryBubbleContent = this.summaryBubble.find(".summary-bubble-content");
        this.renderUserSummary();
    },
    renderUserSummary: function () {
        var t = SL.current_deck.get("user");
        this.summaryBubbleContent.html(["<h4>" + SL.current_deck.get("title") + "</h4>", "<p>By " + (t.name || t.username) + "</p>"].join(""));
    },
    renderWaitingSummary: function () {
        this.summaryBubbleContent.html(["<h4>Waiting for presenter</h4>", '<p class="retry-status"></p>'].join(""));
        this.summaryBubbleRetryStatus = this.summaryBubbleContent.find(".retry-status");
    },
    renderConnectionLostSummary: function () {
        this.summaryBubbleContent.html(["<h4>Connection lost</h4>", "<p>Attempting to reconnect</p>"].join(""));
    },
    startUpdatingTimer: function () {
        var t = function () {
            if (this.summaryBubbleRetryStatus && this.summaryBubbleRetryStatus.length) {
                var t = Date.now() - this.stream.getRetryStartTime();
                e = Math.ceil((SL.helpers.StreamLive.CONNECTION_RETRY_INTERVAL - t) / 1e3);
                this.summaryBubbleRetryStatus.text(isNaN(e) ? "Retrying" : e > 0 ? "Retrying in " + e + "s" : "Retrying now")
            }
        }.bind(this);
        clearInterval(this.updateTimerInterval);
        this.updateTimerInterval = setInterval(t, 100);
        t();
    },
    stopUpdatingTimer: function () {
        clearInterval(this.updateTimerInterval);
    },
    bind: function () {
        this.summaryBubble.on("mouseover", this.expandSummary.bind(this));
        this.summaryBubble.on("mouseout", this.collapseSummary.bind(this));
    },
    expandSummary: function (t) {
        clearTimeout(this.collapseSummaryTimeout);
        var e = window.innerWidth - (this.summaryBubbleContent.find("h4, p").offset().left + 40);
        e = Math.min(e, 400);
        this.summaryBubbleContent.find("h4, p").css("max-width", e);
        this.summaryBubble.width(this.summaryBubble.height() + this.summaryBubbleContent.outerWidth());
        if ("number" == typeof t) {
            this.collapseSummaryTimeout = setTimeout(this.collapseSummary.bind(this), t);
        }
    },
    expandSummaryError: function () {
        this.summaryBubbleError = true;
        this.expandSummary();
    },
    collapseSummary: function () {
        this.summaryBubbleError || (clearTimeout(this.collapseSummaryTimeout), this.summaryBubble.width(this.summaryBubble.height()))
    },
    setPresentControls: function (t) {
        this.summaryBubble.toggleClass("hidden", !t);
        Reveal.configure({slideNumber: SLConfig.deck.slide_number && t});
    },
    setPresentNotes: function (t) {
        Reveal.configure({showNotes: t});
    },
    setPresentUpsizing: function (t) {
        Reveal.configure({maxScale: t ? SL.config.PRESENT_UPSIZING_MAX_SCALE : 1});
    },
    onRevealReady: function () {
        this.setPresentControls(SL.current_deck.user_settings.get("present_controls"));
        this.setPresentNotes(SL.current_deck.user_settings.get("present_notes"));
        this.setPresentUpsizing(SL.current_deck.user_settings.get("present_upsizing"));
    },
    onStreamReady: function () {
        this.expandSummary(5e3);
    },
    onStreamStateChanged: function (t) {
        if (t && "boolean" == typeof t.present_controls) {
            this.setPresentControls(t.present_controls);
        }
        if (t && "boolean" == typeof t.present_notes) {
            this.setPresentNotes(t.present_notes);
        }
        if (t && "boolean" == typeof t.present_upsizing) {
            this.setPresentUpsizing(t.present_upsizing);
        }
    },
    onStreamStatusChanged: function (t) {
        if (t === SL.helpers.StreamLive.STATUS_WAITING_FOR_PUBLISHER) {
            this.renderWaitingSummary();
            this.expandSummaryError();
            this.startUpdatingTimer();
        } else {
            this.summaryBubbleError = false;
            this.renderUserSummary();
            this.stopUpdatingTimer();
        }
    }
});