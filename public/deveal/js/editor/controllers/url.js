SL("editor.controllers").URL = {
    init: function () {
        this.changed = new signals.Signal, setTimeout(this.read.bind(this), 1)
    }, 
    read: function () {
        var e = SL.util.getQuery();
        if("settings" === e.l){SL.view.sidebar.open("settings")}else{
            if("comments" === e.l){
                if(SL.view.collaboration){
                    SL.view.collaboration.expand();
                }
            }
        }
    }, 
    write: function () {
        if(window.history){
            if("function" == typeof window.history.replaceState){
                window.history.replaceState(null, SLConfig.deck.title, SL.routes.DECK_EDIT(SLConfig.deck.user.username, SLConfig.deck.slug));
            }
        }
        this.changed.dispatch();
    }
};