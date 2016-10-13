SL("models").Template = SL.models.Model.extend({
    init: function (t) {
        this._super(t)
    }, isAvailableForTheme: function (t) {
        return t.hasSlideTemplate(this.get("id")) || this.isAvailableForAllThemes()
    }, isAvailableForAllThemes: function () {
        var t = this.get("id");
        return !SL.current_user.getThemes().some(function (e) {
            return e.hasSlideTemplate(t)
        })
    }
});