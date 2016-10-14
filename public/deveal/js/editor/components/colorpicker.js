SL("editor.components").Colorpicker = Class.extend({
    init: function (e) {
        this.editor = e, this.render(), this.bind()
    }, render: function () {
        this.domElement = $('<div class="sl-colorpicker">'), this.arrowElement = $('<div class="sl-colorpicker-arrow">').appendTo(this.domElement), this.apiElement = $('<div class="sl-colorpicker-api">').appendTo(this.domElement)
    }, bind: function () {
        this.onChooseClicked = this.onChooseClicked.bind(this), this.onResetClicked = this.onResetClicked.bind(this), this.onWindowResize = this.onWindowResize.bind(this), this.onDocumentMouseDown = this.onDocumentMouseDown.bind(this)
    }, renderColorpicker: function () {
        this.hasRenderedColorPicker || (this.hasRenderedColorPicker = true, this.apiElement.spectrum({
            flat: true,
            showInput: true,
            showButtons: false,
            showInitial: true,
            showPalette: true,
            showPaletteOnly: true,
            togglePaletteOnly: true,
            showSelectionPalette: true,
            hideAfterPaletteSelect: true,
            maxSelectionSize: 10,
            togglePaletteMoreText: "More options",
            togglePaletteLessText: "Fewer options",
            preferredFormat: "hex",
            localStorageKey: "sl-colors",
            className: "sl-colorpicker-spectrum",
            move: function (e) {
                this.config.changeCallback(this.config.alpha ? e.toRgbString() : e.toHexString(), true)
            }.bind(this),
            change: function (e) {
                this.config.changeCallback(this.config.alpha ? e.toRgbString() : e.toHexString(), true)
            }.bind(this),
            hide: function () {
                this.hide()
            }.bind(this)
        }), this.domElement.find(".sp-palette-toggle").on("mouseup", this.onMoreLessToggleClicked.bind(this))), this.domElement.find(".sl-colorpicker-buttons").remove(), this.domElement.append(['<div class="sl-colorpicker-buttons">', '<button class="sl-colorpicker-reset button s outline">' + this.config.resetText + "</button>", '<button class="sl-colorpicker-choose button s grey">' + this.config.chooseText + "</button>", "</div>"].join("")), this.domElement.find(".sl-colorpicker-reset").on("click", this.onResetClicked), this.domElement.find(".sl-colorpicker-choose").on("click", this.onChooseClicked), this.apiElement.spectrum("option", "palette", this.getColorPalettePresets(this.config.alpha)), this.apiElement.spectrum("option", "showAlpha", !!this.config.alpha), this.apiElement.spectrum("option", "cancelText", this.config.cancelText), this.apiElement.spectrum("option", "cancelClassName", this.config.cancelClassName), this.apiElement.spectrum("option", "chooseText", this.config.chooseText), this.apiElement.spectrum("option", "chooseClassName", this.config.chooseClassName), this.config.color && this.apiElement.spectrum("set", this.config.color), this.apiElement.spectrum("reflow")
    }, layout: function () {
        var e = 10, t = 6, i = this.domElement.outerWidth(), n = this.domElement.outerHeight(), r = this.config.anchor.offset(), o = this.config.anchor.outerWidth(), s = this.config.anchor.outerHeight(), a = r.left + this.config.offsetX, l = r.top + this.config.offsetY;
        switch (this.config.alignment) {
            case"t":
                a += (o - i) / 2, l -= n + e;
                break;
            case"b":
                a += (o - i) / 2, l += s + e;
                break;
            case"l":
                a -= i + e, l += (s - n) / 2;
                break;
            case"r":
                a += o + e, l += (s - n) / 2
        }
        switch (a = Math.min(Math.max(a, e), window.innerWidth - i - e), l = Math.min(Math.max(l, e), window.innerHeight - n - e), this.config.alignment) {
            case"t":
                arrowX = r.left - a + o / 2, arrowY = n;
                break;
            case"b":
                arrowX = r.left - a + o / 2, arrowY = -t;
                break;
            case"l":
                arrowX = i, arrowY = r.top - l + s / 2;
                break;
            case"r":
                arrowX = -t, arrowY = r.top - l + s / 2
        }
        this.domElement.css({left: a, top: l}), this.arrowElement.css({
            left: arrowX,
            top: arrowY
        }), this.domElement.attr("data-alignment", this.config.alignment)
    }, show: function (e) {
        if (!e.anchor)throw"Can not show color picker without anchor.";
        this.domElement.appendTo(document.body), this.config = $.extend({
            alignment: "l",
            offsetX: 0,
            offsetY: 0,
            alpha: false,
            resetText: "Use default",
            chooseText: "Done",
            resetCallback: function () {
            },
            changeCallback: function () {
            },
            hiddenCallback: function () {
            }
        }, e), this.renderColorpicker(), this.layout(), $(window).on("resize", this.onWindowResize), $(document).on("mousedown", this.onDocumentMouseDown)
    }, hide: function () {
        this.saveCurrentColorToPalette(), this.domElement.detach(), $(window).off("resize", this.onWindowResize), $(document).off("mousedown", this.onDocumentMouseDown)
    }, toggle: function (e) {
        this.isVisible() ? this.hide() : this.show(e)
    }, isVisible: function () {
        return this.domElement.parent().length > 0
    }, setColor: function (e) {
        this.apiElement.spectrum("set", e), this.apiElement.spectrum("reflow")
    }, getColor: function () {
        return this.apiElement.spectrum("get")
    }, saveCurrentColorToPalette: function () {
        this.apiElement.spectrum("saveCurrentSelection")
    }, getColorPalettePresets: function (e) {
        if (this.hasCustomPalette())return [SL.view.getCurrentTheme().get("palette")];
        var t = ["rgb(0, 0, 0)", "rgb(34, 34, 34)", "rgb(68, 68, 68)", "rgb(102, 102, 102)", "rgb(136, 136, 136)", "rgb(170, 170, 170)", "rgb(204, 204, 204)", "rgb(238, 238, 238)", "rgb(255, 255, 255)"], i = ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)", "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(168, 39, 107)"], n = ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)", "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)", "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)", "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)", "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)", "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)", "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)", "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)", "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)", "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"];
        return e && t.push("transparent"), [t, i, n]
    }, hasCustomPalette: function () {
        var e = SL.view.getCurrentTheme();
        return e && e.hasPalette()
    }, destroy: function () {
        this.domElement.remove()
    }, onResetClicked: function (e) {
        this.config.resetCallback(), this.hide(), e.preventDefault()
    }, onChooseClicked: function (e) {
        this.saveCurrentColorToPalette(), this.hide(), e.preventDefault()
    }, onMoreLessToggleClicked: function () {
        setTimeout(function () {
            this.layout()
        }.bind(this), 1)
    }, onDocumentMouseDown: function (e) {
        var t = $(e.target);
        0 === t.closest(this.domElement).length && 0 === t.closest(this.config.anchor).length && this.hide()
    }, onWindowResize: function () {
        this.layout()
    }
});