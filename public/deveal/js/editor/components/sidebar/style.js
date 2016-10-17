SL("editor.components.sidebar").Style = SL.editor.components.sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .style"), this._super()
    }, bind: function () {
        this._super(), this.domElement.find(".edit-style").on("click", this.onAdvancedStylesCLicked.bind(this))
    }, scroll: function () {
        this.domElement.find(".panel-body").scrollTop(0), $(".page-wrapper").scrollTop(0)
    }, open: function () {
        this._super(), this.themeoptions ? this.themeoptions.populate(SL.models.Theme.fromDeck(SLConfig.deck)) : (this.themeoptions = new SL.components.ThemeOptions({
            center: false,
            rollingLinks: false,
            fonts: SL.config.THEME_FONTS,
            colors: SL.config.THEME_COLORS,
            themes: SL.current_user.getThemes(),
            model: SL.models.Theme.fromDeck(SLConfig.deck),
            container: this.domElement.find(".panel-body")
        }), this.themeoptions.changed.add(this.onThemeOptionsChanged.bind(this)), SL.fonts.loadAll()), this.scroll(), this.layout()
    }, close: function () {
        this._super()
    }, revert: function () {
        this._super(), SL.helpers.ThemeController.paint(SL.view.getCurrentTheme(), {center: false, js: false})
    }, save: function () {
        var e = SL.view.getCurrentTheme(), t = this.themeoptions.getTheme(), i = e.get("id") == t.get("id"), n = (e.get("js") || "") == (t.get("js") || "");
        return i || n ? (this._super(), this.saveData(), true) : (this.promptReload(), false)
    }, saveData: function () {
        var e = this.themeoptions.getTheme();
        SLConfig.deck.dirty = true, SLConfig.deck.theme_id = e.get("id"), SLConfig.deck.theme_font = e.get("font"), SLConfig.deck.theme_color = e.get("color"), SLConfig.deck.center = e.get("center"), SLConfig.deck.rolling_links = e.get("rolling_links"), SLConfig.deck.transition = e.get("transition"), SLConfig.deck.background_transition = e.get("background_transition"), Reveal.configure({
            center: false,
            rolling_links: SLConfig.deck.rolling_links,
            transition: SLConfig.deck.transition,
            backgroundTransition: SLConfig.deck.background_transition
        }), SL.editor.controllers.Thumbnail.invalidate(), SL.editor.controllers.Contrast.sync(), SL.view.onThemeChanged()
    }, promptReload: function () {
        SL.prompt({
            anchor: this.domElement.find(".save"),
            title: "The editor needs to reload to apply your changes.",
            alignment: "t",
            type: "select",
            data: [{html: "<h3>Cancel</h3>"}, {
                html: "<h3>Continue</h3>",
                className: "positive",
                callback: this.saveAndReload.bind(this)
            }]
        })
    }, saveAndReload: function () {
        this.saveData(), SL.view.save(function () {
            window.location.reload()
        }), SL.prompt({
            anchor: this.domElement.find(".save"),
            title: 'Saving and reloading...<div class="spinner centered-horizontally" data-spinner-color="#777"></div>',
            alignment: "t",
            optional: false,
            options: []
        }), SL.util.html.generateSpinners()
    }, onAdvancedStylesCLicked: function () {
        SL.editor.controllers.Mode.change("css")
    }, onThemeOptionsChanged: function () {
        this.layout(), SL.editor.controllers.Grid.refresh()
    }
});