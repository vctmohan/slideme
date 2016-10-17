SL("editor.modes").Arrange = SL.editor.modes.Base.extend({
    init: function (e) {
        this._super(e, "arrange")
    }, bind: function () {
        Reveal.addEventListener("overviewshown", this.onRevealOverviewShown.bind(this)), Reveal.addEventListener("overviewhidden", this.onRevealOverviewHidden.bind(this))
    }, activate: function (e) {
        this.active = true, e || Reveal.toggleOverview(true), this.editor.disableEditing(), this.editor.sidebar.updateArrangeButton("arranging");
        var t = ['<div class="arrange-controls editing-ui">', '<div class="arrange-control move-left i-arrow-left-alt1"></div>', '<div class="arrange-control move-right i-arrow-right-alt1"></div>', '<div class="arrange-control move-up i-arrow-up-alt1"></div>', '<div class="arrange-control move-down i-arrow-down-alt1"></div>', '<div class="arrange-control merge-left i-previous" data-tooltip-delay="500"></div>', '<div class="arrange-control merge-right i-next" data-tooltip-delay="500"></div>', "</div>"].join("");
        $(".reveal .slides section:not(.stack)").append(t).addClass("disabled"), $(".reveal .slides section.stack").each(function (e, t) {
            0 === $(t).find(".present").length && $(t).find("section").first().addClass("present")
        });
        $(".reveal .slides section .arrange-controls").on("click", this.onControlsClicked.bind(this));
        $(".reveal .slides section .move-left").on("click", this.onMoveSlideLeft.bind(this));
        $(".reveal .slides section .move-right").on("click", this.onMoveSlideRight.bind(this));
        $(".reveal .slides section .move-up").on("click", this.onMoveSlideUp.bind(this));
        $(".reveal .slides section .move-down").on("click", this.onMoveSlideDown.bind(this));
        $(".reveal .slides section .merge-left").on("click", this.onMergeLeft.bind(this));
        $(".reveal .slides section .merge-right").on("click", this.onMergeRight.bind(this));
        $(document.activeElement).blur();
        this._super();
    }, deactivate: function (e) {
        this.active = false, e || Reveal.toggleOverview(false), this.editor.enableEditing(), this.editor.sidebar.updateArrangeButton(), $(".reveal .slides section:not(.stack)").removeClass("disabled"), $(".reveal .slides section .arrange-controls").remove(), this._super()
    }, afterSlidesChanged: function () {
        SL.editor.controllers.Markup.afterSlidesChanged()
    }, onRevealOverviewShown: function () {
        this.isActive() || (SL.editor.controllers.Mode.clear(), this.activate(true))
    }, onRevealOverviewHidden: function () {
        this.isActive() && this.deactivate(true)
    }, onControlsClicked: function (e) {
        $(e.target).hasClass("arrange-controls") && $(e.target).parent("section").removeClass("disabled").trigger("click")
    }, onMoveSlideLeft: function (e) {
        var t = $(e.target).parents("section").first();
        t.parents("section.stack").length && (t = t.parents("section.stack"));
        var i = t.prev();
        t.length && i.length && (t.after(i), Reveal.sync(), Reveal.slide(t.index()), this.afterSlidesChanged())
    }, onMoveSlideRight: function (e) {
        var t = $(e.target).parents("section").first();
        t.parents("section.stack").length && (t = t.parents("section.stack"));
        var i = t.next();
        t.length && i.length && (t.before(i), Reveal.sync(), Reveal.slide(t.index()), this.afterSlidesChanged())
    }, onMoveSlideUp: function (e) {
        var t = $(e.target).parents("section").first(), i = t.prev();
        t.length && i.length && (t.after(i), Reveal.sync(), Reveal.slide(t.parents("section.stack").index(), t.index()), this.afterSlidesChanged())
    }, onMoveSlideDown: function (e) {
        var t = $(e.target).parents("section").first(), i = t.next();
        t.length && i.length && (t.before(i), Reveal.sync(), Reveal.slide(t.parents("section.stack").index(), t.index()), this.afterSlidesChanged())
    }, onMergeLeft: function (e) {
        var t = $(e.target).parents("section").first(), i = t.prev();
        if (t.parents("section.stack").prev().length && (i = t.parents("section.stack").prev()), t.length) {
            t.parents("section.stack").length ? t.insertBefore(t.parents("section.stack")) : i.is("section.stack") ? i.prepend(t) : SL.editor.controllers.Markup.mergeHorizontalSlides(i, t), SL.editor.controllers.Markup.unwrapEmptyStacks();
            var n = Reveal.getIndices(t.get(0));
            Reveal.sync(), Reveal.slide(n.h, n.v), this.afterSlidesChanged()
        }
    }, onMergeRight: function (e) {
        var t = $(e.target).parents("section").first(), i = t.next();
        if (t.parents("section.stack").next().length && (i = t.parents("section.stack").next()), t.length) {
            t.parents("section.stack").length ? t.insertAfter(t.parents("section.stack")) : i.is("section.stack") ? i.prepend(t) : SL.editor.controllers.Markup.mergeHorizontalSlides(i, t), SL.editor.controllers.Markup.unwrapEmptyStacks();
            var n = Reveal.getIndices(t.get(0));
            Reveal.sync(), Reveal.slide(n.h, n.v), this.afterSlidesChanged()
        }
    }
});