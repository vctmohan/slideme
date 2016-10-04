SL.util.validate = {
    name: function () {
        return []
    }, slug: function (t) {
        t = t || "";
        var e = [];
        return t.length < 2 && e.push("At least 2 characters"), /\s/gi.test(t) && e.push("No spaces please"), /^[\w-_]+$/gi.test(t) || e.push("Can only contain: A-Z, 0-9, - and _"), e
    }, username: function (t) {
        return SL.util.validate.slug(t)
    }, team_slug: function (t) {
        return SL.util.validate.slug(t)
    }, password: function (t) {
        t = t || "";
        var e = [];
        return t.length < 6 && e.push("At least 6 characters"), e
    }, email: function (t) {
        t = t || "";
        var e = [];
        return /^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$/gi.test(t) || e.push("Please enter a valid email"), e
    }, twitterhandle: function (t) {
        t = t || "";
        var e = [];
        return t.length > 15 && e.push("15 characters max"), /\s/gi.test(t) && e.push("No spaces please"), /^[\w-_]+$/gi.test(t) || e.push("Can only contain: A-Z, 0-9 and _"), e
    }, url: function (t) {
        t = t || "";
        var e = [];
        return t.length < 4 && e.push("Please enter a valid URL"), /\s/gi.test(t) && e.push("No spaces please"), e
    }, decktitle: function (t) {
        t = t || "";
        var e = [];
        return 0 === t.length && e.push("Can not be empty"), e
    }, deckslug: function (t) {
        t = t || "";
        var e = [];
        return 0 === t.length && e.push("Can not be empty"), e
    }, google_analytics_id: function (t) {
        t = t || "";
        var e = [];
        return /\bUA-\d{4,20}-\d{1,10}\b/gi.test(t) || e.push("Please enter a valid ID"), e
    }, none: function () {
        return []
    }
};