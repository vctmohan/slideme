SL("views.decks").LiveServer = SL.views.Base.extend({
    init: function () {
        this._super(), this.strings = {
            speakerViewURL: SL.current_deck.getURL({view: "speaker"}),
            liveViewHelpURL: "http://help.slides.com/knowledgebase/articles/333924",
            speakerViewHelpURL: "http://help.slides.com/knowledgebase/articles/333923"
        }, SL.util.setupReveal({
            history: true,
            openLinksInTabs: true,
            trackEvents: true,
            showNotes: SL.current_deck.get("share_notes") && SL.current_user.settings.get("present_notes"),
            controls: SL.current_user.settings.get("present_controls"),
            progress: SL.current_user.settings.get("present_controls"),
            maxScale: SL.current_user.settings.get("present_upsizing") ? SL.config.PRESENT_UPSIZING_MAX_SCALE : 1
        }), this.stream = new SL.helpers.StreamLive({
            publisher: true,
            showErrors: false
        }), this.stream.connect(), this.render(), this.bind(), SL.helpers.PageLoader.waitForFonts()
    }, render: function () {
        this.presentationControls = $(['<div class="presentation-controls">', '<div class="presentation-controls-content">', "<h2>Presentation Controls</h2>", '<div class="presentation-controls-section">', "<h2>Speaker View</h2>", '<p>The control panel for your presentation. Includes speaker notes, an upcoming slide preview and more. It can be used as a remote control when opened from a mobile device. <a href="' + this.strings.speakerViewHelpURL + '" target="_blank">Learn more.</a></p>', '<a class="button l outline" href="' + this.strings.speakerViewURL + '" target="_blank">Open speaker view</a>', "</div>", '<div class="presentation-controls-section">', "<h2>Present Live</h2>", '<p class="live-description">Share this link with your audience to have them follow along with the presentation in real-time. <a href="' + this.strings.liveViewHelpURL + '" target="_blank">Learn more.</a></p>', '<div class="live-share"></div>', "</div>", '<div class="presentation-controls-section sl-form">', "<h2>Options</h2>", '<div class="sl-checkbox outline fullscreen-toggle">', '<input id="fullscreen-checkbox" type="checkbox">', '<label for="fullscreen-checkbox">Fullscreen</label>', "</div>", '<div class="sl-checkbox outline controls-toggle" data-tooltip="Hide the presentation control arrows and progress bar." data-tooltip-alignment="r" data-tooltip-delay="500" data-tooltip-maxwidth="250">', '<input id="controls-checkbox" type="checkbox">', '<label for="controls-checkbox">Hide controls</label>', "</div>", '<div class="sl-checkbox outline notes-toggle" data-tooltip="Hide your speaker notes from the audience." data-tooltip-alignment="r" data-tooltip-delay="500" data-tooltip-maxwidth="250">', '<input id="controls-checkbox" type="checkbox">', '<label for="controls-checkbox">Hide notes</label>', "</div>", '<div class="sl-checkbox outline upsizing-toggle" data-tooltip="Your content is automatically scaled up to fill as much of the browser window as possible. This option disables that scaling and favors the original authored at size." data-tooltip-alignment="r" data-tooltip-delay="500" data-tooltip-maxwidth="300">', '<input id="upsizing-checkbox" type="checkbox">', '<label for="upsizing-checkbox">Disable upsizing</label>', "</div>", "</div>", "</div>", '<footer class="presentation-controls-footer">', '<button class="button xl positive start-presentation">Start presentation</button>', "</footer>", "</div>"].join("")).appendTo(document.body), this.presentationControlsExpander = $(['<div class="presentation-controls-expander" data-tooltip="Show menu" data-tooltip-alignment="r">', '<span class="icon i-chevron-right"></span>', "</div>"].join("")).appendTo(document.body), $(".global-header").prependTo(this.presentationControls), this.presentationControlsScrollShadow = new SL.components.ScrollShadow({
            parentElement: this.presentationControls,
            headerElement: this.presentationControls.find(".global-header"),
            contentElement: this.presentationControls.find(".presentation-controls-content"),
            footerElement: this.presentationControls.find(".presentation-controls-footer")
        }), SL.helpers.Fullscreen.isEnabled() === false && this.presentationControls.find(".fullscreen-toggle").hide(), SL.current_deck.get("share_notes") || this.presentationControls.find(".notes-toggle").hide(), this.syncPresentationControls(), this.renderLiveShare()
    }, bind: function () {
        this.presentationControls.find(".live-view-url").on("mousedown", this.onLiveURLMouseDown.bind(this)), this.presentationControls.find(".fullscreen-toggle").on("vclick", this.onFullscreenToggled.bind(this)), this.presentationControls.find(".controls-toggle").on("vclick", this.onControlsToggled.bind(this)), this.presentationControls.find(".notes-toggle").on("vclick", this.onNotesToggled.bind(this)), this.presentationControls.find(".upsizing-toggle").on("vclick", this.onUpsizingToggled.bind(this)), this.presentationControls.find(".button.start-presentation").on("vclick", this.onStartPresentationClicked.bind(this)), this.presentationControlsExpander.on("vclick", this.onStopPresentationClicked.bind(this)), $(document).on("webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange", this.onFullscreenChange.bind(this)), $(document).on("mousemove", this.onMouseMove.bind(this)), $(document).on("mouseleave", this.onMouseLeave.bind(this))
    }, syncPresentationControls: function () {
        this.presentationControls.find(".fullscreen-toggle input").prop("checked", SL.helpers.Fullscreen.isActive()), this.presentationControls.find(".controls-toggle input").prop("checked", !SL.current_user.settings.get("present_controls")), this.presentationControls.find(".upsizing-toggle input").prop("checked", !SL.current_user.settings.get("present_upsizing")), this.presentationControls.find(".notes-toggle input").prop("checked", !SL.current_user.settings.get("present_notes"))
    }, renderLiveShare: function () {
        this.liveShareElement = this.presentationControls.find(".live-share"), SL.current_deck.isVisibilityAll() ? this.showLiveShareLink(SL.current_deck.getURL({view: "live"})) : this.showLiveShareLinkGenerator()
    }, showLiveShareLinkGenerator: function () {
        this.presentationControls.find(".live-description").html('Share a link with your audience to have them follow along with the presentation in real-time. Note that all private links you share point to the same live presentation session. <a href="' + this.strings.liveViewHelpURL + '" target="_blank">Learn more.</a>'), this.liveShareButton = $('<button class="button l outline ladda-button" data-style="zoom-out" data-spinner-color="#222">Share link</button>'), this.liveShareButton.appendTo(this.liveShareElement), this.liveShareButton.on("vclick", function () {
            "undefined" != typeof SLConfig && "string" == typeof SLConfig.deck.user.username && "string" == typeof SLConfig.deck.slug ? SL.popup.open(SL.components.decksharer.DeckSharer, {
                deck: SL.current_deck,
                deckView: "live"
            }) : SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
        }.bind(this))
    }, showLiveShareLink: function (t) {
        this.liveShareElement.html('<input class="live-view-url input-field" type="text" value="' + t + '" readonly />'), this.liveShareElement.find(".live-view-url").on("mousedown", this.onLiveURLMouseDown.bind(this))
    }, showStatus: function (t) {
        this.statusElement ? this.statusElement.find(".stream-status-message").html(t) : this.statusElement = $(['<div class="stream-status">', '<p class="stream-status-message">' + t + "</p>", "</div>"].join("")).appendTo(document.body)
    }, clearStatus: function () {
        this.statusElement && (this.statusElement.remove(), this.statusElement = null)
    }, savePresentOption: function (t) {
        this.xhrRequests = this.xhrRequests || {}, this.xhrRequests[t] && this.xhrRequests[t].abort();
        var e = {
            url: SL.config.AJAX_UPDATE_USER_SETTINGS,
            type: "PUT",
            context: this,
            data: {user_settings: {}}
        };
        e.data.user_settings[t] = SL.current_user.settings.get(t), this.xhrRequests[t] = $.ajax(e).always(function () {
            this.xhrRequests[t] = null
        })
    }, startPresentation: function () {
        $("html").addClass("presentation-started"), this.presentationStarted = true
    }, stopPresentation: function () {
        $("html").removeClass("presentation-started"), this.presentationStarted = false, this.presentationControlsExpander.removeClass("visible")
    }, hasStartedPresentation: function () {
        return !!this.presentationStarted
    }, onLiveURLMouseDown: function (t) {
        $(t.target).focus().select(), t.preventDefault()
    }, onControlsToggled: function (t) {
        t.preventDefault();
        var e = !Reveal.getConfig().controls;
        SL.current_user.settings.set("present_controls", e), Reveal.configure({
            controls: e,
            progress: e,
            slideNumber: SLConfig.deck.slide_number && e
        }), this.syncPresentationControls(), this.savePresentOption("present_controls"), this.stream.publish(null, {present_controls: e})
    }, onNotesToggled: function (t) {
        t.preventDefault();
        var e = !Reveal.getConfig().showNotes;
        SL.current_user.settings.set("present_notes", e), Reveal.configure({showNotes: e}), this.syncPresentationControls(), this.savePresentOption("present_notes"), this.stream.publish(null, {present_notes: e})
    }, onUpsizingToggled: function (t) {
        t.preventDefault();
        var e = Reveal.getConfig().maxScale <= 1;
        SL.current_user.settings.set("present_upsizing", e), Reveal.configure({maxScale: e ? SL.config.PRESENT_UPSIZING_MAX_SCALE : 1}), this.syncPresentationControls(), this.savePresentOption("present_upsizing"), this.stream.publish(null, {present_upsizing: e})
    }, onFullscreenToggled: function (t) {
        t.preventDefault(), SL.helpers.Fullscreen.toggle()
    }, onFullscreenChange: function () {
        this.syncPresentationControls(), Reveal.layout()
    }, onStartPresentationClicked: function () {
        this.startPresentation()
    }, onStopPresentationClicked: function () {
        this.stopPresentation()
    }, onMouseMove: function (t) {
        this.presentationControlsExpander.toggleClass("visible", this.hasStartedPresentation() && t.clientX < 50)
    }, onMouseLeave: function () {
        this.presentationControlsExpander.removeClass("visible")
    }
});