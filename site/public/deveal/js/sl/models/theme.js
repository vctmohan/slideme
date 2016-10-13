SL("models").Theme = SL.models.Model.extend({
    init: function (t) {
        this._super(t), this.formatData(), this.loading = false
    }, load: function (t) {
        return this.loading = true, t = "string" == typeof t ? t : SL.config.AJAX_THEMES_READ(this.get("id")), $.ajax({
            type: "GET",
            url: t,
            context: this
        }).done(function (t) {
            $.extend(this.data, t), this.formatData()
        }).always(function () {
            this.loading = false
        })
    }, formatData: function () {
        this.has("name") || this.set("name", "Untitled"), this.has("font") || this.set("font", SL.config.DEFAULT_THEME_FONT), this.has("color") || this.set("color", SL.config.DEFAULT_THEME_COLOR), this.has("transition") || this.set("transition", SL.config.DEFAULT_THEME_TRANSITION), this.has("background_transition") || this.set("background_transition", SL.config.DEFAULT_THEME_BACKGROUND_TRANSITION), this.data.slide_template_ids instanceof SL.collections.Collection || this.set("slide_template_ids", new SL.collections.Collection(this.data.slide_template_ids)), this.data.snippets instanceof SL.collections.Collection || ("string" == typeof this.data.snippets && this.data.snippets.length > 0 && (this.data.snippets = JSON.parse(this.data.snippets)), this.set("snippets", new SL.collections.Collection(this.data.snippets, SL.models.ThemeSnippet))), this.data.palette instanceof Array || ("string" == typeof this.data.palette && this.data.palette.length > 0 ? (this.data.palette = this.data.palette.split(","), this.data.palette = this.data.palette.map(function (t) {
            return t.trim()
        })) : this.data.palette = [])
    }, hasSlideTemplate: function (t) {
        return this.get("slide_template_ids").contains(t)
    }, addSlideTemplate: function (t) {
        var e = this.get("slide_template_ids");
        return t.forEach(function (t) {
            e.contains(t) || e.push(t)
        }), $.ajax({
            type: "POST",
            url: SL.config.AJAX_THEME_ADD_SLIDE_TEMPLATE(this.get("id")),
            context: this,
            data: {slide_template_ids: t}
        })
    }, removeSlideTemplate: function (t) {
        var e = this.get("slide_template_ids");
        return t.forEach(function (t) {
            e.remove(t)
        }), $.ajax({
            type: "DELETE",
            url: SL.config.AJAX_THEME_REMOVE_SLIDE_TEMPLATE(this.get("id")),
            context: this,
            data: {slide_template_ids: t}
        })
    }, hasThumbnail: function () {
        return !!this.get("thumbnail_url")
    }, hasJavaScript: function () {
        return !!this.get("js")
    }, hasPalette: function () {
        return this.get("palette").length > 0
    }, isFontDeprecated: function () {
        var t = this.get("font");
        return SL.config.THEME_FONTS.some(function (e) {
            return e.id === t && e.deprecated === true
        })
    }, isTransitionDeprecated: function () {
        var t = this.get("transition");
        return SL.config.THEME_TRANSITIONS.some(function (e) {
            return e.id === t && e.deprecated === true
        })
    }, isBackgroundTransitionDeprecated: function () {
        var t = this.get("background_transition");
        return SL.config.THEME_BACKGROUND_TRANSITIONS.some(function (e) {
            return e.id === t && e.deprecated === true
        })
    }, isLoading: function () {
        return this.loading
    }, clone: function () {
        return new SL.models.Theme(JSON.parse(JSON.stringify(this.toJSON())))
    }, toJSON: function () {
        return {
            id: this.get("id"),
            name: this.get("name"),
            center: this.get("center"),
            rolling_links: this.get("rolling_links"),
            font: this.get("font"),
            color: this.get("color"),
            transition: this.get("transition"),
            background_transition: this.get("background_transition"),
            html: this.get("html"),
            less: this.get("less"),
            css: this.get("css"),
            js: this.get("js"),
            snippets: this.has("snippets") ? JSON.stringify(this.get("snippets").toJSON()) : null,
            palette: this.has("palette") ? this.get("palette").join(",") : null
        }
    }
});

SL("models").Theme.fromDeck = function (t) {
        return new SL.models.Theme({
            id: t.theme_id,
            name: "",
            center: t.center,
            rolling_links: t.rolling_links,
            font: t.theme_font,
            color: t.theme_color,
            transition: t.transition,
            background_transition: t.background_transition,
            snippets: "",
            palette: []
        })
    };