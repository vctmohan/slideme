SL.util.string = {
    URL_REGEX: /((https?\:\/\/)|(www\.)|(\/\/))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i,
    SCRIPT_TAG_REGEX: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    uniqueIDCount: 0,
    uniqueID: function (t) {
        return SL.util.string.uniqueIDCount += 1, (t || "") + SL.util.string.uniqueIDCount + "-" + Date.now()
    },
    slug: function (t) {
        return "string" == typeof t ? (t = SL.util.string.trim(t), t = t.toLowerCase(), t = t.replace(/-/g, " "), t = t.replace(/[^\w\s]/g, ""), t = t.replace(/\s{2,}/g, " "), t = t.replace(/\s/g, "-")) : ""
    },
    trim: function (t) {
        return SL.util.string.trimRight(SL.util.string.trimLeft(t))
    },
    trimLeft: function (t) {
        return "string" == typeof t ? t.replace(/^\s+/, "") : ""
    },
    trimRight: function (t) {
        return "string" == typeof t ? t.replace(/\s+$/, "") : ""
    },
    linkify: function (t) {
        return t && (t = t.replace(/((https?\:\/\/)|(www\.))(\S+)(\w{2,4})(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi, function (t) {
            var e = t;
            return e.match("^https?://") || (e = "http://" + e), '<a href="' + e + '">' + t + "</a>"
        })), t
    },
    pluralize: function (t, e, i) {
        return i ? t + e : t
    },
    getCustomClassesFromLESS: function (t) {
        var e = (t || "").match(/\/\/=[a-z0-9-_ \t]{2,}(?=\n)?/gi);
        return e ? e.map(function (t) {
            return t = t.replace("//=", ""), t = t.trim(), t = t.toLowerCase(), t = t.replace(/\s/g, "-")
        }) : []
    }
};