SL("editor.components.sidebar").Revisions = SL.editor.components.sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .revisions"), this.listElement = this.domElement.find(".version-list"), this.panelBody = this.domElement.find(".panel-body"), this._super()
    }, bind: function () {
        this._super(), this.onPanelScroll = this.onPanelScroll.bind(this), this.onPanelScroll = $.debounce(this.onPanelScroll, 200)
    }, reset: function () {
        this.loadedAllPages = false, this.loading = false, this.page = 1, this.listElement.empty(), this.domElement.attr("data-state", "loading")
    }, open: function () {
        this.reset(), clearTimeout(this.loadTimeout), this.loadTimeout = setTimeout(this.load.bind(this), 500), this.panelBody.on("scroll", this.onPanelScroll), this._super()
    }, close: function () {
        this._super(), clearTimeout(this.loadTimeout), this.panelBody.off("scroll", this.onPanelScroll)
    }, load: function () {
        this.loading || this.loadedAllPages || (this.loading = true, $.ajax({
            url: SL.config.AJAX_GET_DECK_VERSIONS(SLConfig.deck.id, this.page),
            data: {page: this.page},
            context: this
        }).done(function (e) {
            this.addVersions(e.results), this.layout(), 0 === e.results.length && (this.loadedAllPages = true)
        }).fail(function () {
            SL.notify(SL.locale.get("GENERIC_ERROR")), this.domElement.attr("data-state", "error"), this.layout()
        }).always(function () {
            this.loading = false, this.page += 1
        }))
    }, addVersions: function (e) {
        e.forEach(this.addVersion.bind(this)), SL.view.parseTimes(), this.listElement.find("li").length > 0 ? this.domElement.attr("data-state", "populated") : this.domElement.attr("data-state", "empty")
    }, addVersion: function (e) {
        var t = $("<li>").appendTo(this.listElement), i = $('<span class="text">').appendTo(t);
        i.append(moment(e.created_at).format("MMM DD, hh:mm a")), i.append(' <time class="ago de-em" datetime="' + e.created_at + '"></time>');
        var n = $('<div class="actions">').appendTo(t), r = $('<button class="button outline restore" data-tooltip="Restore" data-tooltip-delay="500"><span class="icon i-undo"></button>').appendTo(n);
        r.on("click", this.onRestoreClicked.bind(this, e));
        var o = $('<a class="button outline preview" data-tooltip="Preview" data-tooltip-delay="500"><span class="icon i-eye"></span></a>').appendTo(n);
        o.attr({
            href: SL.config.AJAX_PREVIEW_DECK_VERSION(SLConfig.deck.user.username, SLConfig.deck.slug || SLConfig.deck.id, e.content_uuid),
            target: "_blank"
        }), o.on("click", this.onPreviewClicked.bind(this, e, o))
    }, onPreviewClicked: function (e, t, i) {
        var n = t.attr("href"), r = SL.popup.open(SL.components.popup.Revision, {
            revisionURL: n,
            revisionTimeAgo: moment(e.created_at).fromNow()
        });
        r.restoreRequested.add(this.onRestoreClicked.bind(this, e)), r.externalRequested.add(this.onExternalClicked.bind(this, n)), i.preventDefault()
    }, onRestoreClicked: function (e, t) {
        SL.prompt({
            anchor: $(t.currentTarget),
            title: SL.locale.get("DECK_RESTORE_CONFIRM", {time: moment(e.created_at).fromNow()}),
            type: "select",
            data: [{html: "<h3>Cancel</h3>"}, {
                html: "<h3>Restore</h3>",
                selected: true,
                className: "negative",
                callback: this.onRestoreConfirmed.bind(this, e)
            }]
        }), t.preventDefault()
    }, onRestoreConfirmed: function (e) {
        SL.helpers.PageLoader.show({message: "Restoring..."}), $.ajax({
            type: "post",
            url: SL.config.AJAX_RESTORE_DECK_VERSION(SLConfig.deck.id, e.id),
            data: e,
            context: this
        }).done(function (e) {
            e && "string" == typeof e.slug ? window.location = SL.routes.DECK_EDIT(SLConfig.deck.user.username, e.slug || SLConfig.deck.id) : window.location.reload()
        }).fail(function () {
            SL.notify(SL.locale.get("GENERIC_ERROR")), this.layout(), SL.helpers.PageLoader.hide()
        })
    }, onExternalClicked: function (e, t) {
        window.open(e), t.preventDefault()
    }, onPanelScroll: function () {
        var e = this.panelBody.scrollTop(), t = this.panelBody.prop("scrollHeight"), i = this.panelBody.outerHeight(), n = e / (t - i);
        n > .8 && this.load()
    }
});
