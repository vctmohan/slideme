SL("editor.controllers").Thumbnail = {
    init: function () {
        this.invalidated = false
    }, 
    generate: function () {
        $.ajax({
            type: "POST", 
            url: SL.config.AJAX_THUMBNAIL_DECK(SLConfig.deck.id)
        }); 
            this.invalidated = false
    }, 
    invalidate: function () {
        this.invalidated = true
    },
    isInvalidated: function () {
        return this.invalidated
    }
};