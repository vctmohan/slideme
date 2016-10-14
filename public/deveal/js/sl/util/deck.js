SL.util.deck = {
    idCounter: 1, sortInjectedStyles: function () {
        var t = $("head");
        $("#theme-css-output").appendTo(t), $("#user-css-output").appendTo(t)
    }, afterSlidesChanged: function () {
        this.generateIdentifiers(), this.generateSlideNumbers()
    }, generateIdentifiers: function (t) {
        $(t || ".reveal .slides section").each(function () {
            (this.hasAttribute("data-id") === false || 0 === this.getAttribute("data-id").length) && this.setAttribute("data-id", CryptoJS.MD5(["slide", SL.current_user.get("id"), SL.current_deck.get("id"), Date.now(), SL.util.deck.idCounter++].join("-")).toString())
        }), this.generateSlideNumbers()
    }, generateSlideNumbers: function () {
        this.slideNumberMap = {}, $(".reveal .slides>section[data-id]").each(function (t, e) {
            t += 1, e = $(e), e.hasClass("stack") ? e.find(">section[data-id]").each(function (e, i) {
                e += 1, i = $(i), this.slideNumberMap[i.attr("data-id")] = t + (e > 1 ? "." + e : "")
            }.bind(this)) : this.slideNumberMap[e.attr("data-id")] = t
        }.bind(this))
    }, getSlideNumber: function (t) {
        return this.slideNumberMap || this.generateSlideNumbers(), this.slideNumberMap[this.getSlideID(t)]
    }, getSlideID: function (t) {
        return "string" == typeof t ? t : t && "function" == typeof t.getAttribute ? t.getAttribute("data-id") : t && "function" == typeof t.attr ? t.attr("data-id") : void 0
    }, getSlideIndicesFromIdentifier: function (t) {
        var e = $('.reveal .slides section[data-id="' + t + '"]');
        return e.length ? Reveal.getIndices(e.get(0)) : null
    }, injectNotes: function () {
        SLConfig.deck && SLConfig.deck.notes && [].forEach.call(document.querySelectorAll(".reveal .slides section"), function (t) {
            var e = SLConfig.deck.notes[t.getAttribute("data-id")];
            e && "string" == typeof e && t.setAttribute("data-notes", e)
        })
    }, getBackgroundColor: function () {
        var t = $(".reveal-viewport");
        if (t.length) {
            var e = t.css("background-color");
            if (window.Reveal && window.Reveal.isReady()) {
                var i = window.Reveal.getIndices(), n = window.Reveal.getSlideBackground(i.h, i.v);
                if (n) {
                    var s = n.style.backgroundColor;
                    s && window.tinycolor(s).getAlpha() > 0 && (e = s)
                }
            }
            if (e)return e
        }
        return "#ffffff"
    }, getBackgroundContrast: function () {
        return SL.util.color.getContrast(SL.util.deck.getBackgroundColor())
    }, getBackgroundBrightness: function () {
        return SL.util.color.getBrightness(SL.util.deck.getBackgroundColor())
    }, navigateToSlide: function (t) {
        if (t) {
            var e = Reveal.getIndices(t);
            Reveal.slide(e.h, e.v)
        }
    }, replaceHTML: function (t) {
        SL.util.skipCSSTransitions($(".reveal"), 1);
        var e = Reveal.getState();
        $(".reveal .slides").get(0).innerHTML = t, Reveal.setState(e), Reveal.sync(), this.afterSlidesChanged()
    }
};