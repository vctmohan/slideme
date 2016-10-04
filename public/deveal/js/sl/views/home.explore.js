SL("views.home").Explore = SL.views.Base.extend({
    init: function () {
        this._super();
        new SL.components.Search({url: SL.config.AJAX_SEARCH});
    }
});