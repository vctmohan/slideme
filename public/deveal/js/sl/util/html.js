SL.util.html = {
    indent: function (t) {
        t = t.replace(/<br>/gi, "<br/>"), t = t.replace(/(<img("[^"]*"|[^>])+)/gi, "$1/");
        var e = vkbeautify.xml(t);
        return e = e.replace(/<pre>[\n\r\t\s]+<code/gi, "<pre><code"), e = e.replace(/<\/code>[\n\r\t\s]+<\/pre>/gi, "</code></pre>")
    },
    ATTR_SRC_NORMAL: "src",
    ATTR_SRC_SILENCED: "data-silenced-src",
    ATTR_SRC_NORMAL_REGEX: " src=",
    ATTR_SRC_SILENCED_REGEX: " data-silenced-src=",
    muteSources: function (t) {
        return (t || "").replace(new RegExp(SL.util.html.ATTR_SRC_NORMAL_REGEX, "gi"), SL.util.html.ATTR_SRC_SILENCED_REGEX)
    },
    unmuteSources: function (t) {
        return (t || "").replace(new RegExp(SL.util.html.ATTR_SRC_SILENCED_REGEX, "gi"), SL.util.html.ATTR_SRC_NORMAL_REGEX)
    },
    trimCode: function (t) {
        $(t).find("pre code").each(function () {
            var t = $(this).parent("pre"), e = t.html(), i = $.trim(e);
            e !== i && t.html(i)
        })
    },
    removeAttributes: function (t, e) {
        t = $(t);
        var i = $.map(t.get(0).attributes, function (t) {
            return t.name
        });
        "function" == typeof e && (i = i.filter(e)), $.each(i, function (e, i) {
            t.removeAttr(i)
        })
    },
    removeClasses: function (t, e) {
        if (t = $(t), "function" == typeof e) {
            var i = (t.attr("class") || "").split(" ").filter(e);
            t.removeClass(i.join(" "))
        } else t.attr("class", "")
    },
    findScriptTags: function (t) {
        var e = document.createElement("div");
        e.innerHTML = t;
        var i = SL.util.toArray(e.getElementsByTagName("script"));
        return i.map(function (t) {
            return t.outerHTML
        })
    },
    removeScriptTags: function (t) {
        var e = document.createElement("div");
        e.innerHTML = t;
        var i = SL.util.toArray(e.getElementsByTagName("script"));
        return i.forEach(function (t) {
            t.parentNode.removeChild(t)
        }), e.innerHTML
    },
    createSpinner: function (t) {
        return t = $.extend({
            lines: 12,
            radius: 8,
            length: 6,
            width: 3,
            color: "#fff",
            zIndex: "auto",
            left: "0",
            top: "0",
            className: ""
        }, t), new Spinner(t)
    },
    generateSpinners: function () {
        $(".spinner").each(function (t, e) {
            if (e.hasAttribute("data-spinner-state") === false) {
                e.setAttribute("data-spinner-state", "spinning");
                var i = {};
                e.hasAttribute("data-spinner-color") && (i.color = e.getAttribute("data-spinner-color")), e.hasAttribute("data-spinner-lines") && (i.lines = parseInt(e.getAttribute("data-spinner-lines"), 10)), e.hasAttribute("data-spinner-width") && (i.width = parseInt(e.getAttribute("data-spinner-width"), 10)), e.hasAttribute("data-spinner-radius") && (i.radius = parseInt(e.getAttribute("data-spinner-radius"), 10)), e.hasAttribute("data-spinner-length") && (i.length = parseInt(e.getAttribute("data-spinner-length"), 10));
                var n = SL.util.html.createSpinner(i);
                n.spin(e)
            }
        })
    },
    createDeckThumbnail: function (t) {
        var t = {
            DECK_URL: t.user.username + "/" + t.slug,
            DECK_VIEWS: "number" == typeof t.view_count ? t.view_count : "N/A",
            DECK_THUMB_URL: t.thumbnail_url || SL.config.DEFAULT_DECK_THUMBNAIL,
            USER_URL: "/" + t.user.username,
            USER_NAME: t.user.name || t.user.username,
            USER_THUMB_URL: t.user.thumbnail_url || SL.config.DEFAULT_USER_THUMBNAIL
        }, e = SL.config.DECK_THUMBNAIL_TEMPLATE;
        for (var i in t)e = e.replace("{{" + i + "}}", t[i]);
        return $(e)
    }
};