SL("collections").MediaTags = SL.collections.Loadable.extend({
    init: function (t, e, i) {
        this._super(t, e || SL.models.MediaTag, i || {
                list: SL.config.AJAX_MEDIA_TAG_LIST,
                create: SL.config.AJAX_MEDIA_TAG_CREATE,
                update: SL.config.AJAX_MEDIA_TAG_UPDATE,
                "delete": SL.config.AJAX_MEDIA_TAG_DELETE,
                add_media: SL.config.AJAX_MEDIA_TAG_ADD_MEDIA,
                remove_media: SL.config.AJAX_MEDIA_TAG_REMOVE_MEDIA
            }), this.associationChanged = new signals.Signal
    }, load: function () {
        this.isLoading() || (this.onLoadStarted(), $.ajax({
            type: "GET",
            url: this.crud.list,
            context: this
        }).done(function (t) {
            this.setData(t.results), this.onLoadCompleted()
        }).fail(function () {
            this.onLoadFailed()
        }))
    }, create: function (t, e) {
        return this._super($.extend({tag: {name: this.getUniqueName("Tag", "name", true)}}, t), e)
    }, addTagTo: function (t, e) {
        e.forEach(function (e) {
            t.addMedia(e)
        }), this.associationChanged.dispatch(t), $.ajax({
            type: "POST",
            url: this.crud.add_media(t.get("id")),
            context: this,
            data: {
                media_ids: e.map(function (t) {
                    return t.get("id")
                })
            }
        }).fail(function () {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
        })
    }, removeTagFrom: function (t, e) {
        e.forEach(function (e) {
            t.removeMedia(e)
        }), this.associationChanged.dispatch(t), $.ajax({
            type: "DELETE",
            url: this.crud.remove_media(t.get("id")),
            context: this,
            data: {
                media_ids: e.map(function (t) {
                    return t.get("id")
                })
            }
        }).fail(function () {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
        })
    }
});