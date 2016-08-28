SL("editor.controllers").Serialize = {
    slideCache: {}, init: function () {
        setInterval(function () {
            delete SL.editor.controllers.Serialize.slideCache, SL.editor.controllers.Serialize.slideCache = {}
        }, 18e4)
    }, getDeckAsString: function (e) {
        var t = SL.util.html.muteSources($(".reveal .slides").html()), i = $("<div>");
        i.get(0).innerHTML = t, i.find(">.backgrounds").remove();
        var n = i.find(">section").map(function (t, i) {
            if (i = $(i), i.hasClass("stack")) {
                var n = i.find(">section").map(function (t, i) {
                    return this.formatSlideForSave(i, e).get(0).outerHTML
                }.bind(this)).toArray().join("");
                i = this.formatSlideForSave(i.empty(), e);
                var r = $.map(i.get(0).attributes, function (e) {
                    return e.name + '="' + e.value + '"'
                }).join(" ");
                return "<section " + r + ">" + n + "</section>"
            }
            return this.formatSlideForSave(i, e).get(0).outerHTML
        }.bind(this)).toArray().join(""), r = SL.util.html.unmuteSources(n);
        return r = r.trim()
    }, getSlideAsString: function (e, t) {
        t = $.extend({inner: false}, t), e = $(e), e.find("section").length && (e = e.find("section").first());
        var i = SL.util.html.muteSources(e.prop("outerHTML"));
        e = $(i), e = this.formatSlideForSave(e, t);
        var n = SL.util.html.unmuteSources(e.prop(t.inner ? "innerHTML" : "outerHTML"));
        return n
    }, getFirstSlideAsString: function (e) {
        return this.getSlideAsString($(".reveal .slides section").first(), e)
    }, formatSlideForSave: function (e, t) {
        t = $.extend({
            exclude: null,
            templatize: false,
            removeSlideIds: false,
            removeBlockIds: false,
            removeTextPlaceholders: false,
            lazy: true
        }, t), e = $(e);
        var i = e.get(0).outerHTML + JSON.stringify(t), n = SL.editor.controllers.Serialize.slideCache[i];
        if (n && n.length)return n;
        if ((t.templatize || t.removeSlideIds) && e.removeAttr("data-id"), (t.templatize || t.removeBlockIds) && e.find("[data-block-id]").removeAttr("data-block-id"), t.removeTextPlaceholders && (e.find("[data-placeholder-tag]").removeAttr("data-placeholder-tag"), e.find("[data-placeholder-text]").removeAttr("data-placeholder-text")), t.exclude && e.find(t.exclude).remove(), SL.util.html.removeAttributes(e, function (e) {
                return /(style|contenteditable|hidden|aria-hidden|data\-index\-.|data\-previous\-indexv)/gi.test(e)
            }), SL.util.html.trimCode(e), e.removeClass(SL.config.RESERVED_SLIDE_CLASSES.join(" ")), "" === e.attr("class") && e.get(0).removeAttribute("class"), e.find(".fragment").removeClass("visible"), t.lazy) {
            var r = SL.util.html.ATTR_SRC_SILENCED;
            e.find("iframe[" + r + "], img[" + r + "], video[" + r + "], audio[" + r + "]").each(function () {
                this.setAttribute("data-src", this.getAttribute(SL.util.html.ATTR_SRC_SILENCED)), this.removeAttribute(SL.util.html.ATTR_SRC_SILENCED)
            })
        }
        return e.find(".navigate-up, .navigate-right, .navigate-down, .navigate-left, .navigate-next, .navigate-prev").removeClass("enabled"), e.find(".editing-ui").remove(), e.find("*:not(iframe)").contents().each(function () {
            8 === this.nodeType && $(this).remove()
        }), e.find("a[data-cke-saved-href]").each(function () {
            this.removeAttribute("data-cke-saved-href")
        }), e.find(".sl-block, .sl-block-content").each(function (e, t) {
            t = $(t), SL.util.html.removeClasses(t, function (e) {
                return /(is\-focused|is\-editing|^visible|is\-text\-overflowing|^cke_)/gi.test(e)
            }), SL.util.html.removeAttributes(t, function (e) {
                return /(contenteditable|tabindex|spellcheck|role|title|aria\-.)/gi.test(e)
            })
        }), e.find('.sl-block[data-block-type="table"]').each(function (e, t) {
            t = $(t), t.find("table .context-menu-is-open").removeClass("context-menu-is-open"), t.find('table [class=""]').removeAttr("class"), t.find('table [style=""]').removeAttr("style"), t.find("td [contenteditable], th [contenteditable]").each(function (e, t) {
                t.parentNode.innerHTML = t.innerHTML
            })
        }), e.find('.sl-block[data-block-type="image"] img').css("display", ""), SL.editor.controllers.Serialize.slideCache[i] = e, e
    }
};