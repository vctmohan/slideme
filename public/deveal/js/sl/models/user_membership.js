SL("models").UserMembership = SL.models.Model.extend({
    init: function (t) {
        this._super(t)
    }, isAdmin: function () {
        return this.get("role") === SL.models.UserMembership.ROLE_ADMIN
    }, isOwner: function () {
        return this.get("role") === SL.models.UserMembership.ROLE_OWNER
    }, clone: function () {
        return new SL.models.UserMembership(JSON.parse(JSON.stringify(this.data)))
    }
});
SL.models.UserMembership.ROLE_OWNER = "owner";
SL.models.UserMembership.ROLE_ADMIN = "admin";
SL.models.UserMembership.ROLE_MEMBER = "member";