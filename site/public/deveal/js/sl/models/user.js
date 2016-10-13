SL("models").User = Class.extend({
    init: function (t) {
        this.data = t || {};
        $.extend(this, this.data);
        this.settings = new SL.models.UserSettings(this.data.settings);
        if(this.data.membership){
            this.membership = new SL.models.UserMembership(this.data.membership);
        }
    }, isPro: function () {
        return !!this.pro
    }, isEnterprise: function () {
        return !!this.enterprise
    }, isEnterpriseManager: function () {
        return this.hasMembership() && (this.membership.isAdmin() || this.membership.isOwner())
    }, hasMembership: function () {
        return !!this.membership
    }, isMemberOfCurrentTeam: function () {
        return SL.current_team && SL.current_team.get("id") === this.get("team_id") ? true : false
    }, isManuallyUpgraded: function () {
        return !!this.manually_upgraded
    }, get: function (t) {
        return this[t]
    }, set: function (t, e) {
        this[t] = e
    }, has: function (t) {
        var e = this.get(t);
        return !!e || e === false || 0 === e
    }, hasThemes: function () {
        return SL.current_team ? SL.current_team.hasThemes() : void 0
    }, getThemes: function () {
        return SL.current_team ? SL.current_team.get("themes") : new SL.collections.Collection
    }, hasDefaultTheme: function () {
        return !!this.getDefaultTheme()
    }, getDefaultTheme: function () {
        var t = this.getThemes();
        return t.getByProperties(SL.current_team ? {id: SL.current_team.get("default_theme_id")} : {id: this.default_theme_id})
    }, getProfileURL: function () {
        return "/" + this.username
    }, getProfilePictureURL: function () {
        return this.thumbnail_url
    }, getNameOrSlug: function () {
        return this.name || this.username
    }
});