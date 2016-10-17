SL("editor.modes").Fragment = SL.editor.modes.Base.extend({
    init: function (e) {
        this.deactivateOnSlideChange = true, this._super(e, "fragment"), this.onFragmentMouseDown = this.onFragmentMouseDown.bind(this)
    }, render: function () {
        this._super();
        var e = "Fragments are invisible until stepped through when you present. Preview to see them in action. The numbers that appear on top of each fragment indicate the order they will appear in.";
        this.toolbar = $('<div class="mode-toolbar mode-toolbar-fragment"><div class="inner"><p class="description">Click on elements to turn them into <u data-tooltip="' + e + '" data-tooltip-alignment="b" data-tooltip-maxwidth="355">fragments</u>.</p><button class="button grey done">Done</button></div></div>').appendTo($(".projector"))
    }, bind: function () {
        this._super(), this.toolbar.find(".done").on("vclick", this.deactivate.bind(this))
    }, activate: function () {
        if (!this.isActive()) {
            var e = SL.editor.controllers.Capabilities.isTouchEditor(), t = $(Reveal.getCurrentSlide());
            this.overlays = $('<div class="fragment-overlay editing-ui">').appendTo(t), t.find(".sl-block-content").each(function (t, i) {
                i = $(i);
                var n = i.is("img, video, iframe");
                if (!i.hasClass("editing-ui") && !(i.attr("data-animation-type") || "" === i.get(0).innerHTML && !n || 1 === i.children().length && i.children().first().is("br") && !/\w/i.test(i.text()))) {
                    var r = i.find(">ul>li, >ol>li");
                    r.length > 0 && (i = i.add(r)), i.each(function (t, i) {
                        var n = $(['<div class="editing-ui fragment-overlay-item">', '<div class="inner">', '<div class="controls-item move-down icon i-arrow-down"></div>', '<div class="controls-item index" data-tooltip="This number represents the order in which the fragment will appear relative to other fragments." data-tooltip-alignment="l" data-tooltip-delay="500" data-tooltip-maxwidth="230"></div>', '<div class="controls-item change-style icon i-ellipsis-v" data-tooltip="Select the type of animation to use for this fragment." data-tooltip-alignment="r" data-tooltip-delay="500" data-tooltip-maxwidth="230"></div>', '<div class="controls-item move-up icon i-arrow-up"></div>', "</div>", "</div>"].join(""));
                        n.data("target-element", $(i)), e && n.addClass("show-without-hover"), this.overlays.append(n)
                    }.bind(this))
                }
            }.bind(this));
        this.overlays.find(".fragment-overlay-item").on("vmousedown", this.onFragmentMouseDown);
        this.editor.disableEditing();
        this.editor.slideOptions.collapse();
        this.syncOverlays();
            this._super();
        }
    }, deactivate: function () {
        this.isActive() && (this.overlays.find(".fragment-overlay-item").off(), this.overlays.off().remove(), this.overlays = null, this.editor.enableEditing(), this._super())
    }, syncOverlays: function () {
        this.overlays.find(".fragment-overlay-item").each(function (e, t) {
            var i = $(t), n = i.data("target-element"), r = SL.util.getRevealElementOffset(n, true), o = n.css("z-index"), s = n.parents(".sl-block-content").first();
            s.length && (o = s.css("z-index")), i.css({
                left: r.x,
                top: r.y,
                width: n.outerWidth(true),
                height: n.outerHeight(true),
                zIndex: o
            }), i.toggleClass("is-active", n.hasClass("fragment")), i.toggleClass("is-hidden", n.parents(".fragment").length > 0);
            var a = i.find(".index");
            a.length && a.html(n.attr("data-fragment-index"))
        });
        var e = $(Reveal.getCurrentSlide());
        this.overlays.attr("data-fragments-total", e.find(".fragment").length)
    }, toggleFragment: function (e) {
        e.hasClass("fragment") ? (e.removeClass("fragment").removeAttr("data-fragment-index"), e.removeClass(SL.config.FRAGMENT_STYLES.map(function (e) {
            return e.id
        }).join(" "))) : (e.addClass("fragment"), e.find(".fragment").removeClass("fragment").removeAttr("data-fragment-index"), e.parents(".fragment").removeClass("fragment").removeAttr("data-fragment-index")), Reveal.sync(), this.syncOverlays()
    }, changeFragmentIndex: function (e, t) {
        var i = this.overlays.find(".fragment-overlay-item"), n = parseInt(e.attr("data-fragment-index"), 10);
        n = isNaN(n) ? 0 : n, n += t, n = Math.max(Math.min(n, i.length + 1), 0), e.attr("data-fragment-index", n), this.syncOverlays()
    }, changeFragmentStyle: function (e, t) {
        if (!this.fragmentStylePrompt) {
            var i = SL.config.FRAGMENT_STYLES.map(function (t) {
                return {title: t.title, value: t.id, selected: t.id && e.hasClass(t.id)}
            }), n = i.some(function (e) {
                return e.selected
            });
            n || (i[0].selected = true), this.fragmentStylePrompt = SL.prompt({
                anchor: t,
                alignment: "r",
                title: "Fragment style",
                type: "list",
                data: i,
                optional: true
            }), this.fragmentStylePrompt.confirmed.add(function (t) {
                e.removeClass(SL.config.FRAGMENT_STYLES.map(function (e) {
                    return e.id
                }).join(" ")), e.addClass(t)
            }.bind(this)), this.fragmentStylePrompt.destroyed.add(function () {
                this.fragmentStylePrompt = null
            }.bind(this))
        }
    }, flattenFragmentIndices: function () {
        var e = this.overlays.find(".fragment-overlay-item");
        e.sort(function (e, t) {
            var i = parseInt(e.getAttribute("data-fragment-index"), 10), n = parseInt(t.getAttribute("data-fragment-index"), 10);
            return i = isNaN(i) ? -1 : i, n = isNaN(n) ? -1 : n, i - n
        }), e.each(function (e, t) {
            $(t).data("target-element").attr("data-fragment-index", e)
        }.bind(this))
    }, onFragmentMouseDown: function (e) {
        var t = $(e.currentTarget), i = t.data("target-element");
        return $(e.target).closest(".move-up").length ? this.changeFragmentIndex(i, 1) : $(e.target).closest(".move-down").length ? this.changeFragmentIndex(i, -1) : $(e.target).closest(".change-style").length ? this.changeFragmentStyle(i, e.target) : i && i.length && this.toggleFragment(i), false
    }
});