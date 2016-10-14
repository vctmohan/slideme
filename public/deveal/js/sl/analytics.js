SL.analytics = {
    CATEGORY_OTHER: "other",
    CATEGORY_EDITOR: "editor",
    CATEGORY_THEMING: "theming",
    CATEGORY_PRESENTING: "presenting",
    CATEGORY_COLLABORATION: "collaboration",
    _track: function (t, e, i) {
        "undefined" != typeof window.ga && ga("send", "event", t, e, i)
    },
    _trackPageView: function (t, e) {
        e = e || document.title, "undefined" != typeof window.ga && ga(function () {
            for (var i = ga.getAll(), n = 0; n < i.length; ++n)i[n].send("pageview", {
                page: t,
                title: e
            })
        })
    },
    track: function (t, e) {
        this._track(SL.analytics.CATEGORY_OTHER, t, e)
    },
    trackEditor: function (t, e) {
        this._track(SL.analytics.CATEGORY_EDITOR, t, e)
    },
    trackTheming: function (t, e) {
        this._track(SL.analytics.CATEGORY_THEMING, t, e)
    },
    trackPresenting: function (t, e) {
        this._track(SL.analytics.CATEGORY_PRESENTING, t, e)
    },
    trackCollaboration: function (t, e) {
        this._track(SL.analytics.CATEGORY_COLLABORATION, t, e)
    },
    trackCurrentSlide: function (t) {
        if (window.Reveal) {
            var e = window.Reveal.getIndices(), t = window.location.pathname + "/" + e.h;
            "number" == typeof e.v && e.v > 0 && (t += "/" + e.v);
            var i = $(Reveal.getCurrentSlide()).find("h1, h2, h3").first().text().trim();
            (!i || i.length < 2) && (i = "Untitled"), this._trackPageView(t, i)
        }
    }
};