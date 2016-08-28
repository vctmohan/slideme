!function (t) {
    var e = {};
    e.sync = function () {
        $("[data-placement]").each(function () {
            var t = $(this), i = t.attr("data-placement");
            "function" == typeof e[i] ? e[i](t) : console.log('No matching layout found for "' + i + '"')
        })
    }, e.hcenter = function (t) {
        var e = t.parent();
        e && t.css("left", (e.width() - t.outerWidth()) / 2)
    }, e.vcenter = function (t) {
        var e = t.parent();
        e && t.css("top", (e.height() - t.outerHeight()) / 2)
    }, e.center = function (t) {
        var e = t.parent();
        if (e) {
            var i = e.width(), n = e.height(), s = t.outerWidth(), o = t.outerHeight();
            t.css({left: (i - s) / 2, top: (n - o) / 2})
        }
    }, e.sync(), $(t).on("resize", e.sync), t.Placement = e
}(window);

$(function () {
    function init() {
        loader();
        SL.helpers.PageLoader.hide();
        SL.settings.init();
        SL.keyboard.init();
        SL.pointer.init();
        SL.warnings.init();
        SL.draganddrop.init();
        SL.fonts.init();
        SL.visibility.init();
        if ("undefined" == typeof SLConfig) {
            window.SLConfig = {};
        }
        current_objects();
        set_view();
    }

    function loader() {
        var t = $("html");
        t.addClass("loaded");
        if (SL.util.device.HAS_TOUCH) {
            t.addClass("touch");
        }

        if (SL.util.device.isMac()) {
            t.addClass("ua-mac")
        } else {
            if (SL.util.device.isWindows()) {
                t.addClass("ua-windows");
            } else {
                if (SL.util.device.isLinux()) {
                    t.addClass("ua-linux")
                }
            }
        }

        if (SL.util.device.isChrome()) {
            t.addClass("ua-chrome")
        } else {
            if (SL.util.device.isSafari()) {
                t.addClass("ua-safari")
            } else {
                if (SL.util.device.isFirefox()) {
                    t.addClass("ua-firefox")
                } else {
                    if (SL.util.device.isIE()) {
                        t.addClass("ua-ie");
                    }
                }
            }
        }

        if (SL.util.device.getScrollBarWidth() > 0) {
            t.addClass("has-visible-scrollbars");
        }
    }

    function current_objects() {
        if ("object" == typeof window.SLConfig) {
            if (SLConfig.deck && !SLConfig.deck.notes) {
                SLConfig.deck.notes = {};
            }

            SL.current_user = new SL.models.User(SLConfig.current_user);
            if ("object" == typeof SLConfig.deck) {
                SL.current_deck = new SL.models.Deck(SLConfig.deck);
            }

            if ("object" == typeof SLConfig.team) {
                SL.current_team = new SL.models.Team(SLConfig.team);
            }
        }
    }

    function set_view() {
        var t = $("html");
        SL.util.hideAddressBar();

        SL.view = new SL.views.Base;
        if (t.hasClass("home index")) {
            SL.view = new SL.views.home.Index;
        }
        if (t.hasClass("home explore")) {
            SL.view = new SL.views.home.Explore;
        }
        if (t.hasClass("users show")) {
            SL.view = new SL.views.users.Show;
        }

        if (t.hasClass("decks show")) {
            SL.view = new SL.views.decks.Show;
        }

        if (t.hasClass("decks edit")) {
            SL.view = new SL.editor.Editor;
        }

        if (t.hasClass("decks edit-requires-upgrade")) {
            SL.view = new SL.views.decks.EditRequiresUpgrade;
        }

        if (t.is(".decks.live-client")) {
            SL.view = new SL.views.decks.LiveClient;
        }

        if (t.is(".decks.live-server")) {
            SL.view = new SL.views.decks.LiveServer;
        }

        if (t.hasClass("decks speaker")) {
            SL.view = new SL.views.decks.Speaker;
        }

        if (t.hasClass("decks export")) {
            SL.view = new SL.views.decks.Export;
        }

        if (t.hasClass("decks fullscreen")) {
            SL.view = new SL.views.decks.Fullscreen;
        }

        if (t.hasClass("decks review")) {
            SL.view = new SL.views.decks.Review;
        }

        if (t.hasClass("decks password")) {
            SL.view = new SL.views.decks.Password;
        }

        if (t.hasClass("teams-subscriptions-show")) {
            SL.view = new SL.views.teams.subscriptions.Show;
        }

        if (t.hasClass("registrations") && (t.hasClass("edit") || t.hasClass("update"))) {
            SL.view = new SL.views.devise.Edit;
        }


        if (t.hasClass("registrations") || t.hasClass("team_registrations") || t.hasClass("sessions") || t.hasClass("passwords") || t.hasClass("invitations show")) {
            SL.view = new SL.views.devise.All;
        }

        if (t.hasClass("subscriptions new") || t.hasClass("subscriptions edit")) {
            SL.view = new SL.views.subscriptions.New;
        }

        if (t.hasClass("subscriptions show")) {
            SL.view = new SL.views.subscriptions.Show;
        }

        if (t.hasClass("subscriptions edit_period")) {
            SL.view = new SL.views.subscriptions.EditPeriod;
        }

        if (t.hasClass("teams-reactivate")) {
            SL.view = new SL.views.teams.subscriptions.Reactivate;
        }

        if (t.hasClass("teams-signup")) {
            SL.view = new SL.views.teams.New;
        }

        if (t.hasClass("teams edit")) {
            SL.view = new SL.views.teams.teams.Edit;
        }

        if (t.hasClass("teams edit_members")) {
            SL.view = new SL.views.teams.teams.EditMembers;
        }
        if (t.hasClass("teams show")) {
            SL.view = new SL.views.teams.teams.Show;
        }
        if (t.hasClass("themes edit")) {
            SL.view = new SL.views.themes.Edit;
        }
        if (t.hasClass("themes preview")) {
            SL.view = new SL.views.themes.Preview;
        }
        if (t.hasClass("static")) {
            SL.view = new SL.views.statik.All;
        }

        Placement.sync();
    }

    setTimeout(init, 1)


    /*var templates = new Templates;

     $(".add-horizontal-slide").click(function (e) {
     e.preventDefault();
     templates.show({
     anchor: $(".add-horizontal-slide"),
     alignment: "r"
     });
     });

     $(".add-vertical-slide").click(function (e) {
     e.preventDefault();
     templates.show({
     anchor: $(".add-vertical-slide"),
     alignment: "b"
     });
     });

     $(".template-item").click(function (e) {
     e.preventDefault();
     var template_model = $(this).find('section')[0].outerHTML;
     alignment = $(".sl-templates").attr("data-alignment");
     if(alignment == "b"){
     Markup.addVerticalSlide(template_model);
     }else{
     Markup.addHorizontalSlide(template_model);
     }


     });

     $(".sl-templates").click(function (e) {
     e.preventDefault();
     templates.hide();
     });*/

});

