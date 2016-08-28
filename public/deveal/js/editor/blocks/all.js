SL("editor.blocks.behavior").TransformLine = Class.extend({
    ANCHOR_SIZE: 16, init: function (e) {
        this.block = e, this.state = {
            direction: null,
            originalCursorPosition: {x: 0, y: 0},
            originalPoint: {x: 0, y: 0}
        }, this.render(), this.bind(), this.layout()
    }, render: function () {
        this.domElement = $('<div class="sl-block-transform editing-ui">'), this.anchors = {}, this.anchors.p1 = $('<div class="anchor" data-direction="p1">').appendTo(this.domElement), this.anchors.p2 = $('<div class="anchor" data-direction="p2">').appendTo(this.domElement)
    }, bind: function () {
        this.onMouseDown = this.onMouseDown.bind(this), this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.transformStarted = new signals.Signal, this.transformEnded = new signals.Signal;
        for (var e in this.anchors)this.anchors[e].on("vmousedown", this.onMouseDown)
    }, layout: function () {
        var e = this.block.getViewBox();
        this.anchors.p1.css({
            left: this.block.get("attribute.data-line-x1") - e.x - 1,
            top: this.block.get("attribute.data-line-y1") - e.y - 1
        }), this.anchors.p2.css({
            left: this.block.get("attribute.data-line-x2") - e.x - 1,
            top: this.block.get("attribute.data-line-y2") - e.y - 1
        })
    }, show: function () {
        0 === this.domElement.parent().length && (this.domElement.appendTo(this.block.domElement), this.domElement.addClass("visible"))
    }, hide: function () {
        this.domElement.detach(), this.domElement.removeClass("visible")
    }, destroy: function () {
        $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp), this.transformStarted.dispose(), this.transformEnded.dispose(), this.domElement.remove()
    }, isResizing: function () {
        return !!this.state.direction
    }, isResizingCentered: function () {
        return this.isResizing() && this.state.centered
    }, isResizingProportionally: function () {
        return this.isResizing() && this.state.proportional
    }, getState: function () {
        return this.state
    }, onMouseDown: function (e) {
        e.preventDefault(), this.state.direction = $(e.currentTarget).attr("data-direction"), this.state.direction && ($(document).on("vmousemove", this.onMouseMove), $(document).on("vmouseup", this.onMouseUp), this.moved = false, this.state.originalCursorPosition.x = e.clientX, this.state.originalCursorPosition.y = e.clientY, this.state.direction === SL.editor.blocks.Line.POINT_1 ? (this.state.originalPoint.x = this.block.get("attribute.data-line-x1"), this.state.originalPoint.y = this.block.get("attribute.data-line-y1")) : (this.state.originalPoint.x = this.block.get("attribute.data-line-x2"), this.state.originalPoint.y = this.block.get("attribute.data-line-y2")))
    }, onMouseMove: function (e) {
        e.preventDefault(), this.moved || (this.transformStarted.dispatch(this), SL.editor.controllers.Guides.start([this.block], {
            action: "line-anchor",
            direction: this.state.direction
        })), this.moved = true;
        var t = e.clientX - this.state.originalCursorPosition.x, i = e.clientY - this.state.originalCursorPosition.y, n = this.state.originalPoint.x + t, r = this.state.originalPoint.y + i;
        this.block.set(this.state.direction === SL.editor.blocks.Line.POINT_1 ? {
            "attribute.data-line-x1": n,
            "attribute.data-line-y1": r
        } : {"attribute.data-line-x2": n, "attribute.data-line-y2": r}), SL.editor.controllers.Guides.sync()
    }, onMouseUp: function (e) {
        e.preventDefault(), $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp), SL.editor.controllers.Guides.stop(), this.moved && this.transformEnded.dispatch(this), this.state.direction = null
    }
});

SL("editor.blocks.behavior").Transform = Class.extend({
        ANCHOR_SIZE: 16, init: function (e) {
            this.block = e, this.state = {
                direction: null,
                centered: false,
                proportional: false,
                originalMeasurements: null,
                originalCursorPosition: {x: 0, y: 0}
            }, this.render(), this.bind()
        }, render: function () {
            this.domElement = $('<div class="sl-block-transform editing-ui">'), this.domElement.attr({
                "data-horizontal": this.block.options.horizontalResizing,
                "data-vertical": this.block.options.verticalResizing
            }), this.anchors = {}, this.anchors.n = $('<div class="anchor" data-direction="n">').appendTo(this.domElement), this.anchors.e = $('<div class="anchor" data-direction="e">').appendTo(this.domElement), this.anchors.s = $('<div class="anchor" data-direction="s">').appendTo(this.domElement), this.anchors.w = $('<div class="anchor" data-direction="w">').appendTo(this.domElement), this.anchors.nw = $('<div class="anchor" data-direction="nw">').appendTo(this.domElement), this.anchors.ne = $('<div class="anchor" data-direction="ne">').appendTo(this.domElement), this.anchors.se = $('<div class="anchor" data-direction="se">').appendTo(this.domElement), this.anchors.sw = $('<div class="anchor" data-direction="sw">').appendTo(this.domElement)
        }, bind: function () {
            this.onMouseDown = this.onMouseDown.bind(this), this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.transformStarted = new signals.Signal, this.transformEnded = new signals.Signal;
            for (var e in this.anchors)this.anchors[e].on("vmousedown", this.onMouseDown)
        }, show: function () {
            0 === this.domElement.parent().length && (this.domElement.appendTo(this.block.domElement), this.domElement.addClass("visible"))
        }, hide: function () {
            this.domElement.detach(), this.domElement.removeClass("visible")
        }, destroy: function () {
            this.domElement.remove()
        }, isResizing: function () {
            return !!this.state.direction
        }, isResizingCentered: function () {
            return this.isResizing() && this.state.centered
        }, isResizingProportionally: function () {
            return this.isResizing() && this.state.proportional
        }, getState: function () {
            return this.state
        }, onMouseDown: function (e) {
            e.preventDefault(), this.state.direction = $(e.currentTarget).attr("data-direction"), this.state.direction && ($(document).on("vmousemove", this.onMouseMove), $(document).on("vmouseup", this.onMouseUp), this.moved = false, this.state.originalCursorPosition.x = e.clientX, this.state.originalCursorPosition.y = e.clientY, this.state.originalMeasurements = this.block.measure(true))
        }, onMouseMove: function (e) {
            e.preventDefault(), this.moved || (this.transformStarted.dispatch(this), SL.editor.controllers.Guides.start([this.block], {
                action: "resize",
                direction: this.state.direction
            })), this.moved = true;
            var t = e.clientX - this.state.originalCursorPosition.x, i = e.clientY - this.state.originalCursorPosition.y;
            e.altKey && (t *= 2, i *= 2);
            var n = "", r = "";
            switch (this.state.direction) {
                case"e":
                    n = Math.max(this.state.originalMeasurements.width + t, 1);
                    break;
                case"w":
                    n = Math.max(this.state.originalMeasurements.width - t, 1);
                    break;
                case"s":
                    r = Math.max(this.state.originalMeasurements.height + i, 1);
                    break;
                case"n":
                    r = Math.max(this.state.originalMeasurements.height - i, 1);
                    break;
                case"nw":
                    n = Math.max(this.state.originalMeasurements.width - t, 1), r = Math.max(this.state.originalMeasurements.height - i, 1);
                    break;
                case"ne":
                    n = Math.max(this.state.originalMeasurements.width + t, 1), r = Math.max(this.state.originalMeasurements.height - i, 1);
                    break;
                case"se":
                    n = Math.max(this.state.originalMeasurements.width + t, 1), r = Math.max(this.state.originalMeasurements.height + i, 1);
                    break;
                case"sw":
                    n = Math.max(this.state.originalMeasurements.width - t, 1), r = Math.max(this.state.originalMeasurements.height + i, 1)
            }
            this.block.hasAspectRatio() ? ("" === n && (n = this.state.originalMeasurements.width * (r / this.state.originalMeasurements.height)), "" === r && (r = this.state.originalMeasurements.height * (n / this.state.originalMeasurements.width))) : ("" === n && (n = this.state.originalMeasurements.width), "" === r && (r = this.state.originalMeasurements.height)), this.state.centered = e.altKey, this.state.proportional = e.shiftKey, this.block.resize({
                width: n,
                height: r,
                direction: this.state.direction
            }), SL.editor.controllers.Guides.sync()
        }, onMouseUp: function (e) {
            e.preventDefault(), $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp), SL.editor.controllers.Guides.stop(), this.moved && this.transformEnded.dispatch(this), this.state.direction = null, this.state.centered = null, this.state.proportional = null
        }
    });

