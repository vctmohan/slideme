SL("models").UserSettings = SL.models.Model.extend({
    init: function (t) {
        this._super(t), this.has("present_controls") || this.set("present_controls", SL.config.PRESENT_CONTROLS_DEFAULT), this.has("present_upsizing") || this.set("present_upsizing", SL.config.PRESENT_UPSIZING_DEFAULT)
    }, save: function (t) {
        var e = {user_settings: {}};
        return t ? t.forEach(function (t) {
            e.user_settings[t] = this.get(t)
        }.bind(this)) : e.user_settings = this.toJSON(), $.ajax({
            url: SL.config.AJAX_UPDATE_USER_SETTINGS,
            type: "PUT",
            data: e
        })
    }, clone: function () {
        return new SL.models.UserSettings(JSON.parse(JSON.stringify(this.data)))
    }
});