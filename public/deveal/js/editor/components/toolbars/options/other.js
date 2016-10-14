SL("editor.components.toolbars.options").AnimationType = SL.editor.components.toolbars.options.Select.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "animation-type",
            label: "Effect",
            property: "attribute.data-animation-type",
            items: e.getPropertySettings("attribute.data-animation-type").options
        }, t))
    }, renderPanel: function () {
        this._super.apply(this, arguments), this.previewElement = $('<div class="animation-preview"></div>'), this.previewElement.appendTo(this.panel.domElement), this.previewInnerElement = $('<div class="animation-preview-inner"></div>'), this.previewInnerElement.appendTo(this.previewElement), this.panel.getContentElement().on("mouseleave", this.onPanelMouseOut.bind(this)), this.getListElements().on("mouseenter", this.onItemMouseOver.bind(this))
    }, onItemMouseOver: function (e) {
        var t = $(e.currentTarget).attr("data-value");
        t && (this.previewElement.addClass("visible"), this.previewInnerElement.attr("data-animation-type", t).css("transition-duration", "").removeClass("animate"), setTimeout(function () {
            this.previewInnerElement.css("transition-duration", this.block.get("style.transition-duration") + "s").addClass("animate")
        }.bind(this), 100))
    }, onPanelMouseOut: function () {
        this.previewElement.removeClass("visible")
    }
});
SL("editor.components.toolbars.options").Back = SL.editor.components.toolbars.options.Base.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "back", icon: "arrow-up", tooltip: "Go back"}, t))
    }, onClicked: function (e) {
        this._super(e), SL.view.toolbars.pop()
    }
});
SL("editor.components.toolbars.options").BackgroundColor = SL.editor.components.toolbars.options.Color.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "background-color",
            label: "Background Color",
            property: "style.background-color",
            alpha: true
        }, t))
    }, getColorpickerConfig: function () {
        var e = this._super.apply(this, arguments), t = tinycolor(this.getValue()).toRgb();
        return 0 === t.r && 0 === t.g && 0 === t.b && 0 === t.a && (e.color = "#000000"), e
    }
});
SL("editor.components.toolbars.options").BlockActions = SL.editor.components.toolbars.options.Multi.extend({
    init: function (e, t) {
        var i = [{value: "duplicate", icon: "new-window", tooltip: "Duplicate"}, {
            value: "delete",
            icon: "trash-fill",
            tooltip: "Delete"
        }];
        e && e.options.horizontalResizing && e.options.verticalResizing && i.unshift({
            value: "expand",
            icon: "fullscreen",
            tooltip: "Maximize"
        }), e && e.hasPlugin(SL.editor.blocks.plugin.HTML) && i.unshift({
            value: "html",
            icon: "file-xml",
            tooltip: "Edit HTML"
        }), this._super(e, $.extend({type: "block-actions", label: "Actions", items: i}, t))
    }, trigger: function (e) {
        var t = SL.editor.controllers.Blocks.getFocusedBlocks();
        "html" === e ? (t[0].editHTML(), SL.analytics.trackEditor("Toolbar: Edit HTML")) : "expand" === e ? (t.forEach(function (e) {
            e.resize({width: SL.config.SLIDE_WIDTH, height: SL.config.SLIDE_HEIGHT}), e.moveToCenter()
        }), SL.analytics.trackEditor("Toolbar: Expand block")) : "duplicate" === e ? (SL.editor.controllers.Blocks.copy(), SL.editor.controllers.Blocks.paste(), SL.analytics.trackEditor("Toolbar: Duplicate block")) : "delete" === e && (t.forEach(function (e) {
            e.destroy()
        }), SL.analytics.trackEditor("Toolbar: Delete block"))
    }
});
SL("editor.components.toolbars.options").BlockAlignHorizontal = SL.editor.components.toolbars.options.Multi.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "block-align-horizontal",
            label: "Alignment",
            items: [{value: "left", icon: "alignleftedges"}, {
                value: "horizontal-center",
                icon: "alignhorizontalcenters"
            }, {value: "right", icon: "alignrightedges"}]
        }, t))
    }, trigger: function (e) {
        this._super(e), SL.editor.controllers.Blocks.align(SL.editor.controllers.Blocks.getFocusedBlocks(), e)
    }
});
SL("editor.components.toolbars.options").BlockAlignVertical = SL.editor.components.toolbars.options.Multi.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "block-align-vertical",
            items: [{value: "top", icon: "aligntopedges"}, {
                value: "vertical-center",
                icon: "alignverticalcenters"
            }, {value: "bottom", icon: "alignbottomedges"}]
        }, t))
    }, trigger: function (e) {
        this._super(e), SL.editor.controllers.Blocks.align(SL.editor.controllers.Blocks.getFocusedBlocks(), e)
    }
});
SL("editor.components.toolbars.options").BlockDepth = SL.editor.components.toolbars.options.Multi.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "block-depth",
            label: "Depth",
            items: [{value: "back", icon: "arrow-down", tooltip: "Move to back"}, {
                value: "front",
                icon: "arrow-up",
                tooltip: "Move to front"
            }]
        }, t))
    }, trigger: function (e) {
        "front" === e ? SL.editor.controllers.Blocks.moveBlocksToDepth(SL.editor.controllers.Blocks.getFocusedBlocks(), 1e4) : "back" === e && SL.editor.controllers.Blocks.moveBlocksToDepth(SL.editor.controllers.Blocks.getFocusedBlocks(), 0)
    }
});
SL("editor.components.toolbars.options").BorderColor = SL.editor.components.toolbars.options.Color.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "border-color", label: "Color", property: "style.border-color"}, t))
    }
});
SL("editor.components.toolbars.options").BorderRadius = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "border-radius", label: "Radius", property: "style.border-radius"}, t))
    }
});
SL("editor.components.toolbars.options").BorderStyle = SL.editor.components.toolbars.options.Select.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "border-style",
            label: "Style",
            property: "style.border-style",
            items: e.getPropertySettings("style.border-style").options
        }, t))
    }
});
SL("editor.components.toolbars.options").BorderWidth = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "border-width", label: "Width", property: "style.border-width"}, t))
    }
});
SL("editor.components.toolbars.options").ClassName = SL.editor.components.toolbars.options.Text.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "class-name",
            label: "Class name",
            property: "attribute.class",
            helpTooltip: "Adds a class name to the underlying HTML element. Useful when trying to target elements with custom CSS."
        }, t))
    }
});
SL("editor.components.toolbars.options").CodeLanguage = SL.editor.components.toolbars.options.Select.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "code-language",
            label: "Language",
            property: "code.language",
            items: e.getPropertySettings("code.language").options,
            panelMaxHeight: 400
        }, t))
    }
});
SL("editor.components.toolbars.options").CodeTheme = SL.editor.components.toolbars.options.Select.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "code-theme",
            label: "Theme",
            property: "code.theme",
            items: e.getPropertySettings("code.theme").options,
            panelType: "code-theme",
            panelWidth: 180,
            panelMaxHeight: 500
        }, t))
    }
});
SL("editor.components.toolbars.options").Code = SL.editor.components.toolbars.options.Text.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "code",
            label: "Code",
            property: "code.value",
            placeholder: "Paste code to syntax highlight...",
            multiline: true,
            expandable: true,
            maxlength: 1e7
        }, t))
    }, bind: function () {
        this._super(), this.block && (this.onEditingRequested = this.onEditingRequested.bind(this), this.block.editingRequested.add(this.onEditingRequested))
    }, destroy: function () {
        this.block && this.block.editingRequested.remove(this.onEditingRequested), this._super()
    }, onEditingRequested: function () {
        this.expand()
    }
});
SL("editor.components.toolbars.options").Divider = SL.editor.components.toolbars.options.Base.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "divider"}, t)), this.domElement.addClass("toolbar-divider")
    }
});
SL("editor.components.toolbars.options").HTML = SL.editor.components.toolbars.options.Button.extend({
    init: function (e, t) {
        this._super(e, $.extend({title: "Edit HTML", property: "html.value"}, t))
    }, onClicked: function (e) {
        this._super(e), this.block.editHTML()
    }
});
SL("editor.components.toolbars.options").IframeAutoplay = SL.editor.components.toolbars.options.Checkbox.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "iframe-autoplay",
            label: "Autoplay",
            property: "iframe.autoplay"
        }, t)), this.updateVisibility()
    }, bind: function () {
        this._super(), this.block && (this.updateVisibility = this.updateVisibility.bind(this), this.block.iframeSourceChanged.add(this.updateVisibility))
    }, setValue: function (e, t) {
        this._super(e, t)
    }, updateVisibility: function () {
        var e = this.block.get("iframe.src");
        e && (/^.*(youtube\.com\/embed\/)/.test(e) || /^.*(player\.vimeo.com\/)/.test(e)) ? this.domElement.show() : this.domElement.hide()
    }, destroy: function () {
        this.block && !this.block.destroyed && this.block.iframeSourceChanged.remove(this.updateVisibility), this._super()
    }
});
SL("editor.components.toolbars.options").IframeSRC = SL.editor.components.toolbars.options.Text.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "iframe-src",
            label: "Iframe Source",
            property: "iframe.src",
            placeholder: "URL or <iframe>...",
            multiline: true,
            maxlength: 2e3
        }, t))
    }, bind: function () {
        this._super(), this.block && (this.onEditingRequested = this.onEditingRequested.bind(this), this.block.editingRequested.add(this.onEditingRequested))
    }, destroy: function () {
        this.block && this.block.editingRequested.remove(this.onEditingRequested), this._super()
    }, writeToBlock: function () {
        var e = this.getValue().trim();
        SL.util.string.URL_REGEX.test(e) ? this.block.set(this.config.property, e) : this.block.set(this.config.property, "")
    }, onInputChange: function () {
        var e = this.getValue();
        if (/<iframe/gi.test(e))try {
            this.setValue($(e).attr("src"))
        } catch (t) {
        }
        this.writeToBlock()
    }, onEditingRequested: function () {
        this.focus()
    }
});
SL("editor.components.toolbars.options").ImageInlineSVG = SL.editor.components.toolbars.options.Checkbox.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "image-inline-svg",
            label: "Inline SVG",
            property: "attribute.data-inline-svg"
        }, t)), this.sync = this.sync.bind(this), e.imageURLChanged.add(this.sync)
    }, sync: function () {
        this.block.isSVG() ? this.domElement.show() : this.domElement.hide()
    }, destroy: function () {
        this.block.imageURLChanged && this.block.imageURLChanged.remove(this.sync), this._super()
    }
});
SL("editor.components.toolbars.options").Image = SL.editor.components.toolbars.options.Base.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "image", labe: "Image"}, t)), this.syncUI()
    }, render: function () {
        this._super(), this.domElement.addClass("toolbar-image"), this.innerElement = $('<div class="toolbar-image-inner">').appendTo(this.domElement), this.placeholderElement = $('<div class="toolbar-image-placeholder">').appendTo(this.innerElement), this.labelElement = $('<div class="toolbar-image-label">Select</div>').appendTo(this.innerElement), this.urlElement = $('<div class="toolbar-image-url icon i-link"></div>').appendTo(this.innerElement), this.spinnerElement = $(['<div class="toolbar-image-progress">', '<span class="spinner centered"></span>', "</div>"].join("")).appendTo(this.innerElement)
    }, bind: function () {
        this._super(), this.onMediaLibrarySelection = this.onMediaLibrarySelection.bind(this), this.syncUI = this.syncUI.bind(this), this.block.imageStateChanged.add(this.syncUI), this.innerElement.on("vclick", function (e) {
            if (0 === $(e.target).closest(".toolbar-image-url").length) {
                var t = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {select: SL.models.Media.IMAGE});
                t.selected.addOnce(this.onMediaLibrarySelection)
            } else this.onEditURLClicked(e)
        }.bind(this))
    }, syncUI: function () {
        if (this.block.hasImage()) {
            var e = this.block.get("image.src");
            this.innerElement.css("background-image", 'url("' + e + '")', ""), this.placeholderElement.hide(), this.urlElement.toggle(0 !== e.search(SL.config.S3_HOST))
        } else this.innerElement.css("background-image", ""), this.placeholderElement.show(), this.urlElement.show();
        this.block.isLoading() || this.block.isUploading() ? (this.spinnerElement.show(), SL.util.html.generateSpinners()) : this.spinnerElement.hide()
    }, onEditURLClicked: function (e) {
        e.preventDefault();
        var t = SL.prompt({
            anchor: this.urlElement,
            title: "Image URL",
            type: "input",
            confirmLabel: "Save",
            alignment: "r",
            data: {value: this.block.get("image.src"), placeholder: "http://...", width: 400}
        });
        t.confirmed.add(function (e) {
            this.block.set("image.src", e), this.syncUI()
        }.bind(this))
    }, onMediaLibrarySelection: function (e) {
        this.block.setImageModel(e), this.syncUI()
    }, destroy: function () {
        this.block.imageStateChanged && this.block.imageStateChanged.remove(this.syncUI), this._super()
    }
});
SL("editor.components.toolbars.options").LetterSpacing = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "letter-spacing",
            label: "Letter spacing",
            property: "style.letter-spacing",
            progressbar: false
        }, t))
    }
});
SL("editor.components.toolbars.options").LineColor = SL.editor.components.toolbars.options.Color.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "line-color", label: "Color", property: "attribute.data-line-color"}, t))
    }
});
SL("editor.components.toolbars.options").LineEndType = SL.editor.components.toolbars.options.SelectLineType.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "line-end-type",
            panelType: "line-end-type",
            label: "End",
            property: "attribute.data-line-end-type",
            items: e.getPropertySettings("attribute.data-line-end-type").options
        }, t))
    }
});
SL("editor.components.toolbars.options").LineHeight = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "line-height",
            label: "Line Height",
            property: "style.line-height",
            progressbar: false
        }, t))
    }
});
SL("editor.components.toolbars.options").LineStartType = SL.editor.components.toolbars.options.SelectLineType.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "line-start-type",
            panelType: "line-start-type",
            label: "Start",
            property: "attribute.data-line-start-type",
            items: e.getPropertySettings("attribute.data-line-start-type").options
        }, t))
    }
});
SL("editor.components.toolbars.options").LineStyle = SL.editor.components.toolbars.options.Select.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "line-style",
            panelType: "line-style",
            panelWidth: "auto",
            panelAlignment: "b",
            label: "Style",
            property: "attribute.data-line-style",
            items: e.getPropertySettings("attribute.data-line-style").options
        }, t))
    }, renderItem: function (e) {
        var t = $('<div class="toolbar-select-item" data-value="' + e.value + '">');
        t.appendTo(this.panel.contentElement), this.createPreviewSVG(t, e.value, 126, 40)
    }, displaySelectedValue: function () {
        this.triggerElement.find("svg").remove(), this.createPreviewSVG(this.triggerElement, this.value, 126, 40)
    }, createPreviewSVG: function (e, t, i, n) {
        var r = document.createElementNS(SL.util.svg.NAMESPACE, "svg");
        r.setAttribute("xmlns", SL.util.svg.NAMESPACE), r.setAttribute("version", "1.1"), r.setAttribute("width", i), r.setAttribute("height", n), r.setAttribute("viewBox", "0 0 " + i + " " + n), r.setAttribute("preserveAspectRatio", "xMidYMid"), SL.editor.blocks.Line.generate(r, {
            interactive: false,
            startType: null,
            endType: null,
            style: t,
            color: "#333333",
            width: 6,
            x1: 0,
            y1: n / 2,
            x2: i,
            y2: n / 2
        }), e.append(r)
    }
});
SL("editor.components.toolbars.options").LineWidth = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "line-width", label: "Thickness", property: "attribute.data-line-width"}, t))
    }
});
SL("editor.components.toolbars.options").LinkURL = SL.editor.components.toolbars.options.Text.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "link-url", property: "link.href", placeholder: "http://"}, t))
    }, writeToBlock: function () {
        var e = this.getValue().trim();
        SL.util.string.URL_REGEX.test(e) || /^#\/\d/.test(e) ? this.block.set(this.config.property, e) : this.block.set(this.config.property, "")
    }
});
SL("editor.components.toolbars.options").MathColor = SL.editor.components.toolbars.options.Color.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "math-color", label: "Color", property: "style.color"}, t))
    }
});
SL("editor.components.toolbars.options").MathInput = SL.editor.components.toolbars.options.Text.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "math",
            label: 'Math <span style="text-transform: none;">(TeX)</span>',
            property: "math.value",
            placeholder: "Paste or type TeX...",
            helpTooltip: "This block is used to display math formulae. Math is written using TeX. Click for more info.",
            helpTooltipLink: "http://help.slides.com/knowledgebase/articles/446424",
            multiline: true,
            expandable: true,
            maxlength: 1e7
        }, t))
    }, bind: function () {
        this._super(), this.block && (this.onEditingRequested = this.onEditingRequested.bind(this), this.block.editingRequested.add(this.onEditingRequested))
    }, destroy: function () {
        this.block && this.block.editingRequested.remove(this.onEditingRequested), this._super()
    }, onEditingRequested: function () {
        this.expand()
    }
});
SL("editor.components.toolbars.options").MathSize = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "text-size", label: "Scale", property: "style.font-size"}, t))
    }, setValue: function () {
        if (this._super.apply(this, arguments), this.measurementsBeforeResize) {
            var e = this.block.measure(), t = this.measurementsBeforeResize.x + (this.measurementsBeforeResize.width - e.width) / 2, i = this.measurementsBeforeResize.y + (this.measurementsBeforeResize.height - e.height) / 2;
            isNaN(t) || isNaN(i) || this.block.move(t, i)
        }
    }, onChangeStart: function () {
        this.measurementsBeforeResize = this.block.measure(), this._super.apply(this, arguments)
    }, onChangeEnd: function () {
        this.measurementsBeforeResize = null, this._super.apply(this, arguments)
    }
});
SL("editor.components.toolbars.options").Opacity = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "opacity", label: "Opacity", property: "style.opacity"}, t))
    }
});
SL("editor.components.toolbars.options").Padding = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "padding", label: "Padding", property: "style.padding"}, t))
    }, syncPaddingHint: function () {
        this.isChanging() ? this.block.showPaddingHint() : this.block.hidePaddingHint()
    }, writeToBlock: function () {
        this._super.apply(this, arguments), this.syncPaddingHint()
    }, onMouseMove: function () {
        this._super.apply(this, arguments), this.syncPaddingHint()
    }, onMouseUp: function () {
        this._super.apply(this, arguments), this.syncPaddingHint()
    }, onInputFocused: function () {
        this._super.apply(this, arguments), this.syncPaddingHint()
    }, onInputBlurred: function () {
        this._super.apply(this, arguments), this.syncPaddingHint()
    }
});
SL("editor.components.toolbars.options").ShapeFillColor = SL.editor.components.toolbars.options.Color.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "shape-fill-color",
            label: "Color",
            property: "attribute.data-shape-fill-color",
            alpha: true
        }, t))
    }
});
SL("editor.components.toolbars.options").ShapeStretch = SL.editor.components.toolbars.options.Checkbox.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "shape-stretch",
            label: "Stretch to Fill",
            property: "attribute.data-shape-stretch"
        }, t))
    }
});
SL("editor.components.toolbars.options").ShapeStrokeColor = SL.editor.components.toolbars.options.Color.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "shape-stroke-color",
            label: "Color",
            property: "attribute.data-shape-stroke-color"
        }, t))
    }
});
SL("editor.components.toolbars.options").ShapeStrokeWidth = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "shape-stroke-width",
            label: "Width",
            property: "attribute.data-shape-stroke-width"
        }, t))
    }
});
SL("editor.components.toolbars.options").ShapeType = SL.editor.components.toolbars.options.Select.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "shape-type",
            panelType: "shape-type",
            panelWidth: 246,
            panelMaxHeight: 430,
            label: "Shape",
            property: "attribute.data-shape-type",
            items: e.getPropertySettings("attribute.data-shape-type").options
        }, t))
    }, renderPanel: function () {
        this._super.apply(this, arguments), this.renderAttribution()
    }, renderItem: function (e) {
        var t = 32, i = 32, n = document.createElementNS(SL.util.svg.NAMESPACE, "svg");
        n.setAttribute("xmlns", SL.util.svg.NAMESPACE), n.setAttribute("version", "1.1"), n.setAttribute("width", t), n.setAttribute("height", i), n.setAttribute("preserveAspectRatio", "xMidYMid");
        var r = SL.editor.blocks.Shape.shapeFromType(e.value);
        r.setAttribute("fill", "#333333"), n.appendChild(r);
        var o = $('<div class="toolbar-select-item" data-value="' + e.value + '">');
        o.append(n), o.appendTo(this.panel.contentElement);
        var s = SL.util.svg.boundingBox(r);
        n.setAttribute("viewBox", [Math.round(s.x) || 0, Math.round(s.y) || 0, Math.round(s.width) || 32, Math.round(s.height) || 32].join(" "))
    }, renderAttribution: function () {
        var e = $('<div class="toolbar-select-attribution">');
        e.html('<a href="/about#credits" target="_blank">Icons from IcoMoon</a>'), e.appendTo(this.panel.contentElement)
    }, displaySelectedValue: function () {
        var e = 32, t = 32, i = document.createElementNS(SL.util.svg.NAMESPACE, "svg");
        i.setAttribute("xmlns", SL.util.svg.NAMESPACE), i.setAttribute("version", "1.1"), i.setAttribute("width", e), i.setAttribute("height", t), i.setAttribute("preserveAspectRatio", "xMidYMid");
        var n = SL.editor.blocks.Shape.shapeFromType(this.value, e, t);
        n.setAttribute("fill", "#ffffff"), i.appendChild(n), this.triggerElement.find("svg").remove(), this.triggerElement.append(i);
        var r = SL.util.svg.boundingBox(n);
        i.setAttribute("viewBox", [Math.round(r.x) || 0, Math.round(r.y) || 0, Math.round(r.width) || 32, Math.round(r.height) || 32].join(" "))
    }
});
SL("editor.components.toolbars.options").TableBorderColor = SL.editor.components.toolbars.options.Color.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "table-border-color",
            label: "Border color",
            property: "attribute.data-table-border-color",
            alpha: true
        }, t))
    }, getTriggerColor: function () {
        return this.block.getTableBorderColor()
    }
});
SL("editor.components.toolbars.options").TableBorderWidth = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "table-border-width",
            label: "Border width",
            property: "attribute.data-table-border-width"
        }, t))
    }
});
SL("editor.components.toolbars.options").TableCols = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "table-cols",
            label: "Columns",
            property: "attribute.data-table-cols",
            progressbar: false
        }, t)), this.onTableSizeChanged = this.onTableSizeChanged.bind(this), e.tableSizeChanged.add(this.onTableSizeChanged)
    }, onTableSizeChanged: function () {
        this.readFromBlock()
    }, destroy: function () {
        this.block.tableSizeChanged && this.block.tableSizeChanged.remove(this.onTableSizeChanged), this._super()
    }
});
SL("editor.components.toolbars.options").TableHasHeader = SL.editor.components.toolbars.options.Checkbox.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "table-has-header",
            label: "Header",
            property: "attribute.data-table-has-header",
            tooltip: "The first table row is a header."
        }, t))
    }
});
SL("editor.components.toolbars.options").TablePadding = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "table-padding",
            label: "Cell padding",
            property: "attribute.data-table-padding"
        }, t))
    }
});
SL("editor.components.toolbars.options").TableRows = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "table-rows",
            label: "Rows",
            property: "attribute.data-table-rows",
            progressbar: false
        }, t)), this.onTableSizeChanged = this.onTableSizeChanged.bind(this), e.tableSizeChanged.add(this.onTableSizeChanged)
    }, onTableSizeChanged: function () {
        this.readFromBlock()
    }, destroy: function () {
        this.block.tableSizeChanged && this.block.tableSizeChanged.remove(this.onTableSizeChanged), this._super()
    }
});
SL("editor.components.toolbars.options").TextAlign = SL.editor.components.toolbars.options.Radio.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "text-align",
            label: "Text Alignment",
            property: "style.text-align",
            items: e.getPropertySettings("style.text-align").options
        }, t))
    }
});
SL("editor.components.toolbars.options").TextColor = SL.editor.components.toolbars.options.Color.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "text-color", label: "Text Color", property: "style.color"}, t))
    }
});
SL("editor.components.toolbars.options").TextSize = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "text-size",
            label: "Text Scale",
            property: "style.font-size",
            progressbar: false
        }, t))
    }
});
SL("editor.components.toolbars.options").TransitionDelay = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({type: "transition-delay", label: "Delay", property: "style.transition-delay"}, t))
    }
});
SL("editor.components.toolbars.options").TransitionDuration = SL.editor.components.toolbars.options.Stepper.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "transition-duration",
            label: "Duration",
            property: "style.transition-duration"
        }, t))
    }
});