SL("editor.blocks").Code = SL.editor.blocks.Base.extend({
        init: function (e) {
            this._super("code", e), this.editingRequested = new signals.Signal
        }, setup: function () {
            this._super(), this.properties.code = {
                value: {setter: this.setCode.bind(this), getter: this.getCode.bind(this)},
                language: {
                    defaultValue: "none",
                    setter: this.setCodeLanguage.bind(this),
                    getter: this.getCodeLanguage.bind(this),
                    options: [{value: "none", title: "Automatic"}, {value: "1c", title: "1C"}, {
                        value: "actionscript",
                        title: "ActionScript"
                    }, {value: "apache", title: "Apache"}, {value: "applescript", title: "AppleScript"}, {
                        value: "asciidoc",
                        title: "AsciiDoc"
                    }, {value: "bash", title: "Bash"}, {value: "clojure", title: "Clojure"}, {
                        value: "cmake",
                        title: "CMake"
                    }, {value: "coffeescript", title: "CoffeeScript"}, {value: "cpp", title: "C++"}, {
                        value: "cs",
                        title: "C#"
                    }, {value: "css", title: "CSS"}, {value: "d", title: "D"}, {
                        value: "delphi",
                        title: "Delphi"
                    }, {value: "diff", title: "Diff"}, {value: "django", title: "Django "}, {
                        value: "dos",
                        title: "DOS"
                    }, {value: "elixir", title: "Elixir"}, {value: "elm", title: "Elm"}, {
                        value: "erlang",
                        title: "Erlang"
                    }, {value: "fix", title: "FIX"}, {value: "fsharp", title: "F#"}, {
                        value: "gherkin",
                        title: "gherkin"
                    }, {value: "glsl", title: "GLSL"}, {value: "go", title: "Go"}, {
                        value: "haml",
                        title: "Haml"
                    }, {value: "handlebars", title: "Handlebars"}, {value: "haskell", title: "Haskell"}, {
                        value: "xml",
                        title: "HTML"
                    }, {value: "http", title: "HTTP"}, {value: "ini", title: "Ini file"}, {
                        value: "java",
                        title: "Java"
                    }, {value: "javascript", title: "JavaScript"}, {value: "json", title: "JSON"}, {
                        value: "lasso",
                        title: "Lasso"
                    }, {value: "less", title: "LESS"}, {value: "lisp", title: "Lisp"}, {
                        value: "livecodeserver",
                        title: "LiveCode Server"
                    }, {value: "lua", title: "Lua"}, {value: "makefile", title: "Makefile"}, {
                        value: "markdown",
                        title: "Markdown"
                    }, {value: "mathematica", title: "Mathematica"}, {value: "matlab", title: "Matlab"}, {
                        value: "nginx",
                        title: "nginx"
                    }, {value: "objectivec", title: "Objective C"}, {value: "perl", title: "Perl"}, {
                        value: "php",
                        title: "PHP"
                    }, {value: "python", title: "Python"}, {value: "r", title: "R"}, {
                        value: "ruby",
                        title: "Ruby"
                    }, {value: "ruleslanguage", title: "Oracle Rules Language"}, {
                        value: "rust",
                        title: "Rust"
                    }, {value: "scala", title: "Scala"}, {value: "scss", title: "SCSS"}, {
                        value: "smalltalk",
                        title: "SmallTalk"
                    }, {value: "sql", title: "SQL"}, {value: "stylus", title: "Stylus"}, {
                        value: "swift",
                        title: "Swift"
                    }, {value: "tex", title: "TeX"}, {value: "vbnet", title: "VB.NET"}, {
                        value: "vbscript",
                        title: "VBScript"
                    }, {value: "vim", title: "vim"}, {value: "xml", title: "XML"}, {value: "yaml", title: "YAML"}]
                },
                theme: {
                    defaultValue: "zenburn",
                    setter: this.setCodeTheme.bind(this),
                    getter: this.getCodeTheme.bind(this),
                    options: [{value: "zenburn", title: "Zenburn"}, {value: "ascetic", title: "Ascetic"}, {
                        value: "far",
                        title: "Far"
                    }, {value: "github-gist", title: "GitHub Gist"}, {value: "ir-black", title: "Ir Black"}, {
                        value: "monokai",
                        title: "Monokai"
                    }, {value: "obsidian", title: "Obsidian"}, {
                        value: "solarized-dark",
                        title: "Solarized Dark"
                    }, {value: "solarized-light", title: "Solarized Light"}, {
                        value: "tomorrow",
                        title: "Tomorrow"
                    }, {value: "xcode", title: "Xcode"}]
                }
            }
        }, paint: function () {
            if (this.domElement.find(".sl-block-placeholder, .sl-block-content-preview").remove(), this.isEmpty())this.showPlaceholder(); else {
                var e = $('<div class="editing-ui sl-block-content-preview visible-in-preview">').appendTo(this.contentElement), t = this.getPreElement().clone().appendTo(e);
                hljs.highlightBlock(t.get(0))
            }
            this.syncZ()
        }, setDefaults: function () {
            this._super(), this.resize({width: 500, height: 300});
            var e = this.getDefaultLanguage();
            e && this.setCodeLanguage(e)
        }, getDefaultLanguage: function () {
            if ("string" == typeof SL.editor.blocks.Code.defaultLanguage)return SL.editor.blocks.Code.defaultLanguage;
            for (var e = $('.reveal .sl-block[data-block-type="code"] pre[class!="none"]').get(), t = 0; t < e.length; t++) {
                var i = this.getCodeLanguageFromPre($(e[t]));
                if (i)return i
            }
            return null
        }, setCode: function (e) {
            this.getCodeElement().html(SL.util.escapeHTMLEntities(e)), this.paint()
        }, getCode: function () {
            return SL.util.unescapeHTMLEntities(this.getCodeElement().html())
        }, setCodeLanguage: function (e) {
            this.getPreElement().attr("class", e), this.paint(), SL.editor.blocks.Code.defaultLanguage = e
        }, getCodeLanguage: function () {
            return this.getCodeLanguageFromPre(this.getPreElement())
        }, getCodeLanguageFromPre: function (e) {
            var t = e.attr("class") || "";
            return t = t.replace(/hljs/gi, ""), t = t.trim()
        }, setCodeTheme: function (e) {
            this.contentElement.attr("data-highlight-theme", e)
        }, getCodeTheme: function () {
            return this.contentElement.attr("data-highlight-theme")
        }, getToolbarOptions: function () {
            return [SL.editor.components.toolbars.options.Code, SL.editor.components.toolbars.options.CodeLanguage, SL.editor.components.toolbars.options.CodeTheme, SL.editor.components.toolbars.options.TextSize, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
        }, getPreElement: function () {
            var e = this.contentElement.find(">pre");
            return 0 === e.length && (e = $("<pre><code></code></pre>").appendTo(this.contentElement)), e
        }, getCodeElement: function () {
            var e = this.getPreElement(), t = e.find(">code");
            return 0 === t.length && (t = $("<code>").appendTo(e)), t
        }, isEmpty: function () {
            return !this.isset("code.value")
        }, onDoubleClick: function (e) {
            this._super(e), this.editingRequested.dispatch()
        }, onKeyDown: function (e) {
            this._super(e), 13 !== e.keyCode || SL.util.isTypingEvent(e) || (this.editingRequested.dispatch(), e.preventDefault())
        }
    });

SL("editor.blocks").Iframe = SL.editor.blocks.Base.extend({
        init: function (e) {
            this._super("iframe", e), this.editingRequested = new signals.Signal, this.iframeSourceChanged = new signals.Signal, this.paint()
        }, setup: function () {
            this._super(), this.setIframeURL = this.setIframeURL.bind(this), this.getIframeURL = this.getIframeURL.bind(this), this.setIframeAutoplay = this.setIframeAutoplay.bind(this), this.getIframeAutoplay = this.getIframeAutoplay.bind(this), this.setIframeURL = $.debounce(this.setIframeURL, 400), this.properties.iframe = {
                src: {
                    setter: this.setIframeURL,
                    getter: this.getIframeURL
                }, autoplay: {defaultValue: false, setter: this.setIframeAutoplay, getter: this.getIframeAutoplay}
            }
        }, paint: function () {
            this._super.apply(this, arguments);
            var e = this.getIframeURL(), t = window.location.protocol;
            "https:" === t && e && /^http:/gi.test(e) ? 0 === this.domElement.find(".sl-block-overlay-message").length && this.domElement.append(['<div class="editing-ui sl-block-overlay sl-block-overlay-message below-content vcenter">', '<div class="vcenter-target">Cannot display non-HTTPS iframe while in the editor.</div>', "</div>"].join("")) : this.domElement.find(".sl-block-overlay-message").remove()
        }, setDefaults: function () {
            this._super(), this.resize({width: 360, height: 300})
        }, getIframeURL: function () {
            return this.getIframeElement().attr("src") || this.getIframeElement().attr("data-src")
        }, setIframeURL: function (e) {
            e !== this.get("iframe.src") && (this.getIframeElement().attr({
                src: e,
                "data-src": e
            }), this.iframeSourceChanged.dispatch(e)), this.paint()
        }, getIframeAutoplay: function () {
            return this.getIframeElement().get(0).hasAttribute("data-autoplay")
        }, setIframeAutoplay: function (e) {
            e === true ? this.getIframeElement().attr("data-autoplay", "") : this.getIframeElement().removeAttr("data-autoplay")
        }, getToolbarOptions: function () {
            return [SL.editor.components.toolbars.options.IframeSRC, SL.editor.components.toolbars.options.IframeAutoplay, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Padding, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
        }, getIframeElement: function () {
            var e = this.contentElement.find("iframe");
            return 0 === e.length && (e = $("<iframe>").appendTo(this.contentElement)), e.attr({
                webkitallowfullscreen: "",
                mozallowfullscreen: "",
                allowfullscreen: "",
                sandbox: "allow-forms allow-scripts allow-popups allow-same-origin allow-pointer-lock"
            }), e
        }, isEmpty: function () {
            return !this.isset("iframe.src")
        }, destroy: function () {
            this.iframeSourceChanged.dispose(), this._super()
        }, onDoubleClick: function (e) {
            this._super(e), this.editingRequested.dispatch()
        }, onKeyDown: function (e) {
            this._super(e), 13 !== e.keyCode || SL.util.isTypingEvent(e) || (this.editingRequested.dispatch(), e.preventDefault())
        }
    });

SL("editor.blocks").Image = SL.editor.blocks.Base.extend({
        init: function (e) {
            this._super("image", e), this.plug(SL.editor.blocks.plugin.Link), this.imageURLChanged = new signals.Signal, this.imageStateChanged = new signals.Signal
        }, setup: function () {
            this._super(), this.properties.image = {
                src: {
                    setter: this.setImageURL.bind(this),
                    getter: this.getImageURL.bind(this)
                }
            }, this.properties.attribute["data-inline-svg"] = {defaultValue: false}
        }, bind: function () {
            this._super(), this.onUploadCompleted = this.onUploadCompleted.bind(this), this.onUploadFailed = this.onUploadFailed.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
        }, setDefaults: function () {
            this._super(), this.resize({
                width: 360,
                height: 300
            }), this.options.insertedFromToolbar && (this.options.introDelay = 300, this.browse())
        }, getToolbarOptions: function () {
            return [SL.editor.components.toolbars.options.Image, SL.editor.components.toolbars.options.ImageInlineSVG, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.Link, SL.editor.components.toolbars.groups.Animation].concat(this._super())
        }, setImageURL: function (e) {
            if (e !== this.getImageURL()) {
                this.loading = true, this.paint(), this.imageStateChanged.dispatch();
                var t = this.contentElement.find("img");
                0 === t.length ? (t = $('<img src="' + e + '">'), t.css("visibility", "hidden"), t.appendTo(this.contentElement)) : t.attr("src", e), t.off("load").on("load", function () {
                    t.css("visibility", ""), this.loading = false, this.syncAspectRatio(), this.paint(), this.imageStateChanged.dispatch(), this.paintInlineSVG()
                }.bind(this)), this.imageURLChanged.dispatch(e)
            }
        }, getImageURL: function () {
            return this.contentElement.find("img").attr("src")
        }, setImageModel: function (e) {
            e.isSVG() && this.set("attribute.data-inline-svg", e.get("inline")), this.intermediateModel = e, this.intermediateModel.isUploaded() ? this.onUploadCompleted() : (this.paint(), this.imageStateChanged.dispatch(), this.intermediateModel.uploadCompleted.add(this.onUploadCompleted), this.intermediateModel.uploadFailed.add(this.onUploadFailed))
        }, isLoading: function () {
            return !!this.loading || !!this.loadingSVG
        }, isUploading: function () {
            return !(!this.intermediateModel || !this.intermediateModel.isWaitingToUpload() && !this.intermediateModel.isUploading())
        }, hasImage: function () {
            var e = this.get("image.src");
            return !!("string" == typeof e && e.length > 0)
        }, isLoaded: function () {
            var e = this.getNaturalSize(true);
            return e && e.width > 0 && e.height > 0
        }, isSVG: function () {
            return this.hasImage() && /^svg/i.test(this.get("image.src").split(".").pop())
        }, getNaturalSize: function (e) {
            var t = this.contentElement.find("img");
            if (t.length) {
                var i = {};
                if (!e && (i.width = parseInt(t.attr("data-natural-width"), 10), i.height = parseInt(t.attr("data-natural-height"), 10), i.width && i.height))return i;
                if (i.width = t.get(0).naturalWidth, i.height = t.get(0).naturalHeight, i.width && i.height)return t.attr({
                    "data-natural-width": i.width,
                    "data-natural-height": i.height
                }), i
            }
            return null
        }, getAspectRatio: function (e) {
            var t = this.getNaturalSize(e);
            return t ? t.width / t.height : this._super()
        }, syncAspectRatio: function (e) {
            "undefined" == typeof e && (e = true);
            var t = this.getNaturalSize(e);
            if (t) {
                var i = this.measure();
                this.resize({width: i.width, height: i.height, center: true})
            }
        }, paint: function () {
            this.domElement.find(".sl-block-placeholder, .image-progress").remove(), this.isLoading() || this.isUploading() ? (this.domElement.append(['<div class="editing-ui sl-block-overlay image-progress">', '<span class="spinner centered"></span>', "</div>"].join("")), SL.util.html.generateSpinners()) : this.hasImage() || this.showPlaceholder();
            var e = this.contentElement.find("img");
            1 === e.length && "none" === e.css("display") && e.css("display", ""), this.syncZ()
        }, paintInlineSVG: function () {
            this.isSVG() && this.get("attribute.data-inline-svg") ? (this.loadingSVG = true, this.paint(), $.ajax({
                url: this.getImageURL() + "?t=" + Date.now(),
                type: "GET",
                dataType: "xml",
                context: this
            }).done(function (e) {
                var t = $(e).find("svg").first().get(0);
                if (t) {
                    if (t.setAttribute("preserveAspectRatio", "xMidYMid meet"), !t.hasAttribute("viewBox")) {
                        var i = this.getNaturalSize();
                        i && t.setAttribute("viewBox", "0 0 " + i.width + " " + i.height)
                    }
                    this.contentElement.find("img").css("display", "none"), this.contentElement.find("svg").remove(), this.contentElement.append(t)
                }
            }).always(function () {
                this.loadingSVG = false, this.paint(), this.imageStateChanged.dispatch()
            })) : (this.contentElement.find("img").css("display", ""), this.contentElement.find("svg").remove())
        }, clear: function () {
            this.contentElement.find("img").remove(), this.paint(), this.imageStateChanged.dispatch()
        }, browse: function () {
            var e = SL.popup.open(SL.editor.components.medialibrary.MediaLibrary, {select: SL.models.Media.IMAGE});
            e.selected.addOnce(this.setImageModel.bind(this))
        }, destroy: function () {
            this.intermediateModel && (this.intermediateModel.uploadCompleted.remove(this.onUploadCompleted), this.intermediateModel.uploadFailed.remove(this.onUploadFailed), this.intermediateModel = null), this.imageStateChanged.dispose(), this.imageStateChanged = null, this.imageURLChanged.dispose(), this.imageURLChanged = null, this._super()
        }, onUploadCompleted: function () {
            var e = this.intermediateModel.get("url");
            this.intermediateModel = null, this.set("image.src", e), this.imageStateChanged.dispatch()
        }, onUploadFailed: function () {
            this.intermediateModel = null, this.paint(), this.imageStateChanged.dispatch()
        }, onDoubleClick: function () {
            this.browse()
        }, onPropertyChanged: function (e) {
            "attribute.data-inline-svg" === e[0] && this.paintInlineSVG()
        }
    });

SL("editor.blocks").Line = SL.editor.blocks.Base.extend({
        init: function (e) {
            this._super("line", $.extend({
                minWidth: 1,
                minHeight: 1,
                horizontalResizing: false,
                verticalResizing: false
            }, e)), this.transform.destroy(), this.transform = new SL.editor.blocks.behavior.TransformLine(this), this.transform.transformStarted.add(this.onTransformStarted.bind(this)), this.transform.transformEnded.add(this.onTransformEnded.bind(this)), this.plug(SL.editor.blocks.plugin.Link)
        }, setup: function () {
            this._super(), this.properties.attribute["data-line-style"] = {
                defaultValue: "solid",
                options: [{value: "solid"}, {value: "dotted"}, {value: "dashed"}]
            }, this.properties.attribute["data-line-start-type"] = {
                defaultValue: "none",
                options: [{value: "none"}, {value: "line-arrow"}, {value: "arrow"}, {value: "circle"}, {value: "square"}]
            }, this.properties.attribute["data-line-end-type"] = {
                defaultValue: "none",
                options: [{value: "none"}, {value: "line-arrow"}, {value: "arrow"}, {value: "circle"}, {value: "square"}]
            }, this.properties.attribute["data-line-width"] = {
                unit: "px",
                type: "number",
                minValue: 1,
                maxValue: 50,
                defaultValue: SL.editor.blocks.Line.DEFAULT_LINE_WIDTH
            }, this.properties.attribute["data-line-color"] = {defaultValue: SL.editor.blocks.Line.DEFAULT_COLOR}, this.properties.attribute["data-line-x1"] = {
                type: "number",
                minValue: 0,
                maxValue: Number.MAX_VALUE,
                defaultValue: 0
            }, this.properties.attribute["data-line-y1"] = {
                type: "number",
                minValue: 0,
                maxValue: Number.MAX_VALUE,
                defaultValue: 0
            }, this.properties.attribute["data-line-x2"] = {
                type: "number",
                minValue: 0,
                maxValue: Number.MAX_VALUE,
                defaultValue: 0
            }, this.properties.attribute["data-line-y2"] = {
                type: "number",
                minValue: 0,
                maxValue: Number.MAX_VALUE,
                defaultValue: 0
            }
        }, bind: function () {
            this._super(), this.propertyChanged.add(this.onPropertyChanged.bind(this))
        }, setDefaults: function () {
            this._super(), this.set({
                "attribute.data-line-x1": 0,
                "attribute.data-line-y1": 200,
                "attribute.data-line-x2": 200,
                "attribute.data-line-y2": 0,
                "attribute.data-line-color": this.getPropertyDefault("attribute.data-line-color"),
                "attribute.data-line-start-type": this.getPropertyDefault("attribute.data-line-start-type"),
                "attribute.data-line-end-type": this.getPropertyDefault("attribute.data-line-end-type")
            })
        }, paint: function () {
            var e = this.getSVGElement();
            e.setAttribute("preserveAspectRatio", "xMidYMid"), e.innerHTML = "", SL.editor.blocks.Line.generate(e, {
                startType: this.get("attribute.data-line-start-type"),
                endType: this.get("attribute.data-line-end-type"),
                style: this.get("attribute.data-line-style"),
                color: this.get("attribute.data-line-color"),
                width: this.get("attribute.data-line-width"),
                x1: this.get("attribute.data-line-x1"),
                y1: this.get("attribute.data-line-y1"),
                x2: this.get("attribute.data-line-x2"),
                y2: this.get("attribute.data-line-y2")
            });
            var t = this.getViewBox();
            if (e.setAttribute("width", t.width), e.setAttribute("height", t.height), e.setAttribute("viewBox", [t.x, t.y, t.width, t.height].join(" ")), this.measurementsBeforeTransform) {
                var i = t.x - this.viewBoxBeforeTransform.x, n = t.y - this.viewBoxBeforeTransform.y;
                this.move(this.measurementsBeforeTransform.x + i, this.measurementsBeforeTransform.y + n)
            }
            this.transform && this.transform.layout()
        }, resize: function () {
            this._super.apply(this, arguments), this.paint()
        }, hitTest: function (e) {
            var t = this.getGlobalLinePoint(SL.editor.blocks.Line.POINT_1), i = this.getGlobalLinePoint(SL.editor.blocks.Line.POINT_2), n = SL.util.trig.isPointWithinRect(t.x, t.y, e) && SL.util.trig.isPointWithinRect(i.x, i.y, e);
            if (n)return true;
            var r = [[{x: e.x, y: e.y}, {x: e.x + e.width, y: e.y}], [{x: e.x + e.width, y: e.y}, {
                x: e.x + e.width,
                y: e.y + e.height
            }], [{x: e.x, y: e.y + e.height}, {x: e.x + e.width, y: e.y + e.height}], [{x: e.x, y: e.y}, {
                x: e.x,
                y: e.y + e.height
            }]];
            return r.some(function (e) {
                return !!SL.util.trig.findLineIntersection(t, i, e[0], e[1])
            })
        }, setGlobalLinePoint: function (e, t, i) {
            var n = this.getViewBox(), r = this.measure();
            e === SL.editor.blocks.Line.POINT_1 ? ("number" == typeof t && this.set("attribute.data-line-x1", t - (r.x - n.x)), "number" == typeof i && this.set("attribute.data-line-y1", i - (r.y - n.y))) : e === SL.editor.blocks.Line.POINT_2 && ("number" == typeof t && this.set("attribute.data-line-x2", t - (r.x - n.x)), "number" == typeof i && this.set("attribute.data-line-y2", i - (r.y - n.y)))
        }, getGlobalLinePoint: function (e) {
            var t = this.getViewBox(), i = this.measure();
            return e === SL.editor.blocks.Line.POINT_1 ? {
                x: i.x - t.x + this.get("attribute.data-line-x1"),
                y: i.y - t.y + this.get("attribute.data-line-y1")
            } : e === SL.editor.blocks.Line.POINT_2 ? {
                x: i.x - t.x + this.get("attribute.data-line-x2"),
                y: i.y - t.y + this.get("attribute.data-line-y2")
            } : void 0
        }, getOppositePointID: function (e) {
            return e === SL.editor.blocks.Line.POINT_1 ? SL.editor.blocks.Line.POINT_2 : SL.editor.blocks.Line.POINT_1
        }, getViewBox: function () {
            var e = this.get("attribute.data-line-x1"), t = this.get("attribute.data-line-y1"), i = this.get("attribute.data-line-x2"), n = this.get("attribute.data-line-y2"), r = {
                x: Math.round(Math.min(e, i)),
                y: Math.round(Math.min(t, n))
            };
            return r.width = Math.max(Math.round(Math.max(e, i) - r.x), 1), r.height = Math.max(Math.round(Math.max(t, n) - r.y), 1), r
        }, getSVGElement: function () {
            var e = this.contentElement.find("svg").get(0);
            return e || (e = document.createElementNS(SL.util.svg.NAMESPACE, "svg"), e.setAttribute("xmlns", SL.util.svg.NAMESPACE), e.setAttribute("version", "1.1"), this.contentElement.append(e)), e
        }, getLineElement: function () {
            var e = this.getSVGElement(), t = e.querySelector("line");
            return t || (t = document.createElementNS(SL.util.svg.NAMESPACE, "line"), e.appendChild(t)), t
        }, getToolbarOptions: function () {
            return [SL.editor.components.toolbars.groups.LineType, SL.editor.components.toolbars.options.LineStyle, SL.editor.components.toolbars.options.LineWidth, SL.editor.components.toolbars.options.LineColor, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.Link, SL.editor.components.toolbars.groups.Animation].concat(this._super())
        }, onPropertyChanged: function () {
            this.paint()
        }, onTransformStarted: function () {
            this.measurementsBeforeTransform = this.measure(), this.viewBoxBeforeTransform = this.getViewBox()
        }, onTransformEnded: function () {
            this.measurementsBeforeTransform = null, this.viewBoxBeforeTransform = null
        }
    });

SL.editor.blocks.Line.DEFAULT_COLOR = "#000000";
SL.editor.blocks.Line.DEFAULT_LINE_WIDTH = 2;
SL.editor.blocks.Line.POINT_1 = "p1";
SL.editor.blocks.Line.POINT_2 = "p2";

SL.editor.blocks.Line.roundPoints = function () {
        for (var e = 0; e < arguments.length; e++)arguments[e].x = Math.round(arguments[e].x), arguments[e].y = Math.round(arguments[e].y)
    };

SL.editor.blocks.Line.generate = function (e, t) {
        t = $.extend({
            color: SL.editor.blocks.Line.DEFAULT_COLOR,
            width: SL.editor.blocks.Line.DEFAULT_LINE_WIDTH,
            interactive: true,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        }, t);
        var i;
        t.interactive && t.width < 15 && (i = document.createElementNS(SL.util.svg.NAMESPACE, "line"), i.setAttribute("stroke", "rgba(0,0,0,0)"), i.setAttribute("stroke-width", 15), e.appendChild(i));
        var n = {x: t.x1, y: t.y1}, r = {
            x: t.x2,
            y: t.y2
        }, o = Math.max(SL.util.trig.distanceBetween(n, r), 1), s = 180 * (Math.atan2(r.y - n.y, r.x - n.x) + Math.PI / 2) / Math.PI;
        s = SL.util.math.limitDecimals(s, 3);
        var a = document.createElementNS(SL.util.svg.NAMESPACE, "line");
        if (a.setAttribute("stroke", t.color), a.setAttribute("stroke-width", t.width), e.appendChild(a), "dotted" === t.style) {
            var l = 2 * t.width;
            if (o > 2 * l) {
                var c = o / l;
                l *= c / Math.ceil(c)
            }
            a.setAttribute("stroke-dasharray", "0 " + l), a.setAttribute("stroke-linecap", "round")
        } else if ("dashed" === t.style) {
            var d = 3 * t.width, h = 3 * t.width;
            if (o > 2 * (d + h)) {
                var u = (o - h) / (d + h), p = u / Math.ceil(u);
                d *= p, h *= p
            }
            a.setAttribute("stroke-dasharray", d + " " + h), a.removeAttribute("stroke-linecap")
        } else a.removeAttribute("stroke-dasharray"), a.removeAttribute("stroke-linecap");
        var m, g, f = 3 * t.width, b = f / 2, v = Math.max(f, 8), C = v / 2;
        "line-arrow" === t.startType && (n.x += (r.x - n.x) * (.25 * v / o), n.y += (r.y - n.y) * (.25 * v / o), SL.editor.blocks.Line.roundPoints(n, r), m = document.createElementNS(SL.util.svg.NAMESPACE, "path"), m.setAttribute("style", "fill: rgba(0,0,0,0);"), m.setAttribute("stroke", t.color), m.setAttribute("stroke-width", t.width), m.setAttribute("transform", "translate(" + n.x + "," + n.y + ") rotate(" + s + ")"), m.setAttribute("d", ["M", .75 * -v, .75 * -v, "L", 0, 0, "L", .75 * v, .75 * -v].join(" ")), e.appendChild(m)), "line-arrow" === t.endType && (r.x += (n.x - r.x) * (.25 * v / o), r.y += (n.y - r.y) * (.25 * v / o), SL.editor.blocks.Line.roundPoints(n, r), g = document.createElementNS(SL.util.svg.NAMESPACE, "path"), g.setAttribute("style", "fill: rgba(0,0,0,0);"), g.setAttribute("stroke", t.color), g.setAttribute("stroke-width", t.width), g.setAttribute("transform", "translate(" + r.x + "," + r.y + ") rotate(" + s + ")"), g.setAttribute("d", ["M", .75 * v, .75 * v, "L", 0, 0, "L", .75 * -v, .75 * v].join(" ")), e.appendChild(g)), "arrow" === t.startType && (n.x += (r.x - n.x) * (C / o), n.y += (r.y - n.y) * (C / o), SL.editor.blocks.Line.roundPoints(n, r), m = document.createElementNS(SL.util.svg.NAMESPACE, "polygon"), m.setAttribute("fill", t.color), m.setAttribute("transform", "translate(" + n.x + "," + n.y + ") rotate(" + s + ")"), m.setAttribute("points", SL.util.svg.pointsToPolygon([0, C, C, -C, -C, -C])), e.appendChild(m)), "arrow" === t.endType && (r.x += (n.x - r.x) * (C / o), r.y += (n.y - r.y) * (C / o), SL.editor.blocks.Line.roundPoints(n, r), g = document.createElementNS(SL.util.svg.NAMESPACE, "polygon"), g.setAttribute("fill", t.color), g.setAttribute("transform", "translate(" + r.x + "," + r.y + ") rotate(" + s + ")"), g.setAttribute("points", SL.util.svg.pointsToPolygon([0, -C, C, C, -C, C])), e.appendChild(g)), "circle" === t.startType && (n.x += (r.x - n.x) * (b / o), n.y += (r.y - n.y) * (b / o), SL.editor.blocks.Line.roundPoints(n, r), m = SL.util.svg.ellipse(f, f), m.setAttribute("cx", n.x), m.setAttribute("cy", n.y), m.setAttribute("fill", t.color), e.appendChild(m)), "circle" === t.endType && (r.x += (n.x - r.x) * (b / o), r.y += (n.y - r.y) * (b / o), SL.editor.blocks.Line.roundPoints(n, r), g = SL.util.svg.ellipse(f, f), g.setAttribute("cx", r.x), g.setAttribute("cy", r.y), g.setAttribute("fill", t.color), e.appendChild(g)), "square" === t.startType && (n.x += (r.x - n.x) * (b / o), n.y += (r.y - n.y) * (b / o), SL.editor.blocks.Line.roundPoints(n, r), m = SL.util.svg.rect(f, f), m.setAttribute("fill", t.color), m.setAttribute("x", -b), m.setAttribute("y", -b), m.setAttribute("transform", "translate(" + n.x + "," + n.y + ") rotate(" + s + ")"), e.appendChild(m)), "square" === t.endType && (r.x += (n.x - r.x) * (b / o), r.y += (n.y - r.y) * (b / o), SL.editor.blocks.Line.roundPoints(n, r), g = SL.util.svg.rect(f, f), g.setAttribute("fill", t.color), g.setAttribute("x", -b), g.setAttribute("y", -b), g.setAttribute("transform", "translate(" + r.x + "," + r.y + ") rotate(" + s + ")"), e.appendChild(g)), SL.editor.blocks.Line.roundPoints(n, r), t.width % 2 === 1 && (n.x += .5, n.y += .5, r.x += .5, r.y += .5), a.setAttribute("x1", n.x), a.setAttribute("y1", n.y), a.setAttribute("x2", r.x), a.setAttribute("y2", r.y), i && (i.setAttribute("x1", n.x), i.setAttribute("y1", n.y), i.setAttribute("x2", r.x), i.setAttribute("y2", r.y))
    };

SL("editor.blocks").Math = SL.editor.blocks.Base.extend({
        init: function (e) {
            this._super("math", $.extend(e, {
                horizontalResizing: false,
                verticalResizing: false
            })), this.editingRequested = new signals.Signal
        }, setup: function () {
            this._super(), this.properties.math = {
                value: {
                    setter: this.setValue.bind(this),
                    getter: this.getValue.bind(this)
                }
            }
        }, paint: function () {
            if (this.domElement.find(".sl-block-placeholder, .sl-block-content-preview, .sl-block-overlay-warning").remove(), this.isEmpty())this.domElement.addClass("is-empty"), this.showPlaceholder(), this.getMathOutputElement().empty();
            else try {
                this.domElement.removeClass("is-empty"), katex.render(this.getMathInputElement().text(), this.getMathOutputElement().get(0))
            } catch (e) {
                this.domElement.addClass("is-empty"), this.domElement.append(['<div class="editing-ui sl-block-overlay sl-block-overlay-warning vcenter">', '<div class="vcenter-target">', '<span class="icon i-info" data-tooltip="' + e.message + '" data-tooltip-maxwidth="500"></span>', "An error occurred while parsing your equation.", "</div>", "</div>"].join(""))
            }
            this.syncZ()
        }, setDefaults: function () {
            this._super()
        }, setValue: function (e) {
            this.getMathInputElement().html(e), this.paint()
        }, getValue: function () {
            return this.getMathInputElement().text()
        }, getMathInputElement: function () {
            var e = this.contentElement.find(".math-input");
            return 0 === e.length && (e = $('<div class="math-input"></div>').appendTo(this.contentElement)), e
        }, getMathOutputElement: function () {
            this.contentElement.find(".math-output:gt(0)").remove();
            var e = this.contentElement.find(".math-output");
            return 0 === e.length && (e = $('<div class="math-output"></div>').appendTo(this.contentElement)), e
        }, getToolbarOptions: function () {
            return [SL.editor.components.toolbars.options.MathInput, SL.editor.components.toolbars.options.MathSize, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.MathColor, SL.editor.components.toolbars.options.BackgroundColor, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Padding, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
        }, isEmpty: function () {
            return !this.isset("math.value")
        }, onDoubleClick: function (e) {
            this._super(e), this.editingRequested.dispatch()
        }, onKeyDown: function (e) {
            this._super(e), 13 !== e.keyCode || SL.util.isTypingEvent(e) || (this.editingRequested.dispatch(), e.preventDefault())
        }
    });

SL("editor.blocks.plugin").HTML = Class.extend({
        init: function (e) {
            this.block = e, this.block.editHTML = function () {
                var e = SL.popup.open(SL.components.popup.EditHTML, {html: this.contentElement.html()});
                e.saved.add(function (e) {
                    this.setCustomHTML(e)
                }.bind(this))
            }.bind(e), this.block.setCustomHTML = function (e) {
                this.contentElement.attr("data-has-custom-html", ""), this.contentElement.html(e)
            }.bind(e), this.block.setHTML = function (e) {
                this.contentElement.html(e)
            }.bind(e), this.block.hasCustomHTML = function () {
                return this.contentElement.get(0).hasAttribute("data-has-custom-html")
            }.bind(e)
        }, destroy: function () {
            delete this.block.editHTML, delete this.block.setCustomHTML, delete this.block.hasCustomHTML
        }
    });

SL("editor.blocks.plugin").Link = Class.extend({
        init: function (e) {
            this.block = e, this.block.setLinkURL = function (e) {
                "string" == typeof e ? (this.isLinked() === false && this.changeContentElementType("a"), this.contentElement.attr("href", e), this.contentElement.attr("target", "_blank"), /^#\/\d/.test(e) && this.contentElement.removeAttr("target")) : (this.contentElement.removeAttr("target"), this.changeContentElementType(this.options.contentElementType))
            }.bind(e), this.block.getLinkURL = function () {
                return this.contentElement.attr("href")
            }.bind(e), this.block.isLinked = function () {
                return this.contentElement.is("a")
            }.bind(e), this.block.properties.link = {
                href: {
                    setter: this.block.setLinkURL,
                    getter: this.block.getLinkURL,
                    checker: this.block.isLinked
                }
            }
        }, destroy: function () {
            delete this.block.properties.link, delete this.block.setLinkURL, delete this.block.getLinkURL, delete this.block.isLinked
        }
    });

SL("editor.blocks").Shape = SL.editor.blocks.Base.extend({
        init: function (e) {
            this._super("shape", $.extend({minWidth: 4, minHeight: 4}, e)), this.plug(SL.editor.blocks.plugin.Link)
        }, setup: function () {
            this._super(), this.properties.attribute["data-shape-type"] = {
                defaultValue: "rect",
                options: [{value: "rect"}, {value: "circle"}, {value: "diamond"}, {value: "octagon"}, {value: "triangle-up"}, {value: "triangle-down"}, {value: "triangle-left"}, {value: "triangle-right"}, {value: "arrow-up"}, {value: "arrow-down"}, {value: "arrow-left"}, {value: "arrow-right"}]
            };
            for (var e in SL.util.svg.SYMBOLS)this.properties.attribute["data-shape-type"].options.push({value: "symbol-" + e});
            this.properties.attribute["data-shape-stretch"] = {defaultValue: true}, this.properties.attribute["data-shape-fill-color"] = {defaultValue: "#000000"}, this.properties.attribute["data-shape-stroke-color"] = {}, this.properties.attribute["data-shape-stroke-width"] = {
                type: "number",
                decimals: 0,
                minValue: 1,
                maxValue: 50,
                defaultValue: 0
            }
        }, bind: function () {
            this._super(), this.propertyChanged.add(this.onPropertyChanged.bind(this))
        }, setDefaults: function () {
            this._super(), this.resize({
                width: 300,
                height: 300
            }), this.set("attribute.data-shape-type", this.getPropertyDefault("attribute.data-shape-type")), this.set("attribute.data-shape-fill-color", this.getPropertyDefault("attribute.data-shape-fill-color")), this.set("attribute.data-shape-stretch", this.getPropertyDefault("attribute.data-shape-stretch"))
        }, paint: function () {
            var e = this.get("attribute.data-shape-type"), t = this.get("attribute.data-shape-fill-color"), i = this.get("attribute.data-shape-stroke-color"), n = this.get("attribute.data-shape-stroke-width"), r = this.get("attribute.data-shape-stretch"), o = this.domElement.width(), s = this.domElement.height();
            r || (o = s = Math.min(o, s));
            var a = SL.editor.blocks.Shape.shapeFromType(e, o, s);
            if (a) {
                var l = this.hasStroke(), c = this.supportsStroke(a), d = this.getSVGElement();
                if (d.setAttribute("width", "100%"), d.setAttribute("height", "100%"), d.setAttribute("preserveAspectRatio", r ? "none" : "xMidYMid"), d.innerHTML = "", c && l) {
                    var h = SL.util.string.uniqueID("shape-mask-"), u = document.createElementNS(SL.util.svg.NAMESPACE, "defs"), p = document.createElementNS(SL.util.svg.NAMESPACE, "clipPath");
                    p.setAttribute("id", h), p.appendChild($(a).clone().get(0)), u.appendChild(p), d.appendChild(u), a.setAttribute("clip-path", "url(#" + h + ")")
                }
                a.setAttribute("class", "shape-element"), t && a.setAttribute("fill", t), c && i && a.setAttribute("stroke", i), c && n && a.setAttribute("stroke-width", 2 * n), d.appendChild(a);
                var m = SL.util.svg.boundingBox(a);
                d.setAttribute("viewBox", [Math.round(m.x) || 0, Math.round(m.y) || 0, Math.round(m.width) || 32, Math.round(m.height) || 32].join(" "))
            }
        }, resize: function () {
            this._super.apply(this, arguments), this.paint()
        }, toggleStroke: function () {
            this.hasStroke() ? this.unset(["attribute.data-shape-stroke-color", "attribute.data-shape-stroke-width"]) : this.set({
                "attribute.data-shape-stroke-color": "#000000",
                "attribute.data-shape-stroke-width": 1
            }), this.paint()
        }, hasStroke: function () {
            return this.isset("attribute.data-shape-stroke-color") || this.isset("attribute.data-shape-stroke-width")
        }, supportsStroke: function (e) {
            return $(e || this.getSVGShapeElement()).is("rect, circle, ellipse, polygon")
        }, getSVGElement: function () {
            var e = this.contentElement.find("svg").get(0);
            return e || (e = document.createElementNS(SL.util.svg.NAMESPACE, "svg"), e.setAttribute("xmlns", SL.util.svg.NAMESPACE), e.setAttribute("version", "1.1"), this.contentElement.append(e)), e
        }, getSVGShapeElement: function () {
            return $(this.getSVGElement().querySelector(".shape-element"))
        }, getToolbarOptions: function () {
            return [SL.editor.components.toolbars.options.ShapeType, SL.editor.components.toolbars.options.ShapeStretch, SL.editor.components.toolbars.options.ShapeFillColor, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderSVG, SL.editor.components.toolbars.groups.Link, SL.editor.components.toolbars.groups.Animation].concat(this._super())
        }, onPropertyChanged: function () {
            this.paint()
        }
    });

SL.editor.blocks.Shape.shapeFromType = function (e, t, i) {
        return t = t || 32, i = i || 32, /^symbol\-/.test(e) ? SL.util.svg.symbol(e.replace(/^symbol\-/, "")) : "rect" === e ? SL.util.svg.rect(t, i) : "circle" === e ? SL.util.svg.ellipse(t, i) : "diamond" === e ? SL.util.svg.polygon(t, i, 4) : "octagon" === e ? SL.util.svg.polygon(t, i, 8) : "triangle-up" === e ? SL.util.svg.triangleUp(t, i) : "triangle-down" === e ? SL.util.svg.triangleDown(t, i) : "triangle-left" === e ? SL.util.svg.triangleLeft(t, i) : "triangle-right" === e ? SL.util.svg.triangleRight(t, i) : "arrow-up" === e ? SL.util.svg.arrowUp(t, i) : "arrow-down" === e ? SL.util.svg.arrowDown(t, i) : "arrow-left" === e ? SL.util.svg.arrowLeft(t, i) : "arrow-right" === e ? SL.util.svg.arrowRight(t, i) : void 0
    };

SL("editor.blocks").Snippet = SL.editor.blocks.Base.extend({
        init: function (e) {
            this._super("snippet", $.extend({}, e)), this.plug(SL.editor.blocks.plugin.HTML)
        }, bind: function () {
            this._super(), this.onEditingKeyUp = this.onEditingKeyUp.bind(this), this.onEditingKeyDown = this.onEditingKeyDown.bind(this), this.onEditingInput = this.onEditingInput.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
        }, blur: function () {
            this._super(), this.disableEditing()
        }, setDefaults: function () {
            this._super(), this.resize({
                width: SL.editor.blocks.Snippet.DEFAULT_WIDTH,
                height: SL.editor.blocks.Snippet.DEFAULT_HEIGHT
            })
        }, resizeToFitContent: function () {
            this.domElement.css("width", "auto");
            var e = Math.min(this.domElement.outerWidth(), SL.view.getSlideSize().width);
            (0 === e || isNaN(e)) && (e = SL.editor.blocks.Snippet.DEFAULT_WIDTH), this.domElement.css("width", e), this.domElement.css("height", "auto");
            var t = Math.min(this.domElement.outerHeight(), SL.view.getSlideSize().height);
            (0 === t || isNaN(t)) && (t = SL.editor.blocks.Snippet.DEFAULT_HEIGHT), this.domElement.css("height", t)
        }, getToolbarOptions: function () {
            return [SL.editor.components.toolbars.options.TextAlign, SL.editor.components.toolbars.options.TextSize, SL.editor.components.toolbars.options.LineHeight, SL.editor.components.toolbars.options.LetterSpacing, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.TextColor, SL.editor.components.toolbars.options.BackgroundColor, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Padding, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
        }, enableEditing: function () {
            this.isEditingText() || (this.contentElement.attr("contenteditable", ""), this.domElement.addClass("is-editing"), this.contentElement.on("keyup", this.onEditingKeyUp), this.contentElement.on("keydown", this.onEditingKeyDown), this.contentElement.on("input", this.onEditingInput), this.editor = CKEDITOR.inline(this.contentElement.get(0), {allowedContent: true}), this.editor.on("instanceReady", function () {
                this.editor.focus();
                var e = this.editor.createRange();
                e.moveToElementEditEnd(this.editor.editable()), e.select()
            }.bind(this)))
        }, disableEditing: function () {
            this.contentElement.removeAttr("contenteditable").blur(), this.domElement.removeClass("is-editing"), this.contentElement.off("keyup", this.onEditingKeyUp), this.contentElement.off("keydown", this.onEditingKeyDown), this.contentElement.off("input", this.onEditingInput), this.editor && (this.editor.destroy(), this.editor = null), SL.editor.controllers.Blocks.afterBlockTextSaved(this.contentElement)
        }, isEditingText: function () {
            return this.domElement.hasClass("is-editing")
        }, toggleAttributeWhen: function (e, t) {
            t ? this.contentElement.attr(e, "") : this.contentElement.removeAttr(e)
        }, onDoubleClick: function (e) {
            this._super(e), SL.view.isEditing() && this.enableEditing()
        }, onKeyDown: function (e) {
            this._super(e), 13 === e.keyCode ? this.isEditingText() || SL.util.isTypingEvent(e) ? e.metaKey && this.disableEditing() : (e.preventDefault(), this.enableEditing()) : 27 === e.keyCode && (e.preventDefault(), this.disableEditing())
        }, onEditingKeyUp: function () {
            SL.editor.controllers.Blocks.afterBlockTextInput()
        }, onEditingKeyDown: function () {
            SL.editor.controllers.Blocks.afterBlockTextInput()
        }, onEditingInput: function () {
            setTimeout(function () {
                SL.editor.controllers.Blocks.afterBlockTextInput()
            }, 1)
        }, onPropertyChanged: function (e) {
            -1 !== e.indexOf("style.letter-spacing") && this.toggleAttributeWhen("data-has-letter-spacing", this.isset("style.letter-spacing")), -1 !== e.indexOf("style.line-height") && this.toggleAttributeWhen("data-has-line-height", this.isset("style.line-height"))
        }
    });

SL.editor.blocks.Snippet.DEFAULT_WIDTH = 300;
    SL.editor.blocks.Snippet.DEFAULT_HEIGHT = 300;

SL("editor.blocks").Table = SL.editor.blocks.Base.extend({
        init: function (e) {
            this._super("table", $.extend({
                minWidth: 100,
                verticalResizing: false
            }, e)), e.rows && this.setRows(e.rows), this.setupContextMenu()
        }, setup: function () {
            this._super(), this.tableSizeChanged = new signals.Signal, this.tableHeaderChanged = new signals.Signal, this.properties.attribute["data-table-cols"] = {
                type: "number",
                decimals: 0,
                minValue: 1,
                maxValue: 10,
                defaultValue: 3
            }, this.properties.attribute["data-table-rows"] = {
                type: "number",
                decimals: 0,
                minValue: 1,
                maxValue: 18,
                defaultValue: 3
            }, this.properties.attribute["data-table-padding"] = {
                type: "number",
                unit: "px",
                decimals: 0,
                minValue: 0,
                maxValue: 30,
                defaultValue: 5
            }, this.properties.attribute["data-table-has-header"] = {defaultValue: true}, this.properties.attribute["data-table-border-width"] = {
                type: "number",
                unit: "px",
                decimals: 0,
                minValue: 0,
                maxValue: 20,
                defaultValue: 1
            }, this.properties.attribute["data-table-border-color"] = {}, this.repaintProperties = ["attribute.data-table-cols", "attribute.data-table-rows", "attribute.data-table-padding", "attribute.data-table-has-header", "attribute.data-table-border-width", "attribute.data-table-border-color"]
        }, setupContextMenu: function () {
            this.contextMenu = new SL.components.ContextMenu({
                anchor: this.contentElement,
                options: [{
                    label: "Insert row above", callback: this.onInsertRowAbove.bind(this), filter: function () {
                        return this.getTableRowCount() < this.getPropertySettings("attribute.data-table-rows").maxValue
                    }.bind(this)
                }, {
                    label: "Insert row below", callback: this.onInsertRowBelow.bind(this), filter: function () {
                        return this.getTableRowCount() < this.getPropertySettings("attribute.data-table-rows").maxValue
                    }.bind(this)
                }, {
                    label: "Insert column left", callback: this.onInsertColLeft.bind(this), filter: function () {
                        return this.getTableColCount() < this.getPropertySettings("attribute.data-table-cols").maxValue
                    }.bind(this)
                }, {
                    label: "Insert column right", callback: this.onInsertColRight.bind(this), filter: function () {
                        return this.getTableColCount() < this.getPropertySettings("attribute.data-table-cols").maxValue
                    }.bind(this)
                }, {type: "divider"}, {
                    label: "Delete row", callback: this.onDeleteRow.bind(this), filter: function () {
                        return this.getTableRowCount() > this.getPropertySettings("attribute.data-table-rows").minValue
                    }.bind(this)
                }, {
                    label: "Delete column", callback: this.onDeleteCol.bind(this), filter: function () {
                        return this.getTableColCount() > this.getPropertySettings("attribute.data-table-cols").minValue
                    }.bind(this)
                }]
            }), this.contextMenu.shown.add(this.onContextMenuShown.bind(this)), this.contextMenu.hidden.add(this.onContextMenuHidden.bind(this)), this.contextMenu.destroyed.add(this.onContextMenuHidden.bind(this))
        }, bind: function () {
            this._super(), this.onEditingKeyUp = this.onEditingKeyUp.bind(this), this.onEditingKeyDown = this.onEditingKeyDown.bind(this), this.onEditingInput = this.onEditingInput.bind(this), this.onCellFocused = this.onCellFocused.bind(this), this.onCellMouseOver = this.onCellMouseOver.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
        }, blur: function () {
            this._super(), this.isEditingText() && this.disableEditing()
        }, setDefaults: function () {
            this._super(), this.resize({
                width: SL.editor.blocks.Table.DEFAULT_WIDTH,
                height: SL.editor.blocks.Table.DEFAULT_HEIGHT
            })
        }, getToolbarOptions: function () {
            return [SL.editor.components.toolbars.groups.TableSize, SL.editor.components.toolbars.options.TableHasHeader, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.TablePadding, SL.editor.components.toolbars.options.TableBorderWidth, SL.editor.components.toolbars.options.TableBorderColor, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.TextAlign, SL.editor.components.toolbars.options.TextSize, SL.editor.components.toolbars.options.TextColor, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.BackgroundColor, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.Animation].concat(this._super())
        }, getTableElement: function () {
            var e = this.contentElement.find("table");
            0 === e.length && (e = $("<table>").appendTo(this.contentElement));
            var t = e.find("tbody");
            return 0 === t.length && (t = $("<tbody>").appendTo(e)), e
        }, getTableRowCount: function () {
            return this.getTableElement().find("tr").length
        }, getTableColCount: function () {
            return this.getTableElement().find("tr").first().find("td, th").length
        }, getTableBorderColor: function () {
            return this.getTableElement().find("td, th").css("border-top-color")
        }, resize: function () {
            this._super.apply(this, arguments), this.paint()
        }, paint: function () {
            this._super.apply(this, arguments);
            var e = this.getTableElement(), t = this.get("attribute.data-table-rows"), i = this.get("attribute.data-table-cols"), n = t - e.find("tr").length;
            if (n > 0)for (var r = 0; n > r; r++)e.append("<tr></tr>"); else 0 > n && e.find("tr:gt(" + (t - 1) + ")").remove();
            e.find("tr").each(function (e, t) {
                var n = $(t), r = i - n.find("td, th").length;
                if (r > 0)for (var o = 0; r > o; o++)this.backfill($("<td></td>").appendTo(n)); else if (0 > r) {
                    var s = i - 1;
                    n.find("td:gt(" + s + "), th:gt(" + s + ")").remove()
                }
            }.bind(this)), this.get("attribute.data-table-has-header") ? e.find("tr").first().find("td").changeElementType("th") : e.find("tr").first().find("th").changeElementType("td"), e.find("td, th").css({
                padding: this.isset("attribute.data-table-padding") ? this.get("attribute.data-table-padding") : "",
                "border-width": this.isset("attribute.data-table-border-width") ? this.get("attribute.data-table-border-width") : "",
                "border-color": this.isset("attribute.data-table-border-color") ? this.get("attribute.data-table-border-color") : ""
            }), e.find("td:last-child, th:last-child").css("width", ""), this.refreshMinWidth(), this.paintResizeHandles()
        }, paintResizeHandles: function () {
            var e = [], t = this.getTableElement(), i = Math.floor(this.get("attribute.data-table-border-width") / 2);
            t.find("tr").first().find("td:not(:last), th:not(:last)").each(function (t, n) {
                var r = this.contentElement.find('.sl-table-column-resizer[data-column-index="' + t + '"]');
                0 === r.length && (r = $('<div class="editing-ui sl-table-column-resizer" data-column-index="' + t + '"></div>'), r.on("vmousedown", this.onResizeHandleMouseDOwn.bind(this)), r.on("dblclick", this.onResizeHandleDoubleClick.bind(this)), r.appendTo(this.contentElement)), r.css("left", n.offsetLeft + n.offsetWidth + i), e.push(t)
            }.bind(this)), this.contentElement.find(".sl-table-column-resizer").each(function () {
                -1 === e.indexOf(parseInt(this.getAttribute("data-column-index"), 10)) && $(this).remove()
            })
        }, onResizeHandleMouseDOwn: function (e) {
            e.preventDefault();
            var t = this.getTableElement(), i = $(e.currentTarget), n = parseInt(i.attr("data-column-index"), 10), r = t.find("td:eq(" + n + "), th:eq(" + n + ")").first(), o = this.domElement.offset().left, s = r.position().left, a = s + SL.editor.blocks.Table.MIN_COL_WIDTH, l = this.measure().width;
            i.addClass("is-dragging"), l -= this.getMinWidthFromCells(t.find("tr:first-child td:gt(" + n + "), th:gt(" + n + ")"));
            var c = function (e) {
                var i = n + 1;
                t.find("td:nth-child(" + i + "), th:nth-child(" + i + ")").css({width: Math.round(Math.max(Math.min(e.clientX - o, l), a) - s)}), this.paintResizeHandles()
            }.bind(this), d = function () {
                i.removeClass("is-dragging"), $(document).off("vmousemove", c), $(document).off("vmouseup", d)
            }.bind(this);
            $(document).on("vmousemove", c), $(document).on("vmouseup", d)
        }, onResizeHandleDoubleClick: function (e) {
            var t = parseInt($(e.currentTarget).attr("data-column-index"), 10);
            this.getTableElement().find("td:eq(" + t + "), th:eq(" + t + ")").css("width", ""), this.paintResizeHandles()
        }, enableEditing: function (e) {
            if (!this.isEditingText()) {
                this.domElement.addClass("is-editing"), this.contentElement.on("keyup", this.onEditingKeyUp), this.contentElement.on("keydown", this.onEditingKeyDown), this.contentElement.on("input", this.onEditingInput);
                var t = this.contentElement.find("td, th");
                t.wrapInner("<div contenteditable>"), t.find("[contenteditable]").on("mouseover", this.onCellMouseOver).on("focus", this.onCellFocused), e = e || this.contentElement.find("td, th").first(), this.enableEditingOfCell(e, true), e.find(">[contenteditable]").focus()
            }
            this.paint()
        }, enableEditingOfCell: function (e, t) {
            if (e) {
                var i = e.find(">[contenteditable]").first(), n = i.data("ckeditor");
                n || (n = CKEDITOR.inline(i.get(0), this.getEditorOptions(e)), i.data("ckeditor", n), t && n.on("instanceReady", function () {
                    SL.util.selection.moveCursorToEnd(i.get(0))
                }.bind(this)), SL.editor.controllers.Capabilities.isTouchEditor() && window.scrollTo(0, Math.max(e.offset().top - 100, 0)))
            }
        }, disableEditing: function () {
            this.domElement.removeClass("is-editing"), this.contentElement.off("keyup", this.onEditingKeyUp), this.contentElement.off("keydown", this.onEditingKeyDown), this.contentElement.off("input", this.onEditingInput), this.getTableElement().find("td>[contenteditable], th>[contenteditable]").each(function (e, t) {
                var i = $(t);
                i.data("ckeditor") && (i.data("ckeditor").destroy(), i.data("ckeditor", "")), t.parentNode.innerHTML = t.innerHTML
            }), this.contentElement.find("td, th").off("mouseover", this.onCellMouseOver).off("focus", this.onCellFocused).blur(), SL.util.selection.clear(), this.paint(), SL.editor.controllers.Blocks.afterBlockTextSaved(this.contentElement)
        }, isEditingText: function () {
            return this.domElement.hasClass("is-editing")
        }, enableBackfill: function () {
            this.backfillData = [], this.getTableElement().find("tr").each(function (e, t) {
                $(t).find("td, th").each(function (t, i) {
                    this.backfillData[t] = this.backfillData[t] || [], this.backfillData[t][e] = i.innerHTML
                }.bind(this))
            }.bind(this))
        }, disableBackfill: function () {
            this.backfillData = null
        }, backfill: function (e) {
            if (this.backfillData && this.backfillData.length) {
                var t = e.index(), i = e.parent().index();
                if (this.backfillData[t]) {
                    var n = this.backfillData[t][i];
                    n && e.html(n)
                }
            }
        }, setRows: function (e) {
            var t = 0;
            e.forEach(function (e) {
                t = Math.max(e.length, t)
            }), this.set("attribute.data-table-rows", e.length), this.set("attribute.data-table-cols", t), this.getTableElement().find("tr").each(function (t) {
                $(this).find("th, td").each(function (i) {
                    $(this).text(e[t][i] || "")
                })
            })
        }, getCellAtPoint: function (e, t) {
            var i;
            return this.contentElement.find("td, th").each(function (n, r) {
                var o = r.getBoundingClientRect();
                e > o.left && e < o.right && t > o.top && t < o.bottom && (i = r)
            }.bind(this)), i
        }, getRowAtPoint: function (e, t) {
            return $(this.getCellAtPoint(e, t)).parents("tr").get(0)
        }, getEditorOptions: function (e) {
            var t = {
                enterMode: CKEDITOR.ENTER_BR,
                autoParagraph: false,
                allowedContent: {"strong em u s del ins": {styles: "text-align"}},
                floatSpaceDockedOffsetX: -this.get("attribute.data-table-padding"),
                floatSpaceDockedOffsetY: this.get("attribute.data-table-padding")
            };
            return t.toolbar = e.is("th") ? [["Italic", "Underline", "Strike"]] : [["Bold", "Italic", "Underline", "Strike"]], t
        }, propagateDOMTableSize: function () {
            this.set({
                "attribute.data-table-rows": this.getTableElement().find("tr").length,
                "attribute.data-table-cols": this.getTableElement().find("tr").first().find("td, th").length
            }), this.tableSizeChanged.dispatch()
        }, refreshMinWidth: function () {
            this.options.minWidth = this.getMinWidthFromCells(this.getTableElement().find("tr:first-child td, tr:first-child th"))
        }, getMinWidthFromCells: function (e) {
            var t = 0;
            return e.each(function () {
                t += "string" == typeof this.style.width && this.style.width.length ? parseInt(this.style.width, 10) : SL.editor.blocks.Table.MIN_COL_WIDTH
            }), t
        }, destroy: function () {
            this.isEditingText() && this.disableEditing(), this.contextMenu.destroy(), this.tableSizeChanged.dispose(), this.tableSizeChanged = null, this.tableHeaderChanged.dispose(), this.tableHeaderChanged = null, this._super()
        }, onDoubleClick: function (e) {
            this._super(e), SL.view.isEditing() && this.enableEditing($(this.getCellAtPoint(e.clientX, e.clientY)))
        }, onCellMouseOver: function (e) {
            var t = $(e.currentTarget).parent();
            t.length && this.enableEditingOfCell(t)
        }, onCellFocused: function (e) {
            var t = $(e.currentTarget).parent();
            if (t.length) {
                var i = "number" == typeof this.lastTabTime && Date.now() - this.lastTabTime < 100;
                this.enableEditingOfCell(t, i)
            }
        }, onKeyDown: function (e) {
            this._super(e), 13 === e.keyCode ? this.isEditingText() || SL.util.isTypingEvent(e) ? e.metaKey && this.disableEditing() : (e.preventDefault(), this.enableEditing()) : 27 === e.keyCode ? (e.preventDefault(), this.disableEditing()) : 9 === e.keyCode && (this.lastTabTime = Date.now())
        }, onEditingKeyUp: function () {
            SL.editor.controllers.Blocks.afterBlockTextInput()
        }, onEditingKeyDown: function () {
            SL.editor.controllers.Blocks.afterBlockTextInput()
        }, onEditingInput: function () {
            setTimeout(function () {
                SL.editor.controllers.Blocks.afterBlockTextInput()
            }, 1)
        }, onPropertyChanged: function (e) {
            var t = e.some(function (e) {
                return -1 !== this.repaintProperties.indexOf(e)
            }.bind(this));
            if (t && this.paint(), -1 !== e.indexOf("style.color")) {
                var i = this.contentElement.get(0);
                i.style.display = "none", i.offsetHeight, i.style.display = ""
            }
            -1 !== e.indexOf("attribute.data-table-has-header") && this.tableHeaderChanged.dispatch()
        }, onContextMenuShown: function (e) {
            var t = $(this.getCellAtPoint(e.clientX, e.clientY));
            t.length && (t.addClass("context-menu-is-open"), this.isEditingText() && this.disableEditing())
        }, onContextMenuHidden: function () {
            this.getTableElement().find(".context-menu-is-open").removeClass("context-menu-is-open")
        }, onInsertRowAbove: function (e) {
            var t = $(this.getRowAtPoint(e.clientX, e.clientY));
            if (t.length) {
                var i = t.clone();
                i.children().empty(), 0 === t.index() && (t.find("th").changeElementType("td"), i.find("td").changeElementType("th")), t.before(i), this.propagateDOMTableSize()
            }
        }, onInsertRowBelow: function (e) {
            var t = $(this.getRowAtPoint(e.clientX, e.clientY));
            t.length && (t.after("<tr>"), this.propagateDOMTableSize())
        }, onDeleteRow: function (e) {
            var t = $(this.getRowAtPoint(e.clientX, e.clientY));
            t.length && (t.remove(), this.propagateDOMTableSize())
        }, onInsertColLeft: function (e) {
            var t = $(this.getCellAtPoint(e.clientX, e.clientY));
            if (t.length) {
                var i = t.index();
                -1 !== i && (this.getTableElement().find("td:nth-child(" + (i + 1) + ")").before("<td>"), this.getTableElement().find("th:nth-child(" + (i + 1) + ")").before("<th>"), this.propagateDOMTableSize())
            }
        }, onInsertColRight: function (e) {
            var t = $(this.getCellAtPoint(e.clientX, e.clientY));
            if (t.length) {
                var i = t.index();
                -1 !== i && (this.getTableElement().find("td:nth-child(" + (i + 1) + ")").after("<td>"), this.getTableElement().find("th:nth-child(" + (i + 1) + ")").after("<th>"), this.propagateDOMTableSize())
            }
        }, onDeleteCol: function (e) {
            var t = $(this.getCellAtPoint(e.clientX, e.clientY));
            if (t.length) {
                var i = t.index();
                -1 !== i && (this.getTableElement().find("td:nth-child(" + (i + 1) + "), th:nth-child(" + (i + 1) + ")").remove(), this.propagateDOMTableSize())
            }
        }
    });

SL.editor.blocks.Table.DEFAULT_WIDTH = 800;
    SL.editor.blocks.Table.DEFAULT_HEIGHT = 400;
    SL.editor.blocks.Table.MIN_COL_WIDTH = 40;

SL("editor.blocks").Text = SL.editor.blocks.Base.extend({
        init: function (e) {
            this._super("text", $.extend({
                verticalResizing: false,
                placeholderTag: "p",
                placeholderText: "Text"
            }, e)), this.plug(SL.editor.blocks.plugin.HTML), this.readDefaultContent(), this.injectDefaultContent()
        }, bind: function () {
            this._super(), this.onEditingKeyUp = this.onEditingKeyUp.bind(this), this.onEditingKeyDown = this.onEditingKeyDown.bind(this), this.onEditingInput = this.onEditingInput.bind(this), this.onEditingFocusOut = this.onEditingFocusOut.bind(this), this.propertyChanged.add(this.onPropertyChanged.bind(this))
        }, blur: function () {
            this._super(), this.isEditingText() && this.disableEditing()
        }, setDefaults: function () {
            this._super(), this.resize({width: SL.editor.blocks.Text.DEFAULT_WIDTH})
        }, readDefaultContent: function () {
            this.contentElement.attr("data-placeholder-tag") ? this.options.placeholderTag = this.contentElement.attr("data-placeholder-tag") : this.contentElement.attr("data-placeholder-tag", this.options.placeholderTag), this.contentElement.attr("data-placeholder-text") ? this.options.placeholderText = this.contentElement.attr("data-placeholder-text") : this.contentElement.attr("data-placeholder-text", this.options.placeholderText)
        }, injectDefaultContent: function () {
            var e = this.getDefaultContent();
            "" === this.contentElement.text().trim() && e && (this.hasPlugin(SL.editor.blocks.plugin.HTML) && this.hasCustomHTML() || this.contentElement.html(e))
        }, clearDefaultContent: function () {
            this.contentElement.html().trim() === this.getDefaultContent() && this.contentElement.html(this.getDefaultContent(true))
        }, getDefaultContent: function (e) {
            return this.options.placeholderTag && this.options.placeholderText ? e ? "<" + this.options.placeholderTag + ">&nbsp;</" + this.options.placeholderTag + ">" : "<" + this.options.placeholderTag + ">" + this.options.placeholderText + "</" + this.options.placeholderTag + ">" : ""
        }, externalizeLinks: function () {
            SL.util.openLinksInTabs(this.contentElement)
        }, resize: function () {
            this._super.apply(this, arguments), this.syncPairs(), this.syncOverflow()
        }, getToolbarOptions: function () {
            return [SL.editor.components.toolbars.options.TextAlign, SL.editor.components.toolbars.options.TextSize, SL.editor.components.toolbars.options.LineHeight, SL.editor.components.toolbars.options.LetterSpacing, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.TextColor, SL.editor.components.toolbars.options.BackgroundColor, SL.editor.components.toolbars.options.Opacity, SL.editor.components.toolbars.options.Padding, SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.groups.BorderCSS, SL.editor.components.toolbars.groups.Animation].concat(this._super())
        }, focus: function () {
            this._super(), SL.editor.controllers.Blocks.discoverBlockPairs(), this.syncOverflow()
        }, enableEditing: function () {
            if (!this.isEditingText()) {
                this.contentElement.attr("contenteditable", ""), this.domElement.addClass("is-editing"), this.contentElement.on("keyup", this.onEditingKeyUp), this.contentElement.on("keydown", this.onEditingKeyDown), this.contentElement.on("input", this.onEditingInput), this.contentElement.on("focusout", this.onEditingFocusOut), this.clearDefaultContent();
                var e = {};
                SL.editor.controllers.Capabilities.isTouchEditor() && (this.contentElement.focus(), e.toolbar = [["Format"], ["NumberedList", "BulletedList", "-", "Blockquote"]], window.scrollTo(0, Math.max(this.contentElement.offset().top - 60, 0))), this.hasPlugin(SL.editor.blocks.plugin.HTML) && this.hasCustomHTML() && (e.allowedContent = true), e.contentsLangDirection = SLConfig.deck.rtl === true ? "rtl" : "ui";
                var t = SL.view.getCurrentTheme();
                if (t && t.hasPalette()) {
                    var i = t.get("palette");
                    i = i.join(","), i = i.replace(/#/g, ""), e.colorButton_colors = i
                }
                this.editor = CKEDITOR.inline(this.contentElement.get(0), e), this.editor.on("instanceReady", function () {
                    this.contentElement.html(this.contentElement.html().trim()), this.editor.focus();
                    var e = this.editor.createRange();
                    e.moveToElementEditEnd(this.editor.editable()), e.select()
                }.bind(this))
            }
        }, disableEditing: function () {
            this.contentElement.removeAttr("contenteditable").blur(), this.domElement.removeClass("is-editing"), this.contentElement.off("keyup", this.onEditingKeyUp), this.contentElement.off("keydown", this.onEditingKeyDown), this.contentElement.off("input", this.onEditingInput), this.contentElement.off("focusout", this.onEditingFocusOut), this.externalizeLinks(), this.injectDefaultContent(), this.editor && (this.editor.destroy(), this.editor = null), SL.editor.controllers.Blocks.afterBlockTextSaved(this.contentElement)
        }, syncPairs: function () {
            if (!this.destroyed) {
                var e = this.measure();
                this.pairings.forEach(function (t) {
                    "bottom" === t.direction && t.block.move(null, e.bottom)
                }), this._super()
            }
        }, syncOverflow: function () {
            this.domElement.toggleClass("is-text-overflowing", this.contentElement.prop("scrollHeight") > SL.view.getSlideSize().height)
        }, isEditingText: function () {
            return this.domElement.hasClass("is-editing")
        }, toggleAttributeWhen: function (e, t) {
            t ? this.contentElement.attr(e, "") : this.contentElement.removeAttr(e)
        }, onDoubleClick: function (e) {
            this._super(e), SL.view.isEditing() && this.enableEditing()
        }, onKeyDown: function (e) {
            this._super(e), 13 === e.keyCode ? this.isEditingText() || SL.util.isTypingEvent(e) ? e.metaKey && this.disableEditing() : (e.preventDefault(), this.enableEditing()) : 27 === e.keyCode && (e.preventDefault(), this.disableEditing())
        }, onEditingKeyUp: function () {
            this.syncPairs(), this.syncOverflow(), SL.editor.controllers.Blocks.afterBlockTextInput()
        }, onEditingKeyDown: function () {
            SL.editor.controllers.Blocks.afterBlockTextInput()
        }, onEditingInput: function () {
            setTimeout(function () {
                SL.editor.controllers.Blocks.afterBlockTextInput()
            }, 1)
        }, onEditingFocusOut: function () {
            SL.editor.controllers.Capabilities.isTouchEditor() && setTimeout(function () {
                this.isEditingText() && 0 === $(document.activeElement).closest(".cke").length && this.disableEditing()
            }.bind(this), 1)
        }, onPropertyChanged: function (e) {
            -1 !== e.indexOf("style.letter-spacing") && this.toggleAttributeWhen("data-has-letter-spacing", this.isset("style.letter-spacing")), -1 !== e.indexOf("style.line-height") && this.toggleAttributeWhen("data-has-line-height", this.isset("style.line-height")), this.syncPairs(), this.syncOverflow()
        }
    });

    SL.editor.blocks.Text.DEFAULT_WIDTH = 600;