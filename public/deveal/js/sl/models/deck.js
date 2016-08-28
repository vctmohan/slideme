SL("models").Deck = SL.models.Model.extend({
    init: function (t) {
        this.data = t || {};
        $.extend(this, this.data);
        this.user = new SL.models.User(this.data.user);
        this.user_settings = new SL.models.UserSettings(this.data.user.settings);
    }, isPro: function () {
        return this.data.user ? !!this.data.user.pro : false
    }, isVisibilityAll: function () {
        return this.get("visibility") === SL.models.Deck.VISIBILITY_ALL
    }, isVisibilitySelf: function () {
        return this.get("visibility") === SL.models.Deck.VISIBILITY_SELF
    }, isVisibilityTeam: function () {
        return this.get("visibility") === SL.models.Deck.VISIBILITY_TEAM
    }, belongsTo: function (t) {
        return this.get("user.id") === t.get("id")
    }, getURL: function (t) {
        t = $.extend({
            protocol: document.location.protocol,
            token: null,
            view: null
        }, t);
        var e = this.get("user.username"), i = this.get("slug") || this.get("id"), n = t.protocol + "//" + document.location.host + SL.routes.DECK(e, i);
        return t.view && (n += "/" + t.view), t.token && (n += "?token=" + t.token.get("token")), n
    }, clone: function () {
        return new SL.models.Deck(JSON.parse(JSON.stringify(this.data)))
    }
});
SL("models").Deck.VISIBILITY_SELF = "self";
SL("models").Deck.VISIBILITY_TEAM = "team";
SL("models").Deck.VISIBILITY_ALL = "all";