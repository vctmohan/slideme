SL("components").ThemeOptions = Class.extend({
    init: function (t) {
        if (!t.container)throw"Cannot build theme options without container";
        if (!t.model)throw"Cannot build theme options without model";
        this.config = $.extend({
            center: true,
            rollingLinks: true,
            colors: SL.config.THEME_COLORS,
            fonts: SL.config.THEME_FONTS,
            transitions: SL.config.THEME_TRANSITIONS,
            backgroundTransitions: SL.config.THEME_BACKGROUND_TRANSITIONS
        }, t), this.theme = t.model, this.changed = new signals.Signal, this.render(), this.updateSelection(), this.toggleDeprecatedOptions(), this.scrollToTop()
    }, render: function () {
        this.domElement = $('<div class="sl-themeoptions">').appendTo(this.config.container), "string" == typeof this.config.className && this.domElement.addClass(this.config.className), this.config.themes && this.renderThemes(), (this.config.center || this.config.rollingLinks) && this.renderOptions(), this.config.colors && this.renderColors(), this.config.fonts && this.renderFonts(), this.config.transitions && this.renderTransitions(), this.config.backgroundTransitions && this.renderBackgroundTransitions()
    }, renderThemes: function () {
        if (this.config.themes && !this.config.themes.isEmpty()) {
            var t = $('<div class="section selector theme"><h3>Theme</h3><ul></ul></div>').appendTo(this.domElement), e = t.find("ul");
            e.append(['<li data-theme="" class="custom">', '<span class="thumb-icon icon i-equalizer"></span>', '<span class="thumb-label">Custom</span>', "</li>"].join("")), this.config.themes.forEach(function (t) {
                var i = $('<li data-theme="' + t.get("id") + '"><span class="thumb-label" title="' + t.get("name") + '">' + t.get("name") + "</span></li>").appendTo(e);
                t.hasThumbnail() && i.css("background-image", 'url("' + t.get("thumbnail_url") + '")')
            }), this.domElement.find(".theme li").on("vclick", this.onThemeClicked.bind(this))
        }
    }, renderOptions: function () {
        var t = $('<div class="section options"><h3>Options</h3></div>').appendTo(this.domElement), e = $('<div class="options"></div>').appendTo(t);
        this.config.center && (e.append('<div class="unit sl-checkbox outline"><input id="theme-center" value="center" type="checkbox"><label for="theme-center" data-tooltip="Center slide contents vertically (not visible while editing)" data-tooltip-maxwidth="220" data-tooltip-delay="500">Vertical centering</label></div>'), t.find("#theme-center").on("change", this.onOptionChanged.bind(this))), this.config.rollingLinks && (e.append('<div class="unit sl-checkbox outline"><input id="theme-rolling_links" value="rolling_links" type="checkbox"><label for="theme-rolling_links" data-tooltip="Use a 3D hover effect on links" data-tooltip-maxwidth="220" data-tooltip-delay="500">Rolling links</label></div>'), t.find("#theme-rolling_links").on("change", this.onOptionChanged.bind(this)))
    }, renderColors: function () {
        var t = $('<div class="section selector color"><h3>Color</h3><ul></ul></div>').appendTo(this.domElement), e = t.find("ul");
        this.config.colors.forEach(function (t) {
            var i = $('<li data-color="' + t.id + '"><div class="theme-body-color-block"></div><div class="theme-link-color-block"></div></li>');
            i.addClass("theme-color-" + t.id), i.addClass("themed"), i.appendTo(e), t.tooltip && i.attr({
                "data-tooltip": t.tooltip,
                "data-tooltip-delay": 250,
                "data-tooltip-maxwidth": 300
            }), !SL.current_user.isPro() && t.pro && i.attr("data-pro", "true")
        }.bind(this)), this.domElement.find(".color li").on("vclick", this.onColorClicked.bind(this))
    }, renderFonts: function () {
        var t = $('<div class="section selector font"><h3>Typography</h3><ul></ul></div>').appendTo(this.domElement), e = t.find("ul");
        this.config.fonts.forEach(function (t) {
            var i = $('<li data-font="' + t.id + '" data-name="' + t.title + '"><div class="themed"><h1>' + t.title + "</h1><a>Type</a></div></li>");
            i.addClass("theme-font-" + t.id), i.appendTo(e), t.deprecated === true && i.addClass("deprecated"), t.tooltip && i.attr({
                "data-tooltip": t.tooltip,
                "data-tooltip-delay": 250,
                "data-tooltip-maxwidth": 300
            })
        }.bind(this)), this.domElement.find(".font li").on("vclick", this.onFontClicked.bind(this))
    }, renderTransitions: function () {
        var t = $('<div class="section selector transition"><h3>Transition</h3><ul></ul></div>').appendTo(this.domElement), e = t.find("ul");
        this.config.transitions.forEach(function (t) {
            var i = $('<li data-transition="' + t.id + '"></li>').appendTo(e);
            t.deprecated === true && i.addClass("deprecated"), t.title && i.attr({
                "data-tooltip": t.title,
                "data-tooltip-oy": -5
            })
        }.bind(this)), this.domElement.find(".transition li").on("vclick", this.onTransitionClicked.bind(this))
    }, renderBackgroundTransitions: function () {
        var t = $('<div class="section selector background-transition"></div>').appendTo(this.domElement);
        t.append('<h3>Background Transition <span class="icon i-info info-icon" data-tooltip="Background transitions apply when navigating to or from a slide that has a background image or color." data-tooltip-maxwidth="250"></span></h3>'), t.append("<ul>");
        var e = t.find("ul");
        this.config.backgroundTransitions.forEach(function (t) {
            var i = $('<li data-background-transition="' + t.id + '"></li>').appendTo(e);
            t.deprecated === true && i.addClass("deprecated"), t.title && i.attr({
                "data-tooltip": t.title,
                "data-tooltip-oy": -5
            })
        }.bind(this)), this.domElement.find(".background-transition li").on("vclick", this.onBackgroundTransitionClicked.bind(this))
    }, populate: function (t) {
        t && (this.theme = t, this.updateSelection(), this.toggleDeprecatedOptions(), this.scrollToTop())
    }, scrollToTop: function () {
        this.domElement.scrollTop(0)
    }, updateSelection: function () {
        this.config.themes && !this.config.themes.isEmpty() && this.domElement.toggleClass("using-theme", this.theme.has("id")), this.config.center && this.domElement.find("#theme-center").prop("checked", 1 == this.theme.get("center")), this.config.rollingLinks && this.domElement.find("#theme-rolling_links").prop("checked", 1 == this.theme.get("rolling_links")), this.domElement.find(".theme li").removeClass("selected"), this.domElement.find(".theme li[data-theme=" + this.theme.get("id") + "]").addClass("selected"), 0 !== this.domElement.find(".theme li.selected").length || this.theme.has("id") || this.domElement.find('.theme li[data-theme=""]').addClass("selected"), this.domElement.find(".color li").removeClass("selected"), this.domElement.find(".color li[data-color=" + this.theme.get("color") + "]").addClass("selected"), this.domElement.find(".font li").removeClass("selected"), this.domElement.find(".font li[data-font=" + this.theme.get("font") + "]").addClass("selected"), this.domElement.find(".font li").each(function (t, e) {
            SL.util.html.removeClasses(e, function (t) {
                return t.match(/^theme\-color\-/gi)
            }), $(e).addClass("theme-color-" + this.theme.get("color"))
        }.bind(this)), this.domElement.find(".transition li").removeClass("selected"), this.domElement.find(".transition li[data-transition=" + this.theme.get("transition") + "]").addClass("selected"), this.domElement.find(".background-transition li").removeClass("selected"), this.domElement.find(".background-transition li[data-background-transition=" + this.theme.get("background_transition") + "]").addClass("selected")
    }, applySelection: function () {
        SL.helpers.ThemeController.paint(this.theme, {center: false, js: false})
    }, toggleDeprecatedOptions: function () {
        this.domElement.find(".font .deprecated").toggle(this.theme.isFontDeprecated()), this.domElement.find(".transition .deprecated").toggle(this.theme.isTransitionDeprecated()), this.domElement.find(".background-transition .deprecated").toggle(this.theme.isBackgroundTransitionDeprecated())
    }, getTheme: function () {
        return this.theme
    }, onThemeClicked: function (t) {
        var e = $(t.currentTarget), i = e.data("theme");
        if (i) {
            var n = this.config.themes.getByProperties({id: i});
            if (n) {
                if (!n.isLoading()) {
                    var s = $('<div class="thumb-preloader hidden"><div class="spinner centered"></div></div>').appendTo(e), o = setTimeout(function () {
                        s.removeClass("hidden")
                    }, 1);
                    SL.util.html.generateSpinners(), e.addClass("selected"), n.load().done(function () {
                        this.theme = n.clone(), this.updateSelection(), this.applySelection(), this.changed.dispatch()
                    }.bind(this)).fail(function () {
                        SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), e.removeClass("selected")
                    }.bind(this)).always(function () {
                        clearTimeout(o), s.remove()
                    }.bind(this))
                }
            } else SL.notify("Could not find theme data", "negative")
        } else this.theme.set("id", null), this.theme.set("js", null), this.theme.set("css", null), this.theme.set("less", null), this.theme.set("html", null), this.updateSelection(), this.applySelection(), this.changed.dispatch();
        SL.analytics.trackTheming("Theme option selected")
    }, onOptionChanged: function () {
        this.theme.set("center", this.domElement.find("#theme-center").is(":checked")), this.theme.set("rolling_links", this.domElement.find("#theme-rolling_links").is(":checked")), this.updateSelection(), this.applySelection(), this.changed.dispatch()
    }, onColorClicked: function (t) {
        return t.preventDefault(), $(t.currentTarget).is("[data-pro]") ? void window.open("/pricing") : (this.theme.set("color", $(t.currentTarget).data("color")), this.updateSelection(), this.applySelection(), SL.analytics.trackTheming("Color option selected", this.theme.get("color")), void this.changed.dispatch())
    }, onFontClicked: function (t) {
        t.preventDefault(), this.theme.set("font", $(t.currentTarget).data("font")), this.updateSelection(), this.applySelection(), SL.analytics.trackTheming("Font option selected", this.theme.get("font")), this.changed.dispatch()
    }, onTransitionClicked: function (t) {
        t.preventDefault(), this.theme.set("transition", $(t.currentTarget).data("transition")), this.updateSelection(), this.applySelection(), SL.analytics.trackTheming("Transition option selected", this.theme.get("transition")), this.changed.dispatch()
    }, onBackgroundTransitionClicked: function (t) {
        t.preventDefault(), this.theme.set("background_transition", $(t.currentTarget).data("background-transition")), this.updateSelection(), this.applySelection(), SL.analytics.trackTheming("Background transition option selected", this.theme.get("background_transition")), this.changed.dispatch()
    }, destroy: function () {
        this.changed.dispose(), this.domElement.remove(), this.theme = null, this.config = null
    }
});