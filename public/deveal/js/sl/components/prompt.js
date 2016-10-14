SL("components").Prompt = Class.extend({
    init: function (t) {
        this.config = $.extend({
            type: "custom",
            data: null,
            anchor: null,
            title: null,
            subtitle: null,
            optional: true,
            alignment: "auto",
            offsetX: 0,
            offsetY: 0,
            className: null,
            confirmOnEnter: true,
            destroyAfterConfirm: true,
            confirmLabel: "OK",
            cancelLabel: "Cancel",
            confirmButton: null,
            cancelButton: null,
            hoverTarget: null,
            hoverClass: "hover"
        }, t), this.onBackgroundClicked = this.onBackgroundClicked.bind(this), this.onDocumentKeydown = this.onDocumentKeydown.bind(this), this.onPromptCancelClicked = this.onPromptCancelClicked.bind(this), this.onPromptConfirmClicked = this.onPromptConfirmClicked.bind(this), this.checkInputStatus = this.checkInputStatus.bind(this), this.layout = this.layout.bind(this), this.confirmed = new signals.Signal, this.canceled = new signals.Signal, this.destroyed = new signals.Signal, this.render()
    }, 
    render: function () {
        this.domElement = $('<div class="sl-prompt" data-type="' + this.config.type + '">'), this.innerElement = $('<div class="sl-prompt-inner">').appendTo(this.domElement), this.arrowElement = $('<div class="sl-prompt-arrow">').appendTo(this.innerElement), this.config.title && (this.titleElement = $('<h3 class="title">').html(this.config.title).appendTo(this.innerElement)), this.config.subtitle && (this.subtitleElement = $('<h4 class="subtitle">').html(this.config.subtitle).appendTo(this.innerElement), this.titleElement && this.titleElement.addClass("has-subtitle")), this.config.className && this.domElement.addClass(this.config.className), this.config.html && this.innerElement.append(this.config.html), "select" === this.config.type ? this.renderSelect() : "list" === this.config.type ? (this.renderList(), this.renderButtons(this.config.multiselect, !this.config.multiselect)) : "input" === this.config.type ? (this.renderInput(), this.renderButtons(true, true)) : this.renderButtons(this.config.confirmButton, this.config.cancelButton)
    }, 
    renderSelect: function () {
        this.config.data.forEach(function (t) {
            var e = $('<a class="item button outline l">').html(t.html);
            e.data("callback", t.callback), e.appendTo(this.innerElement), e.on("vclick", function (t) {
                var e = $(t.currentTarget).data("callback");
                "function" == typeof e && e.apply(null), this.destroy(), t.preventDefault()
            }.bind(this)), t.focused === true && e.addClass("focus"), t.selected === true && e.addClass("selected"), "string" == typeof t.className && (e.addClass(t.className), /(negative|positive)/g.test(t.className) && e.removeClass("outline"))
        }.bind(this)), this.domElement.attr("data-length", this.config.data.length)
    }, 
    renderList: function () {
        this.listElement = $('<div class="list">').appendTo(this.innerElement), this.config.data.forEach(function (t) {
            var e = $('<div class="item">');
            e.html('<span class="title">' + (t.title ? t.title : t.value) + '</span><span class="checkmark icon i-checkmark"></span>'), e.data({
                callback: t.callback,
                value: t.value
            }), e.appendTo(this.listElement), e.on("click", function (e) {
                var i = $(e.currentTarget), n = i.data("callback"), s = i.data("value");
                this.config.multiselect && (i.toggleClass("selected"), t.exclusive ? (i.addClass("selected"), i.siblings().removeClass("selected")) : i.siblings().filter(".exclusive").removeClass("selected")), "function" == typeof n && n.apply(null, [s, i.hasClass("selected")]), this.config.multiselect || (this.confirmed.dispatch(s), this.destroy())
            }.bind(this)), t.focused === true && e.addClass("focus"), t.selected === true && e.addClass("selected"), t.exclusive === true && e.addClass("exclusive"), "string" == typeof t.className && e.addClass(t.className)
        }.bind(this))
    }, 
    renderInput: function () {
        this.config.data.multiline === true ? this.inputElement = $('<textarea cols="40" rows="8">') : (this.inputElement = $('<input type="text">'), "number" == typeof this.config.data.width && (this.inputElement.css("width", this.config.data.width), this.titleElement && this.titleElement.css("max-width", this.config.data.width), this.subtitleElement && this.subtitleElement.css("max-width", this.config.data.width))), this.config.data.value && this.inputElement.val(this.config.data.value), this.config.data.placeholder && this.inputElement.attr("placeholder", this.config.data.placeholder), this.config.data.maxlength && this.inputElement.attr("maxlength", this.config.data.maxlength), this.inputWrapperElement = $('<div class="input-wrapper">').append(this.inputElement), this.inputWrapperElement.appendTo(this.innerElement)
    }, 
    renderButtons: function (t, e) {
        var i = [];
        e && this.config.optional && this.config.cancelLabel && i.push('<button class="button l outline prompt-cancel">' + this.config.cancelLabel + "</button>"), t && this.config.confirmLabel && i.push('<button class="button l prompt-confirm">' + this.config.confirmLabel + "</button>"), i.length && (this.footerElement = $('<div class="footer">' + i.join("") + "</div>").appendTo(this.innerElement))
    }, 
    bind: function () {
        $(window).on("resize", this.layout), this.domElement.on("vclick", this.onBackgroundClicked), SL.keyboard.keydown(this.onDocumentKeydown), "hidden" !== $("html").css("overflow") && $(window).on("scroll", this.layout), this.domElement.find(".prompt-cancel").on("vclick", this.onPromptCancelClicked), this.domElement.find(".prompt-confirm").on("vclick", this.onPromptConfirmClicked), this.inputElement && this.inputElement.on("input", this.checkInputStatus)
    }, 
    unbind: function () {
        $(window).off("resize scroll", this.layout), this.domElement.off("vclick", this.onBackgroundClicked), SL.keyboard.release(this.onDocumentKeydown), this.domElement.find(".prompt-cancel").off("vclick", this.onPromptCancelClicked), this.domElement.find(".prompt-confirm").off("vclick", this.onPromptConfirmClicked), this.inputElement && this.inputElement.off("input", this.checkInputStatus)
    }, 
    layout: function () {
        var t = 10, e = $(window).width(), i = window.innerHeight;
        this.innerElement.css({"max-width": e - 2 * t, "max-height": i - 2 * t});
        var n = this.innerElement.outerWidth(), s = this.innerElement.outerHeight(), o = $(this.config.anchor);
        if (o.length) {
            var a = o.offset(), r = 15, l = this.config.alignment, c = $(window).scrollLeft(), d = $(window).scrollTop(), h = a.left - c, u = a.top - d;
            h += this.config.offsetX, u += this.config.offsetY;
            var p = o.outerWidth(), f = o.outerHeight(), m = n / 2, g = n / 2, v = 10, b = true;
            switch ("auto" === l && (l = a.top - (s + r + v) < d ? "b" : "t"), this.domElement.attr("data-alignment", l), l) {
                case"t":
                    h += (p - n) / 2, u -= s + r;
                    break;
                case"b":
                    h += (p - n) / 2, u += f + r;
                    break;
                case"l":
                    h -= n + r, u += (f - s) / 2;
                    break;
                case"r":
                    h += p + r, u += (f - s) / 2
            }
            var S = u;
            switch (h = Math.max(Math.min(h, e - n - t), t), u = Math.max(Math.min(u, i - s - t), t), h = Math.round(h), u = Math.round(u), "b" === l && -f - v > u - S ? b = false : "t" === l && u - S > f + v && (b = false), l) {
                case"t":
                    m = a.left - h - c + p / 2, m = Math.max(Math.min(m, n - v), v), g = s;
                    break;
                case"b":
                    m = a.left - h - c + p / 2, m = Math.max(Math.min(m, n - v), v), g = -v;
                    break;
                case"l":
                    m = n, g = a.top - u - d + f / 2, g = Math.max(Math.min(g, s - v), v);
                    break;
                case"r":
                    m = -v, g = a.top - u - d + f / 2, g = Math.max(Math.min(g, s - v), v)
            }
            this.innerElement.css({left: h, top: u}), this.arrowElement.css({
                left: m,
                top: g
            }).toggle(b)
        } else this.innerElement.css({
            left: Math.round((e - n) / 2),
            top: Math.round(.4 * (i - s))
        }), this.arrowElement.hide()
    }, 
    focus: function (t) {
        var e = this.innerElement.find(".focus");
        if (e.length || (e = this.innerElement.find(".selected")), e.length) {
            var i = t > 0 ? e.next(".item") : e.prev(".item");
            i.length && (e.removeClass("focus"), i.addClass("focus"))
        } else this.innerElement.find(".item").first().addClass("focus")
    }, 
    show: function () {
        var t = $(this.config.anchor);
        t.length && t.addClass("focus"), $(this.config.hoverTarget).addClass(this.config.hoverClass), this.domElement.removeClass("visible").appendTo(document.body), setTimeout(function () {
            this.domElement.addClass("visible")
        }.bind(this), 1), this.layout(), this.bind(), this.inputElement && (this.checkInputStatus(), this.inputElement.focus())
    }, 
    hide: function () {
        var t = $(this.config.anchor);
        t.length && t.removeClass("focus"), $(this.config.hoverTarget).removeClass(this.config.hoverClass), this.domElement.detach(), this.unbind()
    }, 
    showOverlay: function (t, e, i, n) {
        return clearTimeout(this.overlayTimeout), this.overlay || (this.overlay = $('<div class="sl-prompt-overlay">')), this.overlay.appendTo(this.innerElement), this.overlay.html(i + "<h3>" + e + "</h3>"), this.overlay.attr("data-status", t || "neutral"), this.overlay.addClass("visible"), new Promise(function (t) {
            n ? this.overlayTimeout = setTimeout(function () {
                this.overlay.removeClass("visible"), t()
            }.bind(this), n) : t()
        }.bind(this))
    }, 
    getValue: function () {
        var t = void 0;
        return "input" === this.config.type && (t = this.inputElement.val()), t
    }, 
    getDOMElement: function () {
        return this.domElement
    }, 
    cancel: function () {
        if ("input" === this.config.type && this.config.data.confirmBeforeDiscard) {
            var t = this.config.data.value || "", e = this.getValue() || "";
            e !== t ? SL.prompt({
                title: "Discard unsaved changes?",
                type: "select",
                data: [{html: "<h3>Cancel</h3>"}, {
                    html: "<h3>Discard</h3>",
                    selected: true,
                    className: "negative",
                    callback: function () {
                        this.canceled.dispatch(this.getValue()), this.destroy()
                    }.bind(this)
                }]
            }) : (this.canceled.dispatch(this.getValue()), this.destroy())
        } else this.canceled.dispatch(this.getValue()), this.destroy()
    }, 
    confirm: function () {
        this.confirmed.dispatch(this.getValue()), this.config.destroyAfterConfirm && this.destroy()
    }, 
    checkInputStatus: function () {
        if (this.config.data.maxlength && !this.config.data.maxlengthHidden) {
            var t = this.inputWrapperElement.find(".input-status");
            0 === t.length && (t = $('<div class="input-status">').appendTo(this.inputWrapperElement));
            var e = this.inputElement.val().length, i = this.config.data.maxlength;
            t.text(e + "/" + i), t.toggleClass("negative", e > .95 * i), this.config.data.multiline || this.inputElement.css("padding-right", t.outerWidth() + 5)
        }
    }, 
    destroy: function () {
        this.destroyed.dispatch(), this.destroyed.dispose();
        var t = $(this.config.anchor);
        t.length && t.removeClass("focus"), $(this.config.hoverTarget).removeClass(this.config.hoverClass), this.domElement.remove(), this.unbind(), this.confirmed.dispose(), this.canceled.dispose()
    }, 
    onBackgroundClicked: function (t) {
        this.config.optional && $(t.target).is(this.domElement) && (this.cancel(), t.preventDefault())
    }, 
    onPromptCancelClicked: function (t) {
        this.cancel(), t.preventDefault()
    }, 
    onPromptConfirmClicked: function (t) {
        this.confirm(), t.preventDefault()
    }, 
    onDocumentKeydown: function (t) {
        if (27 === t.keyCode)return this.config.optional && this.cancel(), t.preventDefault(), false;
        if ("select" === this.config.type || "list" === this.config.type)if (13 === t.keyCode) {
            var e = this.innerElement.find(".focus");
            0 === e.length && (e = this.innerElement.find(".selected")), e.length && (e.trigger("click"), t.preventDefault())
        } else 37 === t.keyCode || 38 === t.keyCode ? (this.focus(-1), t.preventDefault()) : 39 === t.keyCode || 40 === t.keyCode ? (this.focus(1), t.preventDefault()) : 9 === t.keyCode && t.shiftKey ? (this.focus(-1), t.preventDefault()) : 9 === t.keyCode && (this.focus(1), t.preventDefault());
        return "input" === this.config.type && (13 !== t.keyCode || this.config.data.multiline || this.onPromptConfirmClicked(t)), "custom" === this.config.type && this.config.confirmOnEnter && 13 === t.keyCode && this.onPromptConfirmClicked(t), true
    }
});

SL.prompt = function (t) {
        var e = new SL.components.Prompt(t);
        e.show();
        return e;
    };