SL("editor.controllers").Markup = {
    init: function (e) {
        this.editor = e, this.slidesChanged = new signals.Signal
    }, getCurrentSlide: function () {
        return $(Reveal.getCurrentSlide())
    }, getCurrentHorizontalSlide: function () {
        var e = $(Reveal.getCurrentSlide());
        return e.parent("section.stack").length && (e = e.parent("section.stack")), e
    }, getFocusedSlide: function () {
        return $(".reveal .slides .present[contenteditable]:focus")
    }, addHorizontalSlide: function (e) {
        e = e || "<section></section>";
        var t = SLConfig.deck.rtl ? "past" : "future";
        i = $(e);
        return i.is("section") ? (SL.editor.controllers.Blocks.blur(), i.addClass(t), i.insertAfter(this.getCurrentHorizontalSlide()), Reveal.slide(), Reveal.sync(), SL.editor.controllers.Blocks.sync(), SLConfig.deck.rtl ? setTimeout(Reveal.navigateLeft, 1) : setTimeout(Reveal.navigateRight, 1), SL.data.templates.layoutTemplate(i), this.afterSlidesChanged(), i) : void 0
    }, addVerticalSlide: function (e) {
        e = e || "<section></section>";
        var t = this.getCurrentHorizontalSlide();
        t.hasClass("stack") || (t = t.wrap('<section class="present">').parent(), t.addClass("stack"));
        var i = $(e);
        if (i.is("section")) {
            var n = Reveal.getIndices();
            SL.editor.controllers.Blocks.blur(), i.addClass("future");
            var r = t.find("section.present");
            return r.length ? i.insertAfter(r) : t.append(i), Reveal.slide(n.h, n.v), SL.editor.controllers.Blocks.sync(), this.editor.navigateToSlide(i.get(0)), this.editor.navigateToSlide(i.get(0)), Reveal.sync(), SL.data.templates.layoutTemplate(i), this.afterSlidesChanged(), i
        }
    }, replaceCurrentSlide: function (e) {
        e = e || "<section></section>";
        var t = SL.editor.controllers.Markup.getCurrentSlide(), i = $(e);
        return i.is("section") ? (i.addClass("present"), t.replaceWith(i), Reveal.slide(), Reveal.sync(), SL.editor.controllers.Blocks.sync(), SL.data.templates.layoutTemplate(i), SL.util.deck.afterSlidesChanged(), i) : void 0
    }, mergeHorizontalSlides: function (e, t) {
        e.length && t.length && (stack = e.wrap('<section class="present">').parent(), stack.addClass("stack"), stack.append(t), SL.editor.controllers.Blocks.sync(), Reveal.sync(), SL.util.deck.afterSlidesChanged())
    }, unwrapEmptyStacks: function () {
        $(".reveal .slides section.stack").each(function () {
            var e = $(this);
            1 === e.find(">section").length && e.find(">section").first().unwrap()
        })
    }, removeCurrentSlide: function () {
        var e = Reveal.getIndices();
        $(".reveal .slides .present .present").remove().length > 0 ? 1 === $(".reveal .slides .present>section").length && $(".reveal .slides .present>section:eq(0)").unwrap() : $(".reveal .slides>section").length > 1 && $(".reveal .slides>.present").remove(), Reveal.slide(e.h, e.v), Reveal.sync(), this.afterSlidesChanged(), SL.analytics.trackEditor("Remove slide")
    }, writeHTMLToCurrentSlide: function (e) {
        Reveal.getCurrentSlide().innerHTML = e, SL.util.html.trimCode(Reveal.getCurrentSlide()), SL.editor.controllers.Blocks.sync(), SL.editor.controllers.Blocks.discoverBlockPairs()
    }, replaceHTML: function (e) {
        SL.util.deck.replaceHTML(e), SL.editor.controllers.Blocks.sync(), this.afterSlidesChanged()
    }, importSlides: function (e, t) {
        if (e = $(e), e && e.length) {
            var i = $(".reveal .slides");
            t && i.empty(), e.each(function (e, t) {
                this.importSlide(t, i)
            }.bind(this)), Reveal.sync(), Reveal.slide(0, 0), SL.editor.controllers.Blocks.sync(), this.afterSlidesChanged()
        }
    }, importSlide: function (e, t) {
        if (e = $(e), t = $(t), t.append(e), e.css("display", "block"), e.find(">section").length)e.find(">section").each(function (t, i) {
            this.importSlide(i, e)
        }.bind(this)); else {
            var i = [], n = [];
            e.children().each(function () {
                var e = $(this);
                if (e.is(".sl-block"))i.push(e.remove().prop("outerHTML")); else if ("absolute" === e.css("position")) {
                    var t = e.position(), r = {width: e.outerWidth(), x: t.left, y: t.top};
                    e.css({
                        position: "relative",
                        top: "",
                        right: "",
                        bottom: "",
                        left: ""
                    }), r.html = e.prop("outerHTML"), n.push(r), e.remove()
                }
            }), n.push({html: e.html(), width: SL.config.SLIDE_WIDTH}), e.empty(), n.forEach(function (t) {
                if (t.html.trim().length > 0) {
                    SL.editor.controllers.Blocks.add({
                        type: "text",
                        slide: e,
                        silent: true,
                        width: t.width,
                        x: t.x,
                        y: t.y,
                        afterInit: function (e) {
                            e.setCustomHTML(t.html)
                        }
                    })
                }
            }), i.forEach(function (t) {
                e.append(t)
            })
        }
        e.css("display", ""), SL.util.deck.generateIdentifiers(e);
        var r = e.attr("data-id"), o = e.find("aside.notes");
        if (o.length) {
            var s = o.text().trim().substr(0, SL.config.SPEAKER_NOTES_MAXLENGTH);
            s && s.length > 1 && (SLConfig.deck.notes[r] = s, o.remove())
        }
    }, afterSlidesChanged: function () {
        SL.util.deck.afterSlidesChanged(), this.slidesChanged.dispatch()
    }
};