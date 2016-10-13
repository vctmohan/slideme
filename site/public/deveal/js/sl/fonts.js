SL.fonts = {
    INIT_TIMEOUT: 5e3,
    //FONTS_URL: "http://s3.amazonaws.com/static.slid.es/fonts/",
    FONTS_URL: "/deveal/fonts/",
    FAMILIES: {
        montserrat: {
            id: "montserrat",
            name: "Montserrat",
            path: "montserrat/montserrat.css"
        },
        opensans: {
            id: "opensans",
            name: "Open Sans",
            path: "opensans/opensans.css"
        },
        lato: {id: "lato", name: "Lato", path: "lato/lato.css"},
        asul: {id: "asul", name: "Asul", path: "asul/asul.css"},
        josefinsans: {
            id: "josefinsans",
            name: "Josefin Sans",
            path: "josefinsans/josefinsans.css"
        },
        league: {
            id: "league",
            name: "League Gothic",
            path: "league/league_gothic.css"
        },
        merriweathersans: {
            id: "merriweathersans",
            name: "Merriweather Sans",
            path: "merriweathersans/merriweathersans.css"
        },
        overpass: {id: "overpass", name: "Overpass", path: "overpass/overpass.css"},
        overpass2: {
            id: "overpass2",
            name: "Overpass 2",
            path: "overpass2/overpass2.css"
        },
        quicksand: {
            id: "quicksand",
            name: "Quicksand",
            path: "quicksand/quicksand.css"
        },
        cabinsketch: {
            id: "cabinsketch",
            name: "Cabin Sketch",
            path: "cabinsketch/cabinsketch.css"
        },
        newscycle: {
            id: "newscycle",
            name: "News Cycle",
            path: "newscycle/newscycle.css"
        },
        oxygen: {id: "oxygen", name: "Oxygen", path: "oxygen/oxygen.css"}
    },
    PACKAGES: {
        asul: ["asul"],
        helvetica: [],
        josefine: ["josefinsans", "lato"],
        league: ["league", "lato"],
        merriweather: ["merriweathersans", "oxygen"],
        news: ["newscycle", "lato"],
        montserrat: ["montserrat", "opensans"],
        opensans: ["opensans"],
        overpass: ["overpass"],
        overpass2: ["overpass2"],
        palatino: [],
        quicksand: ["quicksand", "opensans"],
        sketch: ["cabinsketch", "oxygen"]
    },
    init: function () {
        this._isReady = false;
        this.ready = new signals.Signal;
        this.loaded = new signals.Signal;
        this.debugMode = !!SL.util.getQuery().debug, $("link[data-application-font]").each(function () {
            var t = $(this).attr("data-application-font");
            SL.fonts.FAMILIES[t] && (SL.fonts.FAMILIES[t].loaded = true)
        });
        if (SLConfig && SLConfig.deck) {
            var t = (SLConfig.deck.theme_font, this.loadDeckFont([SLConfig.deck.theme_font || SL.config.DEFAULT_THEME_FONT], {
                active: this.onWebFontsActive.bind(this),
                inactive: this.onWebFontsInactive.bind(this)
            }));
            t ? this.initTimeout = setTimeout(function () {
                this.debugMode && console.log("SL.fonts", "timed out"), this.finishLoading()
            }.bind(this), SL.fonts.INIT_TIMEOUT) : this.finishLoading()
        } else{
            this.finishLoading()
        }
    },
    load: function (t, e) {
        var i = $.extend({custom: {families: [], urls: []}}, e);
        return t.forEach(function (t) {
            var e = SL.fonts.FAMILIES[t];
            e ? e.loaded || (e.loaded = true, i.custom.families.push(e.name), i.custom.urls.push(SL.fonts.FONTS_URL + e.path)) : console.warn('Could not find font family with id "' + t + '"')
        }), this.debugMode && console.log("SL.fonts.load", i.custom.families), i.custom.families.length ? (WebFont.load(i), true) : false
    },
    loadAll: function () {
        var t = [];
        for (var e in SL.fonts.FAMILIES)t.push(e);
        this.load(t)
    },
    loadDeckFont: function (t, e) {
        var i = SL.fonts.PACKAGES[t];
        return i ? SL.fonts.load(i, e) : false
    },
    unload: function (t) {
        t.forEach(function (t) {
            var e = SL.fonts.FAMILIES[t];
            e && (e.loaded = false, $('link[href="' + SL.fonts.FONTS_URL + e.path + '"]').remove())
        })
    },
    finishLoading: function () {
        clearTimeout(this.initTimeout), $("html").addClass("fonts-are-ready"), this._isReady === false && (this._isReady = true, this.ready.dispatch()), this.loaded.dispatch()
    },
    isReady: function () {
        return this._isReady
    },
    onWebFontsActive: function () {
        this.finishLoading()
    },
    onWebFontsInactive: function () {
        this.finishLoading()
    }
};