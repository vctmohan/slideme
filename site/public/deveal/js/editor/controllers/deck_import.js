SL("editor.controllers").DeckImport = {
    TEXT_FORMATS: {h1: "h1", h2: "h2", h3: "h3", p: "p"},
    THEME_COLOR_MAP: {"white-blue": "white-blue", "black-blue": "black-blue"},
    THEME_FONT_MAP: {
        asul: "asul",
        helvetica: "helvetica",
        josefine: "josefine",
        league: "league",
        merriweather: "merriweather",
        montserrat: "montserrat",
        news: "news",
        opensans: "opensans",
        palatino: "palatino",
        quicksand: "quicksand",
        sketch: "sketch",
        overpass: "overpass2"
    },
    TRANSITION_MAP: {none: "none", fade: "fade", slide: "slide", concave: "concave", convex: "convex"},
    init: function (e) {
        this.editor = e, this.onImportConfirmed = this.onImportConfirmed.bind(this), this.onImportCanceled = this.onImportCanceled.bind(this), this.importing = false, SL.util.getQuery().define && "object" == typeof window.SLDeckDefinition && e.isNewDeck() && (this.editor.deckSaved.add(this.onDeckSaved.bind(this)), this.start(SLDeckDefinition))
    },
    start: function (e) {
        this.importing || (this.importing = true, this.domElement = $('<div class="sl-deck-import">'), this.domElement.appendTo($(".projector")), this.domElement.append('<p class="description">You are importing a deck. Please review the content and click below to save it to your account.</p>'), this.controlsButtons = $('<div class="sl-deck-import-buttons">'), this.controlsButtons.appendTo(this.domElement), this.confirmButton = $('<button class="button white l sl-deck-import-confirm">Save deck</button>'), this.confirmButton.on("vclick", this.onImportConfirmed), this.confirmButton.appendTo(this.controlsButtons), this.cancelButton = $('<button class="button outline white l sl-deck-import-cancel">Cancel</button>'), this.cancelButton.on("vclick", this.onImportCanceled), this.cancelButton.appendTo(this.controlsButtons), this.importJSON(e), $("html").addClass("deck-import-open"))
    },
    stop: function () {
        this.importing = false, this.domElement.remove(), $("html").removeClass("deck-import-open")
    },
    importJSON: function (e) {
        SL.helpers.PageLoader.show({message: "Importing..."}), $(".reveal .slides").empty(), e.title && (SLConfig.deck.title = e.title), e.description && (SLConfig.deck.description = e.description), e.loop && (SLConfig.deck.should_loop = e.loop), e["slide-number"] && (SLConfig.deck.slide_number = e["slide-number"]), SLConfig.deck.theme_color = this.THEME_COLOR_MAP[e["theme-color"]] || SL.config.DEFAULT_THEME_COLOR, SLConfig.deck.theme_font = this.THEME_FONT_MAP[e["theme-font"]] || SL.config.DEFAULT_THEME_FONT, SLConfig.deck.transition = this.TRANSITION_MAP[e.transition] || SL.config.DEFAULT_THEME_TRANSITION, SLConfig.deck.background_transition = this.TRANSITION_MAP[e["background-transition"]] || SL.config.DEFAULT_THEME_BACKGROUND_TRANSITION, e.slides.forEach(this.importSlideJSON, this), Reveal.sync(), Reveal.slide(0, 0), SL.editor.controllers.Blocks.sync(), SL.view.slideOptions.syncRemoveSlide(), this.editor.setupTheme(), this.waitForContentToLoad().then(this.afterContentLoaded.bind(this))
    },
    importSlideJSON: function (e, t) {
        var i = $("<section>").appendTo($(".reveal .slides"));
        SL.util.deck.generateIdentifiers(i), e instanceof Array ? e.forEach(function (e) {
            this.importSlideJSON(e, i)
        }, this) : (e.notes && (SLConfig.deck.notes[i.attr("data-id")] = e.notes), e["background-color"] && i.attr("data-background-color", e["background-color"]), e["background-image"] && i.attr("data-background-image", e["background-image"]), e["background-size"] && i.attr("data-background-size", e["background-size"]), this.slideBlockCount = {}, e.blocks && e.blocks.forEach(function (e) {
            this.importBlockJSON(e, i);
            var t = e.type;
            this.slideBlockCount[t] ? this.slideBlockCount[t] += 1 : this.slideBlockCount[t] = 1
        }, this), e.html && this.importBlockJSON({
            type: "html",
            value: e.html
        }, i), "object" == typeof t && i.appendTo(t))
    },
    importBlockJSON: function (e, t) {
        var i = {slide: t, silent: true, width: Math.round(.8 * SL.config.SLIDE_WIDTH)};
        switch (e.type) {
            case"html":
                i.type = "text", i.width = .8 * SL.config.SLIDE_WIDTH, i.afterInit = function (t) {
                    t.setCustomHTML(e.value)
                };
                break;
            case"text":
                i.type = "text", i.width = .8 * SL.config.SLIDE_WIDTH;
                var n = this.TEXT_FORMATS[e.format] || (this.slideBlockCount.text > 0 ? "h2" : "h1");
                i.afterInit = function (t) {
                    t.setHTML("<" + n + ">" + e.value + "</" + n + ">")
                };
                break;
            case"iframe":
                i.type = "iframe", i.width = .6 * SL.config.SLIDE_WIDTH, i.height = .6 * SL.config.SLIDE_HEIGHT, i.afterInit = function (t) {
                    t.set("iframe.src", e.value)
                };
                break;
            case"image":
                i.type = "image", i.width = .6 * SL.config.SLIDE_WIDTH, i.height = .6 * SL.config.SLIDE_HEIGHT, i.afterInit = function (t) {
                    t.set("image.src", e.value)
                };
                break;
            case"code":
                i.type = "code", i.width = .6 * SL.config.SLIDE_WIDTH, i.height = .6 * SL.config.SLIDE_HEIGHT, i.afterInit = function (t) {
                    e.value && t.set("code.value", e.value), e.language && t.set("code.language", e.language), e.theme && t.set("code.theme", e.theme)
                };
                break;
            default:
                return void console.warn('Unrecognized block type: "' + e.type + '"')
        }
        this.importBlockSize(i, e, i.width, i.height), SL.editor.controllers.Blocks.add(i)
    },
    importBlockSize: function (e, t, i, n) {
        "number" == typeof i && (e.width = Math.round("number" == typeof t.width ? t.width : i)), "number" == typeof n && (e.height = Math.round("number" == typeof t.height ? t.height : n))
    },
    layoutSlide: function (e) {
        e.style.display = "block", SL.editor.controllers.Blocks.layout(SL.editor.controllers.Blocks.getBlocksBySlide(e), "column"), e.style.display = ""
    },
    waitForContentToLoad: function () {
        var e = [];
        return $(".reveal .slides section").each(function (t, i) {
            i.style.display = "block", SL.editor.controllers.Blocks.getBlocksBySlide(i).forEach(function (t) {
                "image" === t.getType() && t.isLoading() && e.push(new Promise(function (e) {
                    t.imageStateChanged.add(function () {
                        (t.isLoaded() || !t.isLoading()) && e()
                    })
                }))
            })
        }.bind(this)), e.push(new Promise(function (e) {
            var t = SL.fonts.loadDeckFont(SLConfig.deck.theme_font, {active: e, inactive: e});
            t || e()
        })), Promise.all(e)
    },
    afterContentLoaded: function () {
        SL.helpers.PageLoader.hide(), $(".reveal .slides section").each(function (e, t) {
            this.layoutSlide(t), Reveal.sync()
        }.bind(this))
    },
    isImporting: function () {
        return this.importing
    },
    onImportCanceled: function () {
        this.stop(), SL.analytics.trackEditor("Deck JSON import canceled"), SL.helpers.PageLoader.show({message: "Canceling import..."}), SL.view.redirect(SL.routes.USER(SL.current_user.get("username")), true)
    },
    onImportConfirmed: function () {
        this.stop(), SL.analytics.trackEditor("Deck JSON import confirmed"), this.editor.save(function (e) {
            e && SL.notify("This deck has been saved to your account!")
        })
    },
    onDeckSaved: function () {
        this.isImporting() && (this.domElement.remove(), this.importing = false, SL.notify("Deck saved!"))
    }
};