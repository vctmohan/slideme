SL("components").Menu = Class.extend({
    init: function (t) {
        if (this.config = $.extend({
                alignment: "auto",
                anchorSpacing: 10,
                minWidth: 0,
                offsetX: 0,
                offsetY: 0,
                options: [],
                showOnHover: false,
                destroyOnHide: false,
                touch: /(iphone|ipod|ipad|android|windows\sphone)/gi.test(navigator.userAgent)
            }, t), this.config.anchor = $(this.config.anchor), this.show = this.show.bind(this), this.hide = this.hide.bind(this), this.layout = this.layout.bind(this), this.toggle = this.toggle.bind(this), this.onMouseOver = this.onMouseOver.bind(this), this.onDocumentMouseMove = this.onDocumentMouseMove.bind(this), this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this), this.onDocumentKeydown = this.onDocumentKeydown.bind(this), this.onAnchorFocus = this.onAnchorFocus.bind(this), this.onAnchorBlur = this.onAnchorBlur.bind(this), this.onAnchorFocusKeyDown = this.onAnchorFocusKeyDown.bind(this), this.submenus = [], this.destroyed = new signals.Signal, this.render(), this.renderList(), this.config.anchor.length)if (this.config.touch)this.config.anchor.addClass("menu-show-on-touch"), this.config.anchor.on("touchstart pointerdown", function (t) {
            t.preventDefault(), this.toggle()
        }.bind(this)), this.config.anchor.on("click", function (t) {
            t.preventDefault()
        }.bind(this)); else {
            if (this.config.showOnHover) {
                this.config.anchor.on("focus", this.onAnchorFocus), this.config.anchor.on("blur", this.onAnchorBlur), this.config.anchor.on("mouseover", this.onMouseOver);
                try {
                    this.config.anchor.is(":hover") && this.onMouseOver()
                } catch (e) {
                }
            }
            this.config.anchor.on("click", this.toggle)
        }
    }, render: function () {
        this.domElement = $('<div class="sl-menu">'), this.listElement = $('<div class="sl-menu-list">').appendTo(this.domElement), this.arrowElement = $('<div class="sl-menu-arrow">').appendTo(this.domElement), this.hitareaElement = $('<div class="sl-menu-hitarea">').appendTo(this.domElement), this.listElement.css("minWidth", this.config.minWidth + "px")
    }, renderList: function () {
        this.config.options.forEach(function (t) {
            var e;
            "string" == typeof t.url ? (e = $('<a class="sl-menu-item" href="' + t.url + '">'), "string" == typeof t.urlTarget && e.attr("target", t.urlTarget)) : e = $('<div class="sl-menu-item">'), e.html('<span class="label">' + t.label + "</span>"), e.data("callback", t.callback), e.appendTo(this.listElement), e.on("click", function (t) {
                var e = $(t.currentTarget), i = e.data("callback");
                "function" == typeof i && i.apply(null), this.hide()
            }.bind(this)), t.icon && e.append('<span class="icon i-' + t.icon + '"></span>'), t.attributes && e.attr(t.attributes), t.iconHTML && e.append(t.iconHTML), t.submenu && !this.config.touch && this.submenus.push(new SL.components.Menu({
                anchor: e,
                anchorSpacing: 10,
                alignment: t.submenuAlignment || "rl",
                minWidth: t.submenuWidth || 160,
                showOnHover: true,
                options: t.submenu
            }))
        }.bind(this)), this.listElement.find(".sl-menu-item:not(:last-child)").after('<div class="sl-menu-divider">')
    }, bind: function () {
        SL.keyboard.keydown(this.onDocumentKeydown), $(window).on("resize scroll", this.layout), $(document).on("mousedown touchstart pointerdown", this.onDocumentMouseDown)
    }, unbind: function () {
        SL.keyboard.release(this.onDocumentKeydown), SL.keyboard.release(this.onAnchorFocusKeyDown), $(window).off("resize scroll", this.layout), $(document).off("mousedown touchstart pointerdown", this.onDocumentMouseDown)
    }, layout: function () {
        if (this.config.anchor.length) {
            var t = this.config.anchor.offset(), e = this.config.anchorSpacing, i = this.config.alignment, n = $(window).scrollLeft(), s = $(window).scrollTop(), o = t.left + this.config.offsetX, a = t.top + this.config.offsetY, r = this.config.anchor.outerWidth(), l = this.config.anchor.outerHeight(), c = this.domElement.outerWidth(), d = this.domElement.outerHeight(), h = c / 2, u = c / 2, p = 8;
            switch ("auto" === i && (i = t.top - (d + e + p) < s ? "b" : "t"), "rl" === i && (i = t.left + r + e + p + c < window.innerWidth ? "r" : "l"), this.domElement.attr("data-alignment", i), i) {
                case"t":
                    o += (r - c) / 2, a -= d + e;
                    break;
                case"b":
                    o += (r - c) / 2, a += l + e;
                    break;
                case"l":
                    o -= c + e, a += (l - d) / 2;
                    break;
                case"r":
                    o += r + e, a += (l - d) / 2
            }
            switch (o = Math.min(Math.max(o, n + e), $(window).width() + n - c - e), a = Math.min(Math.max(a, s + e), window.innerHeight + s - d - e), i) {
                case"t":
                    h = t.left - o + r / 2, u = d;
                    break;
                case"b":
                    h = t.left - o + r / 2, u = -p;
                    break;
                case"l":
                    h = c, u = t.top - a + l / 2;
                    break;
                case"r":
                    h = -p, u = t.top - a + l / 2
            }
            this.domElement.css({left: o, top: a}), this.arrowElement.css({
                left: h,
                top: u
            }), this.hitareaElement.css({top: -e, right: -e, bottom: -e, left: -e})
        }
    }, focus: function (t) {
        var e = this.listElement.find(".focus");
        if (e.length) {
            var i = t > 0 ? e.nextAll(".sl-menu-item").first() : e.prevAll(".sl-menu-item").first();
            i.length && (e.removeClass("focus"), i.addClass("focus"))
        } else this.listElement.find(".sl-menu-item").first().addClass("focus")
    }, show: function () {
        this.domElement.removeClass("visible").appendTo(document.body), setTimeout(function () {
            this.domElement.addClass("visible")
        }.bind(this), 1), this.config.anchor.addClass("menu-is-open"), this.layout(), this.bind()
    }, hide: function () {
        this.listElement.find(".focus").removeClass("focus"), this.config.anchor.removeClass("menu-is-open"), this.domElement.detach(), this.unbind(), $(document).off("mousemove", this.onDocumentMouseMove), this.isMouseOver = false, clearTimeout(this.hideTimeout), this.config.destroyOnHide === true && this.destroy()
    }, toggle: function () {
        this.isVisible() ? this.hide() : this.show()
    }, isVisible: function () {
        return this.domElement.parent().length > 0
    }, hasSubMenu: function () {
        return this.submenus.length > 0
    }, destroy: function () {
        this.destroyed.dispatch(), this.destroyed.dispose(), this.domElement.remove(), this.unbind(), this.config.anchor.off("click", this.toggle), this.config.anchor.off("hover", this.toggle), this.submenus.forEach(function (t) {
            t.destroy()
        })
    }, onDocumentKeydown: function (t) {
        if (27 === t.keyCode && (this.hide(), t.preventDefault()), 13 === t.keyCode) {
            var e = this.listElement.find(".focus");
            e.length && (e.trigger("vclick"), t.preventDefault())
        } else 38 === t.keyCode ? (this.focus(-1), t.preventDefault()) : 40 === t.keyCode ? (this.focus(1), t.preventDefault()) : 9 === t.keyCode && t.shiftKey ? (this.focus(-1), t.preventDefault()) : 9 === t.keyCode && (this.focus(1), t.preventDefault())
    }, onMouseOver: function () {
        this.isMouseOver || ($(document).on("mousemove", this.onDocumentMouseMove), this.hideTimeout = -1, this.isMouseOver = true, this.show())
    }, onDocumentMouseMove: function (t) {
        var e = $(t.target), i = 0 === e.closest(this.domElement).length && 0 === e.closest(this.config.anchor).length;
        this.hasSubMenu() && (i = 0 === e.closest(".sl-menu").length && 0 === e.closest(this.config.anchor).length), i ? -1 === this.hideTimeout && (clearTimeout(this.hideTimeout), this.hideTimeout = setTimeout(this.hide, 150)) : this.hideTimeout && (clearTimeout(this.hideTimeout), this.hideTimeout = -1)
    }, onDocumentMouseDown: function (t) {
        var e = $(t.target);
        this.isVisible() && 0 === e.closest(this.domElement).length && 0 === e.closest(this.config.anchor).length && this.hide()
    }, onAnchorFocus: function () {
        this.isMouseOver || SL.keyboard.keydown(this.onAnchorFocusKeyDown)
    }, onAnchorBlur: function () {
        SL.keyboard.release(this.onAnchorFocusKeyDown)
    }, onAnchorFocusKeyDown: function (t) {
        return this.isMouseOver || 13 !== t.keyCode && 32 !== t.keyCode && 40 !== t.keyCode ? true : (this.show(), this.focus(), SL.keyboard.release(this.onAnchorFocusKeyDown), false)
    }
});