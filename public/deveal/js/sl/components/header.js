SL("components").Header = Class.extend({
    init: function () {
        this.domElement = $(".global-header");
        this.renderLogo();
        this.renderDropdown();
        this.bind();
    }, 
    renderLogo: function () {
        if ("/" === window.location.pathname) {
            var t = this.domElement.find(".logo-animation");
            t.length && new SL.components.Menu({
                anchor: t,
                anchorSpacing: 10,
                alignment: "b",
                showOnHover: true,
                options: [{label: "Download logo", url: SL.routes.BRAND_KIT}]
            })
        }
    }, renderDropdown: function () {
        this.dropdown = SL.components.Header.createMainMenu(this.domElement.find(".profile-button .nav-item-anchor"))
    }, bind: function () {
        this.domElement.hasClass("show-on-scroll") && ($(document).on("mousemove", this.onDocumentMouseMove.bind(this)), $(window).on("scroll", this.onWindowScroll.bind(this)))
    }, onWindowScroll: function () {
        this.isScrolledDown = $(window).scrollTop() > 30, this.domElement.toggleClass("show", this.isScrolledDown)
    }, onDocumentMouseMove: function (t) {
        if (!this.isScrolledDown) {
            var e = t.clientY;
            e > 0 && (20 > e && !this.isMouseOver ? (this.domElement.addClass("show"), this.isMouseOver = true) : e > 80 && this.isMouseOver && 0 === $(t.target).parents(".global-header").length && (this.domElement.removeClass("show"), this.isMouseOver = false))
        }
    }
});

SL.components.Header.createMainMenu = function (t) {
    var e = [{
        label: "Profile",
        icon: "home",
        url: SL.routes.USER(SL.current_user.get("username"))
    }, {
        label: "New deck",
        icon: "plus",
        url: SL.routes.DECK_NEW(SL.current_user.get("username"))
    }];
    if (SL.current_user.isEnterpriseManager()) {
        e.push({label: "Themes", icon: "brush", url: SL.routes.THEME_EDITOR});
        var i = {label: "Settings", icon: "cog", url: SL.routes.USER_EDIT};
        SL.current_team && (i.submenu = [{
            label: "Account settings",
            url: SL.routes.USER_EDIT
        }, {
            label: "Team settings",
            url: SL.routes.TEAM_EDIT(SL.current_team)
        }, {
            label: "Team members",
            url: SL.routes.TEAM_EDIT_MEMBERS(SL.current_team)
        }], SL.current_team.isManuallyUpgraded() || i.submenu.push({
            label: "Billing details",
            url: SL.routes.BILLING_DETAILS
        })), e.push(i)
    } else e.push({label: "Settings", icon: "cog", url: SL.routes.USER_EDIT});

    var n = $(".global-header .nav-item-changelog");
    return n.length && (e.push({
        label: "What's new",
        url: SL.routes.CHANGELOG,
        iconHTML: '<span class="counter"><span class="counter-inner">' + n.attr("data-unread-count") + "</span></span>"
    }), t.find(".nav-item-burger").append('<span class="changelog-indicator"></span>'), t.one("mouseover", function () {
        $(this).find(".changelog-indicator").remove()
    })), e.push({
        label: "Log out",
        icon: "exit",
        url: SL.routes.SIGN_OUT,
        attributes: {rel: "nofollow", "data-method": "delete"}
    }), new SL.components.Menu({
        anchor: t,
        anchorSpacing: 10,
        alignment: "auto",
        minWidth: 160,
        showOnHover: true,
        options: e
    })
};