SL("collections").Media = SL.collections.Loadable.extend({
    init: function (t, e, i) {
        this._super(t, e || SL.models.Media, i || {
                list: SL.config.AJAX_MEDIA_LIST,
                update: SL.config.AJAX_MEDIA_UPDATE,
                create: SL.config.AJAX_MEDIA_CREATE,
                "delete": SL.config.AJAX_MEDIA_DELETE
            })
    }, load: function () {
        this.isLoading() || (this.page = 1, this.pagedResults = [], this.onLoadStarted(), this.loadNextPage())
    }, loadNextPage: function () {
        1 === this.page || this.page <= this.totalPages ? $.ajax({
            type: "GET",
            url: this.crud.list + "?page=" + this.page,
            context: this
        }).done(function (t) {
            this.totalPages || (this.totalPages = Math.ceil(t.total / t.results.length)), this.pagedResults = this.pagedResults.concat(t.results), this.page += 1, this.loadNextPage()
        }).fail(function () {
            this.onLoadFailed()
        }) : (this.setData(this.pagedResults), this.onLoadCompleted())
    }, createSearchFilter: function (t) {
        if (!t || "" === t)return function () {
            return false
        };
        var e = new RegExp(t, "i");
        return function (t) {
            return e.test(t.get("label"))
        }
    }, getImages: function () {
        return this.filter(SL.models.Media.IMAGE.filter)
    }, getVideos: function () {
        return this.filter(SL.models.Media.VIDEO.filter)
    }
});