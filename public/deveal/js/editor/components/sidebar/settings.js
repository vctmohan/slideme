SL("editor.components.sidebar").Settings = SL.editor.components.sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .settings");
        this.rtlToggle = this.domElement.find('.sl-checkbox input[value="rtl"]');
        this.loopToggle = this.domElement.find('.sl-checkbox input[value="should_loop"]');
        this.commentsEnabledToggle = this.domElement.find('.sl-checkbox input[value="comments_enabled"]');
        this.forkingEnabledToggle = this.domElement.find('.sl-checkbox input[value="forking_enabled"]');
        this.shareNotesToggle = this.domElement.find('.sl-checkbox input[value="share_notes"]');
        this.slideNumberToggle = this.domElement.find('.sl-checkbox input[value="slide_number"]');
        this.titleInput = this.domElement.find("#deck-input-title");
        this.descriptionInput = this.domElement.find("#deck-input-description");
        this.slug = this.domElement.find(".slug");
        this.slugInput = this.domElement.find("#deck-input-slug");
        this.slugPrefix = this.domElement.find(".slug .text-prefix");
        this.autoSlideInput = this.domElement.find("#deck-input-autoslide");
        this.renderAutoSlideOptions();
        this._super();
    }, renderAutoSlideOptions: function () {
        var e = '<option value="0">Off</option>';
        SL.config.AUTO_SLIDE_OPTIONS.forEach(function (t) {
            e += '<option value="' + 1e3 * t + '">' + t + " seconds</option>"
        }), this.autoSlideInput.html(e)
    }, bind: function () {
        this._super(), this.domElement.find(".sl-checkbox input").on("change", this.onToggleChange.bind(this)), this.titleInput.on("input", this.onTitleInput.bind(this)), this.slugInput.on("input", this.onSlugInput.bind(this)), this.slugInput.on("focus", this.onSlugFocus.bind(this)), this.slugInput.on("blur", this.onSlugBlur.bind(this)), this.descriptionInput.on("keypress", this.onDescriptionKeyPress.bind(this))
    }, open: function () {
        this._super(), this.buffer(), this.updateSelection(), this.titleInput.val(SL.util.unescapeHTMLEntities(this.config.deck.title || "")), this.slugInput.val(this.config.deck.slug), this.descriptionInput.val(SL.util.unescapeHTMLEntities(this.config.deck.description || "")), this.autoSlideInput.val(this.config.deck.auto_slide_interval || 0), this.slugPrefix.text(window.location.host + "/" + SLConfig.current_user.username + "/"), this.slugInput.css("padding-left", this.slugPrefix.position().left + this.slugPrefix.width())
    }, close: function () {
        this._super()
    }, save: function () {
        var e = this.titleInput.val(), t = this.slugInput.val(), i = this.descriptionInput.val();
        return e ? t ? (this._super(), SLConfig.deck.title = e, SLConfig.deck.description = i ? i.replace(/\n/g, " ") : "", SLConfig.deck.slug = t, SLConfig.deck.rtl = this.rtlToggle.is(":checked"), SLConfig.deck.should_loop = this.loopToggle.is(":checked"), SLConfig.deck.comments_enabled = this.commentsEnabledToggle.is(":checked"), SLConfig.deck.forking_enabled = this.forkingEnabledToggle.is(":checked"), SLConfig.deck.share_notes = this.shareNotesToggle.is(":checked"), SLConfig.deck.slide_number = this.slideNumberToggle.is(":checked"), SLConfig.deck.auto_slide_interval = parseInt(this.autoSlideInput.val(), 10) || 0, SLConfig.deck.dirty = true, $("html").toggleClass("rtl", SLConfig.deck.rtl), true) : (SL.notify(SL.locale.get("DECK_EDIT_INVALID_SLUG"), "negative"), false) : (SL.notify(SL.locale.get("DECK_EDIT_INVALID_TITLE"), "negative"), false)
    }, updateSelection: function () {
        this.rtlToggle.prop("checked", this.config.deck.rtl), this.loopToggle.prop("checked", this.config.deck.should_loop), this.commentsEnabledToggle.prop("checked", this.config.deck.comments_enabled), this.forkingEnabledToggle.prop("checked", this.config.deck.forking_enabled), this.shareNotesToggle.prop("checked", this.config.deck.share_notes), this.slideNumberToggle.prop("checked", this.config.deck.slide_number)
    }, applySelection: function () {
        Reveal.configure({
            rtl: this.rtlToggle.is(":checked"),
            loop: this.loopToggle.is(":checked"),
            slideNumber: this.slideNumberToggle.is(":checked")
        })
    }, generateSlug: function () {
        if (this.deckIsPrivate() && this.slugIsUnchanged() || this.slugWasManuallyCleared) {
            var e = this.titleInput.val(), t = SL.util.string.slug(e);
            this.slugInput.val(t)
        }
    }, deckIsPrivate: function () {
        return SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF
    }, slugIsUnchanged: function () {
        return (SLConfig.deck.slug || "") === (SL.util.string.slug(SLConfig.deck.title) || "")
    }, onToggleChange: function () {
        this.applySelection()
    }, onTitleInput: function () {
        this.generateSlug()
    }, onDescriptionKeyPress: function (e) {
        return 13 == e.keyCode ? false : void 0
    }, onSlugInput: function () {
        this.slugWasManuallyCleared = "" === this.slugInput.val()
    }, onSlugFocus: function () {
        this.deckIsPrivate() || SL.tooltip.show("Changing the URL of your deck will break existing links to it.", {
            anchor: this.slugInput,
            alignment: "r",
            maxwidth: 220
        })
    }, onSlugBlur: function () {
        SL.tooltip.hide(), this.slugInput.val(SL.util.string.slug(this.slugInput.val()))
    }
});
