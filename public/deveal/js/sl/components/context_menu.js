SL("components").ContextMenu = Class.extend({
    init: function (t) {
        this.config = $.extend({
            anchorSpacing: 5,
            minWidth: 0,
            options: []
        }, t), this.config.anchor = $(this.config.anchor), this.show = this.show.bind(this), this.hide = this.hide.bind(this), this.layout = this.layout.bind(this), this.onContextMenu = this.onContextMenu.bind(this), this.onDocumentKeydown = this.onDocumentKeydown.bind(this), this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this), this.shown = new signals.Signal, this.hidden = new signals.Signal, this.destroyed = new signals.Signal, this.domElement = $('<div class="sl-context-menu">'), this.config.anchor.on("contextmenu", this.onContextMenu)
    }, render: function () {
        this.listElement = $('<div class="sl-context-menu-list">').appendTo(this.domElement), this.listElement.css("minWidth", this.config.minWidth + "px"), this.arrowElement = $('<div class="sl-context-menu-arrow">').appendTo(this.domElement)
    }, renderList: function () {
        this.config.options.forEach(function (t) {
            if ("divider" === t.type)$('<div class="sl-context-menu-divider">').appendTo(this.listElement); else {
                var e;
                e = $("string" == typeof t.url ? '<a class="sl-context-menu-item" href="' + t.url + '">' : '<div class="sl-context-menu-item">'), e.data("item-data", t), e.html('<span class="label">' + t.label + "</span>"), e.appendTo(this.listElement), e.on("click", function (t) {
                    var e = $(t.currentTarget).data("item-data").callback;
                    "function" == typeof e && e.apply(null, [this.contextMenuEvent]), this.hide()
                }.bind(this)), t.icon && e.append('<span class="icon i-' + t.icon + '"></span>'), t.attributes && e.attr(t.attributes)
            }
        }.bind(this))
    }, bind: function () {
        SL.keyboard.keydown(this.onDocumentKeydown), $(document).on("mousedown touchstart pointerdown", this.onDocumentMouseDown)
    }, unbind: function () {
        SL.keyboard.release(this.onDocumentKeydown), $(document).off("mousedown touchstart pointerdown", this.onDocumentMouseDown)
    }, layout: function (t, e) {
        var i = this.config.anchorSpacing, n = $(window).scrollLeft(), s = $(window).scrollTop(), o = this.domElement.outerWidth(), a = this.domElement.outerHeight(), r = o / 2, l = a / 2, c = 8, d = t, h = e - a / 2;
        t + i + c + o < window.innerWidth ? (this.domElement.attr("data-alignment", "r"), d += c + i, r = -c) : (this.domElement.attr("data-alignment", "l"), d -= o + c + i, r = o), d = Math.min(Math.max(d, n + i), window.innerWidth + n - o - i), h = Math.min(Math.max(h, s + i), window.innerHeight + s - a - i), this.domElement.css({
            left: d,
            top: h
        }), this.arrowElement.css({left: r, top: l})
    }, focus: function (t) {
        var e = this.listElement.find(".focus");
        if (e.length) {
            var i = t > 0 ? e.nextAll(".sl-context-menu-item").first() : e.prevAll(".sl-context-menu-item").first();
            i.length && (e.removeClass("focus"), i.addClass("focus"))
        } else this.listElement.find(".sl-context-menu-item").first().addClass("focus")
    }, show: function () {
        this.rendered || (this.rendered = true, this.render(), this.renderList()), this.listElement.find(".sl-context-menu-item").each(function (t, e) {
            var i = $(e), n = i.data("item-data");
            i.toggleClass("hidden", "function" == typeof n.filter && !n.filter())
        }.bind(this)), this.listElement.find(".sl-context-menu-item:not(.hidden)").length && (this.domElement.removeClass("visible").appendTo(document.body), setTimeout(function () {
            this.domElement.addClass("visible")
        }.bind(this), 1), this.bind(), this.layout(this.contextMenuEvent.clientX, this.contextMenuEvent.clientY), this.shown.dispatch(this.contextMenuEvent))
    }, hide: function () {
        this.listElement.find(".focus").removeClass("focus"), this.domElement.detach(), this.unbind(), this.hidden.dispatch()
    }, isVisible: function () {
        return this.domElement.parent().length > 0
    }, destroy: function () {
        this.shown.dispose(), this.hidden.dispose(), this.destroyed.dispatch(), this.destroyed.dispose(), this.domElement.remove(), this.unbind(), this.config = null
    }, onDocumentKeydown: function (t) {
        if (27 === t.keyCode && (this.hide(), t.preventDefault()), 13 === t.keyCode) {
            var e = this.listElement.find(".focus");
            e.length && (e.trigger("click"), t.preventDefault())
        } else 38 === t.keyCode ? (this.focus(-1), t.preventDefault()) : 40 === t.keyCode ? (this.focus(1), t.preventDefault()) : 9 === t.keyCode && t.shiftKey ? (this.focus(-1), t.preventDefault()) : 9 === t.keyCode && (this.focus(1), t.preventDefault())
    }, onContextMenu: function (t) {
        t.preventDefault(), this.contextMenuEvent = t, this.show()
    }, onDocumentMouseDown: function (t) {
        var e = $(t.target);
        this.isVisible() && 0 === e.closest(this.domElement).length && this.hide()
    }
});