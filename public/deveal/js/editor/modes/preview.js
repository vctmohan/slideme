SL("editor.modes").Preview = SL.editor.modes.Base.extend({
    init: function (e) {
        this._super(e, "preview");
        if (! SL.editor.controllers.Capabilities.canPresent()) {
            $(".preview-controls-external").remove();
        }
    },
    activate: function () {
        Reveal.isOverview() && Reveal.toggleOverview(false);
        this.editor.disableEditing();
        this.editor.sidebar.close();
        SL.util.openLinksInTabs($(".reveal .slides"));
        this._super();
        Reveal.configure({
            progress: true,
            overview: false,
            touch: true,
            fragments: true,
            center: false,
            autoSlide: SLConfig.deck.auto_slide_interval || 0
        });
        var e = Reveal.getIndices();
        Reveal.slide(e.h, e.v, -1);
        $(document.activeElement).blur();
        if("string" == typeof SLConfig.deck.slug && SLConfig.deck.slug.length > 0){
            $(".preview-controls-external").show().attr("href", SL.routes.DECK_LIVE(SLConfig.deck.user.username, SLConfig.deck.slug));
        }else{
            $(".preview-controls-external").hide();
        }
    },
    deactivate: function () {
        this.editor.syncPageBackground();
        this.editor.enableEditing();
        this._super();
        Reveal.configure({
            progress: false,
            overview: true,
            touch: false,
            center: false,
            fragments: false,
            autoSlide: 0
        });
        SL.util.layoutReveal(500);
    }
});