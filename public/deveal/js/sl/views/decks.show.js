SL("views.decks").Show = SL.views.Base.extend({
    init: function () {
        this._super();
            SL.util.setupReveal({
            history: !0,
            embedded: !0,
            pause: !1,
            margin: .1,
            openLinksInTabs: !0,
            trackEvents: !0
        });
        this.setupDisqus();
        this.setupPills();
        $("header .deck-promotion").length && $("header").addClass("extra-wide"), Modernizr.fullscreen === !1 && $(".deck-options .fullscreen-button").hide(), this.bind(), this.layout()
    }, bind: function () {
        this.editButton = $(".deck-options .edit-button"), this.editButtonOriginalLink = this.editButton.attr("href"), $(".deck-options .fork-button").on("click", this.onForkClicked.bind(this)), $(".deck-options .share-button").on("click", this.onShareClicked.bind(this)), $(".deck-options .comment-button").on("click", this.onCommentsClicked.bind(this)), $(".deck-options .fullscreen-button").on("click", this.onFullScreenClicked.bind(this)), this.visibilityButton = $(".deck-options .visibility-button"), this.visibilityButton.on("click", this.onVisibilityClicked.bind(this)), $(document).on("webkitfullscreenchange mozfullscreenchange MSFullscreenChange fullscreenchange", Reveal.layout), this.onWindowScroll = $.debounce(this.onWindowScroll, 200), $(window).on("resize", this.layout.bind(this)), $(window).on("scroll", this.onWindowScroll.bind(this)), Reveal.addEventListener("slidechanged", this.onSlideChanged.bind(this)), Reveal.addEventListener("fragmentshown", this.hideSummary), Reveal.addEventListener("fragmenthidden", this.hideSummary)
    }, setupPills: function () {
        this.hideSummary = this.hideSummary.bind(this), this.hideInstructions = this.hideInstructions.bind(this), this.summaryPill = $(".summary-pill"), this.instructionsPill = $(".instructions-pill"), this.summaryPill.on("click", this.hideSummary), this.instructionsPill.on("click", this.hideInstructions), this.showSummaryTimeout = setTimeout(this.showSummary.bind(this), 1e3), this.hideSummaryTimeout = setTimeout(this.hideSummary.bind(this), 6e3), this.showNavigationInstructions()
    }, setupDisqus: function () {
        $("#disqus_thread").length ? $(window).on("load", function () {
            {
                var t = window.disqus_shortname = "slidesapp";
                window.disqus_identifier = SLConfig.deck.id
            }
            !function () {
                var e = document.createElement("script");
                e.type = "text/javascript", e.async = !0, e.src = "//" + t + ".disqus.com/embed.js", (document.getElementsByTagName("head")[0] || document.getElementsByTagName("body")[0]).appendChild(e)
            }()
        }) : $(".options .comment-button").hide()
    }, showSummary: function () {
        this.summaryPill && this.summaryPill.addClass("visible")
    }, hideSummary: function () {
        clearTimeout(this.showSummaryTimeout), this.summaryPill && (this.summaryPill.removeClass("visible"), this.summaryPill.on("transitionend", this.summaryPill.remove), this.summaryPill = null)
    }, canShowInstructions: function () {
        return !SL.util.user.isLoggedIn() && !SL.util.device.IS_PHONE && !SL.util.device.IS_TABLET && Reveal.getTotalSlides() > 1 && Modernizr.localstorage
    }, showNavigationInstructions: function () {
        this.showInstructions("slides-has-seen-deck-navigation-instructions", 6e3, {
            title: "Navigation instructions",
            description: "Press the space key or click the arrows to the right"
        })
    }, showVerticalInstructions: function () {
        this.showInstructions("slides-has-seen-deck-vertical-instructions", 1e3, {
            title: "There's a vertical slide below",
            description: "Use the controls to the right or the keyboard arrows",
            icon: "down-arrow"
        })
    }, showInstructions: function (t, e, i) {
        clearTimeout(this.showInstructionsTimeout), this.instructionsPill && this.canShowInstructions() && !localStorage.getItem(t) && (localStorage.setItem(t, "yes"), this.showInstructionsTimeout = setTimeout(function () {
            this.instructionsPill.attr("data-icon", i.icon), this.instructionsPill.find(".pill-title").text(i.title), this.instructionsPill.find(".pill-description").text(i.description), this.instructionsPill.addClass("visible"), this.layout()
        }.bind(this), e))
    }, hideInstructions: function () {
        clearTimeout(this.showInstructionsTimeout), this.instructionsPill && this.instructionsPill.removeClass("visible")
    }, layout: function () {
        this.summaryPill && this.summaryPill.css("left", (window.innerWidth - this.summaryPill.width()) / 2), this.instructionsPill && this.instructionsPill.css("left", (window.innerWidth - this.instructionsPill.width()) / 2);
        var t = $(".reveal .playback"), e = $(".deck-kudos"), i = {opacity: 1};
        e.length && t.length && (i.marginLeft = t.offset().left + t.outerWidth() - 10), e.css(i)
    }, saveVisibility: function (t) {
        var e = {
            type: "POST",
            url: SL.config.AJAX_PUBLISH_DECK(SL.current_deck.get("id")),
            context: this,
            data: {visibility: t}
        };
        $.ajax(e).done(function (t) {
            t.deck.visibility === SL.models.Deck.VISIBILITY_SELF ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_SELF")) : t.deck.visibility === SL.models.Deck.VISIBILITY_TEAM ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_TEAM")) : t.deck.visibility === SL.models.Deck.VISIBILITY_ALL && SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ALL")), "string" == typeof t.deck.slug && SL.current_deck.set("slug", t.deck.slug), "string" == typeof t.deck.visibility && SL.current_deck.set("visibility", t.deck.visibility)
        }).fail(function () {
            SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ERROR"), "negative")
        })
    }, onShareClicked: function () {
        return "undefined" != typeof SLConfig && "string" == typeof SLConfig.deck.user.username && "string" == typeof SLConfig.deck.slug ? SL.popup.open(SL.components.decksharer.DeckSharer, {deck: SL.current_deck}) : SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), SL.analytics.trackPresenting("Share clicked"), !1
    }, onCommentsClicked: function () {
        SL.analytics.trackPresenting("Comments clicked")
    }, onFullScreenClicked: function () {
        var t = $(".reveal-viewport").get(0);
        return t ? (SL.helpers.Fullscreen.enter(t), !1) : void SL.analytics.trackPresenting("Fullscreen clicked")
    }, onForkClicked: function () {
        return SL.analytics.trackPresenting("Fork clicked"), $.ajax({
            type: "POST",
            url: SL.config.AJAX_FORK_DECK(SLConfig.deck.id),
            context: this
        }).done(function () {
            window.location = SL.current_user.getProfileURL()
        }).fail(function () {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
        }), !1
    }, onVisibilityClicked: function (t) {
        t.preventDefault();
        var e = SL.current_deck.get("visibility"), i = [];
        i.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_SELF"),
            selected: e === SL.models.Deck.VISIBILITY_SELF,
            callback: function () {
                this.saveVisibility(SL.models.Deck.VISIBILITY_SELF), SL.analytics.trackPresenting("Visibility changed", "self")
            }.bind(this)
        }), SL.current_user.isEnterprise() && i.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_TEAM"),
            selected: e === SL.models.Deck.VISIBILITY_TEAM,
            className: "divider",
            callback: function () {
                this.saveVisibility(SL.models.Deck.VISIBILITY_TEAM), SL.analytics.trackPresenting("Visibility changed", "team")
            }.bind(this)
        }), i.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_ALL"),
            selected: e === SL.models.Deck.VISIBILITY_ALL,
            callback: function () {
                this.saveVisibility(SL.models.Deck.VISIBILITY_ALL), SL.analytics.trackPresenting("Visibility changed", "all")
            }.bind(this)
        }), SL.prompt({
            anchor: $(t.currentTarget),
            type: "select",
            className: "sl-visibility-prompt",
            data: i
        }), SL.analytics.trackPresenting("Visibility menu opened")
    }, onSlideChanged: function (t) {
        this.hideSummary(), this.hideInstructions();
        var e = "#";
        t.indexh && (e += "/" + t.indexh, t.indexv && (e += "/" + t.indexv)), this.editButton.attr("href", this.editButtonOriginalLink + e), t.indexh > 0 && 0 === t.indexv && Reveal.availableRoutes().down && this.showVerticalInstructions()
    }, onWindowScroll: function () {
        $(window).scrollTop() > 10 && (this.hideSummary(), this.hideInstructions())
    }
});