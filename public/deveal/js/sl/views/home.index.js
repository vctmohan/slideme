SL("views.home").Index = SL.views.Base.extend({
    MARQUEE_MIN_HEIGHT: 600,
    init: function () {
        this._super();
        this.learnMoreButton = $(".marquee .description-cta-secondary");
        this.scrollPromotion = $(".marquee .scroll-promotion");
        this.scrollPromotionArrow = $(".marquee .scroll-promotion-arrow");
        this.bind();
        this.startScrollPromotion();
    },
    bind: function () {
        this.learnMoreButton.on("click", this.onLearnMoreClicked.bind(this));
        this.scrollPromotion.on("click", this.onLearnMoreClicked.bind(this));
        this.scrollPromotionArrow.on("mouseover", this.onScrollPromotionOver.bind(this));
        this.syncScrolling = $.debounce(this.syncScrolling, 300);
        this.trackScrolling = $.throttle(this.trackScrolling, 500);
        $(window).on("resize", this.onWindowResize.bind(this));
        $(window).on("scroll", this.onWindowScroll.bind(this));
    },
    trackScrolling: function () {
        this.scrollTracking = this.scrollTracking || {};
        var t = $(window).scrollTop(), e = window.innerHeight, i = $(document).height(), n = Math.max(Math.min(t / (i - e), 1), 0);
        n > .1 && !this.scrollTracking[.1] && (this.scrollTracking[.1] = true, SL.analytics.track("Home: Scrolled", "10%")), n > .5 && !this.scrollTracking[.5] && (this.scrollTracking[.5] = true, SL.analytics.track("Home: Scrolled", "50%")), n > .95 && !this.scrollTracking[.95] && (this.scrollTracking[.95] = true, SL.analytics.track("Home: Scrolled", "100%"))
    },
    syncScrolling: function () {
        var t = $(window).scrollTop();
        t > 20 && this.scrollPromotion.addClass("hidden")
    },
    startScrollPromotion: function () {
        clearInterval(this.scrollPromotionInterval);
        this.scrollPromotionInterval = setInterval(this.promoteScrolling.bind(this), 2500);
    },
    stopScrollPromotion: function () {
        clearInterval(this.scrollPromotionInterval), this.scrollPromotionInterval = null
    },
    promoteScrolling: function () {
        this.scrollPromotionArrow.removeClass("bounce"), setTimeout(function () {
            this.scrollPromotionArrow.addClass("bounce")
        }.bind(this), 1)
    },
    onScrollPromotionOver: function () {
        this.stopScrollPromotion()
    },
    onLearnMoreClicked: function () {
        SL.analytics.track("Home: Learn more clicked"), this.stopScrollPromotion()
    },
    onWindowResize: function () {
        this.syncScrolling()
    },
    onWindowScroll: function () {
        this.scrollPromotionInterval && this.stopScrollPromotion(), this.syncScrolling(), this.trackScrolling()
    }
});