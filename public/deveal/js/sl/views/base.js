SL("views").Base = Class.extend({
    init: function () {
        this.header = new SL.components.Header;
        this.setupAce();
        this.setupScrollAnchors();
        this.handleLogos();
        this.handleOutlines();
        this.handleFeedback();
        this.handleWindowClose();
        this.handleAutoRefresh();
        this.parseTimes();
        this.parseLinks();
        this.parseMeters();
        this.parseSpinners();
        this.parseNotifications();
        this.parseScrollLinks();
        setInterval(this.parseTimes.bind(this), 12e4);
    },
    setupAce: function () {
        if("object" == typeof window.ace){
            if("object" == typeof window.ace.config){
                if("function" == typeof window.ace.config.set){
                    ace.config.set("workerPath", "/assets");
                }
            }
        }
    }, setupScrollAnchors: function () {
        var t = $('.sl-scroll-anchor[href^="#"]');
        if (t.length) {
            var e = t.map(function (t, e) {
                var i = e.getAttribute("href").slice(1);
                return {id: i, link: $(e), target: $(document.getElementById(i))}
            }).toArray(), i = function () {
                var t = window.innerHeight, i = $(window).scrollTop(), n = null, s = Number.MAX_VALUE;
                e.forEach(function (e) {
                    e.link.removeClass("sl-scroll-anchor-selected");
                    var o = e.target.offset().top - i, a = Math.abs(o);
                    s > a && .4 * t > o && (s = a, n = e)
                }), n && n.link.addClass("sl-scroll-anchor-selected")
            };
            $(window).on("scroll", $.throttle(i.bind(this), 300)), i()
        }
    },
    handleLogos: function () {
        setTimeout(function () {
            $(".logo-animation").addClass("open")
        }, 600)
    },
    handleOutlines: function () {
        var t = $("<style>").appendTo("head").get(0), e = function (e) {
            t.styleSheet ? t.styleSheet.cssText = e : t.innerHTML = e
        };
        $(document).on("mousedown", function () {
            e("a, button, .sl-select, .sl-checkbox label, .radio label { outline: none !important; }")
        }), $(document).on("keydown", function () {
            e("")
        })
    },
    handleFeedback: function () {
        $("html").on("click", "[data-feedback-mode]", function (t) {
            if (UserVoice && "function" == typeof UserVoice.show) {
                var e = $(this), i = {
                    target: this,
                    mode: e.attr("data-feedback-mode") || "contact",
                    position: e.attr("data-feedback-position") || "top",
                    screenshot_enabled: e.attr("data-feedback-screenshot_enabled") || "true",
                    smartvote_enabled: e.attr("data-feedback-smartvote-enabled") || "true",
                    ticket_custom_fields: {}
                };
                SL.current_deck && (i.ticket_custom_fields["Deck ID"] = SL.current_deck.get("id"), i.ticket_custom_fields["Deck Slug"] = SL.current_deck.get("slug"), i.ticket_custom_fields["Deck Version"] = SL.current_deck.get("version"), i.ticket_custom_fields["Deck Font"] = SL.current_deck.get("theme_font"), i.ticket_custom_fields["Deck Color"] = SL.current_deck.get("theme_color"), i.ticket_custom_fields["Deck Transition"] = SL.current_deck.get("transition"), i.ticket_custom_fields["Deck Background Transition"] = SL.current_deck.get("backgroundTransition"));
                var n = e.attr("data-feedback-type");
                n && n.length && (i.ticket_custom_fields.Type = n);
                var s = e.attr("data-feedback-contact-title");
                s && s.length && (i.contact_title = s), UserVoice.show(i), t.preventDefault()
            }
        })
    },
    handleWindowClose: function () {
        var t = SL.util.getQuery();
        if (t && t.autoclose && window.opener) {
            var e = parseInt(t.autoclose, 10) || 0;
            setTimeout(function () {
                try {
                    window.close()
                } catch (t) {
                }
            }, e)
        }
    },
    handleAutoRefresh: function () {
        var t = SL.util.getQuery();
        if (t && t.autoRefresh) {
            var e = parseInt(t.autoRefresh, 10);
            !isNaN(e) && e > 0 && setTimeout(function () {
                window.location.reload()
            }, e)
        }
    },
    parseTimes: function () {
        $("time.ago").each(function () {
            var t = $(this).attr("datetime");
            t && $(this).text(moment.utc(t).fromNow())
        }), $("time.date").each(function () {
            var t = $(this).attr("datetime");
            t && $(this).text(moment.utc(t).format("MMM Do, YYYY"))
        })
    },
    parseLinks: function () {
        $(".linkify").each(function () {
            $(this).html(SL.util.string.linkify($(this).text()))
        })
    },
    parseMeters: function () {
        $(".sl-meter").each(function () {
            new SL.components.Meter($(this))
        })
    },
    parseSpinners: function () {
        SL.util.html.generateSpinners()
    },
    parseNotifications: function () {
        var t = $(".flash-notification");
        t.length && SL.notify(t.remove().text(), t.attr("data-notification-type"))
    },
    parseScrollLinks: function () {
        $(document).delegate("a[data-scroll-to]", "click", function (t) {
            var e = t.currentTarget, i = $(e.getAttribute("href")), n = parseInt(e.getAttribute("data-scroll-to-offset"), 10), s = parseInt(e.getAttribute("data-scroll-to-duration"), 10);
            isNaN(n) && (n = -20), isNaN(s) && (s = 1e3), i.length && $("html, body").animate({scrollTop: i.offset().top + n}, s), t.preventDefault()
        })
    }
});