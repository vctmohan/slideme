SL("models").MediaTag = SL.models.Model.extend({
    init: function (t, e) {
        this._super(t), this.crud = $.extend({
            update: SL.config.AJAX_MEDIA_TAG_UPDATE,
            "delete": SL.config.AJAX_MEDIA_TAG_DELETE
        }, e)
    }, createFilter: function () {
        var t = this;
        return function (e) {
            return t.hasMedia(e)
        }
    }, hasMedia: function (t) {
        return -1 !== this.data.medias.indexOf(t.get("id"))
    }, addMedia: function (t) {
        this.hasMedia(t) || this.data.medias.push(t.get("id"))
    }, removeMedia: function (t) {
        for (var e = t.get("id"), i = 0; i < this.data.medias.length; i++)this.data.medias[i] === e && (this.data.medias.splice(i, 1), i--)
    }, clone: function () {
        return new SL.models.MediaTag(JSON.parse(JSON.stringify(this.data)))
    }, save: function (t) {
        var e = {tag: {}};
        return t ? t.forEach(function (t) {
            e.tag[t] = this.get(t)
        }.bind(this)) : e.tag = this.toJSON(), $.ajax({
            url: this.crud.update(this.get("id")),
            type: "PUT",
            data: e
        })
    }, destroy: function () {
        return $.ajax({url: this.crud["delete"](this.get("id")), type: "DELETE"})
    }
});