SL.popup = {
    items: [], singletons: [], open: function (t, e) {
        for (var i, n = 0; n < SL.popup.singletons.length; n++)if (SL.popup.singletons[n].factory === t) {
            i = SL.popup.singletons[n].instance;
            break
        }
        return i || (i = new t(e), i.isSingleton() && SL.popup.singletons.push({
            factory: t,
            instance: i
        })), i.open(e), SL.popup.items.push({
            instance: i,
            factory: t
        }), $("html").addClass("popup-open"), i
    }, openOne: function (t, e) {
        for (var i = 0; i < SL.popup.items.length; i++)if (t === SL.popup.items[i].factory)return SL.popup.items[i].instance;
        return this.open(t, e)
    }, close: function (t) {
        SL.popup.items.concat().forEach(function (e) {
            t && t !== e.factory || e.instance.close(true)
        })
    }, isOpen: function (t) {
        for (var e = 0; e < SL.popup.items.length; e++)if (!t || t === SL.popup.items[e].factory)return true;
        return false
    }, unregister: function (t) {
        for (var e = 0; e < SL.popup.items.length; e++)SL.popup.items[e].instance === t && (removedValue = SL.popup.items.splice(e, 1), e--);
        0 === SL.popup.items.length && $("html").removeClass("popup-open")
    }
};