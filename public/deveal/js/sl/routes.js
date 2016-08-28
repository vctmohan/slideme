SL.routes = {
    PRICING: "/pricing",
    CHANGELOG: "/changelog",
    SIGN_IN: "/users/sign_in",
    SIGN_OUT: "/users/sign_out",
    BRAND_KIT: "/about#logo",
    SUBSCRIPTIONS_NEW: "/account/upgrade",
    SUBSCRIPTIONS_EDIT_CARD: "/account/update_billing",
    SUBSCRIPTIONS_EDIT_PERIOD: "/account/update_billing_period",
    USER: function (t) {
        return "/" + t
    },
    USER_EDIT: "/users/edit",
    DECK: function (t, e) {
        return "/" + t + "/" + e
    },
    DECK_NEW: function (t) {
        return "/" + t + "/new"
    },
    DECK_EDIT: function (t, e) {
        return "/" + t + "/" + e + "/edit"
    },
    DECK_REVIEW: function (t, e) {
        return "/" + t + "/" + e + "/review"
    },
    DECK_EMBED: function (t, e) {
        return "/" + t + "/" + e + "/embed"
    },
    DECK_LIVE: function (t, e) {
        return "/" + t + "/" + e + "/live"
    },
    THEME_EDITOR: "/themes",
    BILLING_DETAILS: "/account/billing",
    TEAM: function (t) {
        return window.location.protocol + "//" + t.get("slug") + "." + SL.config.APP_HOST
    },
    TEAM_EDIT: function (t) {
        return SL.routes.TEAM(t) + "/edit"
    },
    TEAM_EDIT_MEMBERS: function (t) {
        return SL.routes.TEAM(t) + "/edit_members"
    }
};