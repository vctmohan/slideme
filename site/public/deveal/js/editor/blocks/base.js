SL("editor.blocks").Base = Class.extend({
    init: function (e, t) {
        this.type = e, this.pairings = [], this.plugins = [], this.options = $.extend({
            contentElementType: "div",
            aspectRatio: 0,
            minWidth: 30,
            minHeight: 30,
            horizontalResizing: true,
            verticalResizing: true,
            keyboardConsumer: false,
            introDelay: 1
        }, t), this.options.element && (this.domElement = $(this.options.element), this.contentElement = this.domElement.find(".sl-block-content")), this.setup(), this.validateProperties(), this.render(), this.bind(), this.format(), this.paint(), this.transform = new SL.editor.blocks.behavior.Transform(this)
    }, setup: function () {
        this.removed = new signals.Signal, this.dragStarted = new signals.Signal, this.dragUpdated = new signals.Signal, this.dragEnded = new signals.Signal, this.propertyChanged = new signals.Signal, this.focused = false, this.moved = false, this.mouseDownCursor = {
            x: 0,
            y: 0
        }, this.mouseDownMeasurements = null, this.properties = {
            style: {
                opacity: {
                    type: "number",
                    unit: "%",
                    minValue: 0,
                    maxValue: 100,
                    defaultValue: 100,
                    serialize: function (e) {
                        return parseInt(e, 10) / 100
                    },
                    deserialize: function (e) {
                        return 100 * parseFloat(e)
                    }
                },
                padding: {type: "number", unit: "px", decimals: 0, minValue: 0, maxValue: 100, defaultValue: 0},
                color: {computed: true},
                "background-color": {computed: true},
                "border-color": {computed: true, getter: this.getBorderColor.bind(this)},
                "border-style": {
                    defaultValue: "none",
                    options: [{value: "solid", title: "Solid"}, {value: "dashed", title: "Dashed"}, {
                        value: "dotted",
                        title: "Dotted"
                    }]
                },
                "border-width": {type: "number", unit: "px", decimals: 0, minValue: 0, maxValue: 200, defaultValue: 0},
                "border-radius": {type: "number", unit: "px", decimals: 0, minValue: 0, maxValue: 200, defaultValue: 0},
                "text-align": {
                    options: [{value: "left", icon: "alignleft"}, {
                        value: "center",
                        icon: "aligncenter"
                    }, {value: "right", icon: "alignright"}, {value: "justify", icon: "alignjustify"}]
                },
                "font-size": {type: "number", unit: "%", minValue: 1, maxValue: 500, defaultValue: 100},
                "line-height": {
                    type: "number",
                    unit: "%",
                    minValue: 0,
                    maxValue: 300,
                    defaultValue: 100,
                    serialize: function (e) {
                        return parseInt(e, 10) / 100 * 1.3
                    },
                    deserialize: function (e) {
                        return parseFloat(e) / 1.3 * 100
                    }
                },
                "letter-spacing": {
                    type: "number",
                    unit: "%",
                    minValue: 0,
                    maxValue: 300,
                    defaultValue: 100,
                    serialize: function (e) {
                        return parseInt(e, 10) / 100 - 1 + "em"
                    },
                    deserialize: function (e) {
                        return 100 * (parseFloat(e) + 1)
                    }
                },
                "z-index": {
                    type: "number",
                    minValue: 0,
                    maxValue: 1e3,
                    setter: this.setZ.bind(this),
                    getter: this.getZ.bind(this)
                },
                "transition-duration": {
                    type: "number",
                    unit: "s",
                    decimals: 1,
                    minValue: 0,
                    maxValue: 10,
                    stepSize: .1,
                    defaultValue: 0
                },
                "transition-delay": {
                    type: "number",
                    unit: "s",
                    decimals: 1,
                    minValue: 0,
                    maxValue: 10,
                    stepSize: .1,
                    defaultValue: 0
                }
            },
            attribute: {
                "class": {
                    type: "string",
                    setter: this.setClassName.bind(this),
                    getter: this.getClassName.bind(this)
                },
                "data-animation-type": {
                    options: [{value: "fade-in", title: "Fade in"}, {
                        value: "fade-out",
                        title: "Fade out"
                    }, {value: "slide-up", title: "Slide up"}, {
                        value: "slide-down",
                        title: "Slide down"
                    }, {value: "slide-right", title: "Slide right"}, {
                        value: "slide-left",
                        title: "Slide left"
                    }, {value: "scale-up", title: "Scale up"}, {value: "scale-down", title: "Scale down"}]
                }
            }
        }
    }, validateProperties: function () {
        for (var e in this.properties) {
            var t = this.properties[e];
            for (var i in this.properties[e]) {
                var n = t[i], r = [];
                "number" === n.type && ("number" != typeof n.minValue && r.push("must have minValue"), "number" != typeof n.maxValue && r.push("must have maxValue"), "number" != typeof n.decimals && (n.decimals = 0), "string" != typeof n.unit && (n.unit = "")), r.length && console.warn('Malformed property "' + e + "." + i + '"', r)
            }
        }
    }, render: function () {
        this.domElement || (this.domElement = $("<div>"), this.domElement.addClass("sl-block"), this.contentElement = $("<" + this.options.contentElementType + ">").appendTo(this.domElement), this.contentElement.addClass("sl-block-content")), this.domElement.attr("data-block-type", this.type), this.domElement.data("block-instance", this)
    }, bind: function () {
        this.onClick = this.onClick.bind(this), this.onMouseDown = this.onMouseDown.bind(this), this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.onKeyDown = this.onKeyDown.bind(this), this.onKeyUp = this.onKeyUp.bind(this), this.onDoubleClick = this.onDoubleClick.bind(this), this.syncTransformVisibility = this.syncTransformVisibility.bind(this), this.domElement.on("vclick", this.onClick), this.domElement.on("vmousedown", this.onMouseDown), SL.editor.controllers.Blocks.focusChanged.add(this.syncTransformVisibility)
    }, format: function () {
        this.options.horizontalResizing === false && this.domElement.css("width", "auto"), this.options.verticalResizing === false && this.domElement.css("height", "auto")
    }, setDefaults: function () {
        this.domElement.css({"min-width": this.options.minWidth, "min-height": this.options.minHeight})
    }, setID: function (e) {
        this.domElement.attr("data-block-id", e)
    }, getID: function () {
        return this.domElement.attr("data-block-id")
    }, hasID: function () {
        return !!this.getID()
    }, getType: function () {
        return this.type
    }, appendTo: function (e) {
        this.domElement.appendTo(e)
    }, detach: function () {
        this.domElement.detach()
    }, focus: function () {
        this.focused || (this.focused = true, this.domElement.addClass("is-focused"), this.syncTransformVisibility(), $(document).on("keydown", this.onKeyDown), $(document).on("keyup", this.onKeyUp))
    }, blur: function () {
        this.focused && (this.focused = false, this.domElement.removeClass("is-focused"), this.syncTransformVisibility(), this.hidePaddingHint(), $(document).off("keydown", this.onKeyDown), $(document).off("keyup", this.onKeyUp))
    }, plug: function (e) {
        this.hasPlugin(e) ? console.log("Plugin is already plugged.") : this.plugins.push(new e(this))
    }, unplug: function (e) {
        for (var t = 0; t < this.plugins.length; t++) {
            var i = this.plugins[t];
            i instanceof e && (i.destroy(), this.plugins.splice(t, 1))
        }
    }, hasPlugin: function (e) {
        return this.plugins.some(function (t) {
            return t instanceof e
        })
    }, isFocused: function () {
        return this.focused
    }, showPaddingHint: function (e) {
        var t = this.get("style.padding");
        if (t > 0) {
            var i = this.domElement.find(".sl-block-padding-hint");
            0 === i.length && (i = $('<div class="editing-ui sl-block-overlay sl-block-padding-hint">'), i.appendTo(this.domElement));
            var n = this.measure(), r = n.height, o = n.width, s = Math.round(o / 2), a = Math.round(r / 2), l = Math.round(t), c = Math.round(o - t), d = Math.round(r - t), h = Math.round(t), u = i.find("canvas");
            0 === u.length && (u = $("<canvas>").appendTo(i)), u.attr({width: o, height: r});
            var p = u.get(0).getContext("2d");
            p.clearRect(0, 0, o, r), p.fillStyle = "rgba(17, 188, 231, 0.1)", p.fillRect(0, 0, o, r), p.clearRect(h, l, o - 2 * t, r - 2 * t), p.fillStyle = "rgba(17, 188, 231, 0.6)", p.fillRect(h, l, o - 2 * t, 1), p.fillRect(c, l, 1, r - 2 * t), p.fillRect(h, d, o - 2 * t, 1), p.fillRect(h, l, 1, r - 2 * t), p.fillRect(s - 1, 0, 1, t), p.fillRect(s - 1, d, 1, t), p.fillRect(0, a - 1, t, 1), p.fillRect(c, a - 1, t, 1), this.syncZ(), clearTimeout(this.hintPaddingTimeout), "number" == typeof e && (this.hintPaddingTimeout = setTimeout(this.hidePaddingHint.bind(this), e))
        } else this.hidePaddingHint()
    }, hidePaddingHint: function () {
        clearTimeout(this.hintPaddingTimeout), this.domElement.find(".sl-block-padding-hint").remove()
    }, set: function (e, t) {
        if ("string" == typeof e) {
            var i = e;
            e = {}, e[i] = t
        }
        var n = [];
        for (var r in e)if (e.hasOwnProperty(r)) {
            var o = this.getPropertySettings(r);
            if (o) {
                var s = r.split("."), a = e[r], l = a, c = "function" == typeof o.targetElement ? o.targetElement() : this.contentElement;
                o.unit && (a += o.unit), o.serialize && (a = o.serialize(a)), o.setter ? o.setter.call(null, a) : "style" === s[0] ? "undefined" != typeof o.defaultValue && o.defaultValue === l ? c.css(s[1], "") : c.css(s[1], a) : "attribute" === s[0] && c.attr(s[1], a), n.push(r)
            } else console.log("Property not found:", r)
        }
        n.length && this.propertyChanged.dispatch(n)
    }, get: function (e) {
        var t = this.getPropertySettings(e);
        if (t) {
            var i, n = e.split("."), r = "function" == typeof t.targetElement ? t.targetElement() : this.contentElement;
            if (r && r.length)if (t.getter)i = t.getter.call(this); else if ("style" === n[0]) {
                var o = n[1].replace(/-(\w)/g, function (e, t) {
                    return t.toUpperCase()
                });
                i = t.computed ? r.css(o) : r.get(0).style[o]
            } else if ("attribute" === n[0] && (i = r.attr(n[1]), "string" == typeof i)) {
                if ("null" === i)return null;
                if ("true" === i)return true;
                if ("false" === i)return false;
                if (i.match(/^\d+$/))return parseFloat(i)
            }
            return "number" === t.type && (i = parseFloat(i)), t.deserialize && (i = t.deserialize(i)), "undefined" !== t.defaultValue && ("number" === t.type ? isNaN(i) && (i = t.defaultValue) : i || (i = t.defaultValue)), i
        }
        return void console.log("Property not found:", e)
    }, unset: function (e) {
        "string" == typeof e && (e = [e]);
        var t = [];
        e.forEach(function (e) {
            var i = this.getPropertySettings(e);
            if (i) {
                var n = e.split("."), r = "function" == typeof i.targetElement ? i.targetElement() : this.contentElement;
                "style" === n[0] ? r.css(n[1], "") : "attribute" === n[0] && r.removeAttr(n[1]), t.push(e)
            }
        }.bind(this)), t.length && this.propertyChanged.dispatch(t)
    }, isset: function (e) {
        var t = this.getPropertySettings(e);
        if (t) {
            if (t.checker)return t.call();
            var i = this.get(e);
            if ("undefined" != typeof i && i !== t.defaultValue)return true
        }
        return false
    }, getPropertySettings: function (e) {
        if ("string" == typeof e) {
            e = e.split(".");
            var t = e[0], i = e[1], n = this.properties[t] ? this.properties[t][i] : null;
            if (n)return n;
            console.log("Property not found:", e)
        }
        return null
    }, getPropertyDefault: function (e) {
        var t = this.getPropertySettings(e);
        return t ? t.defaultValue : null
    }, setZ: function (e) {
        this.contentElement.css("z-index", e), this.domElement.find(".sl-block-overlay").css("z-index", e)
    }, getZ: function () {
        var e = parseInt(this.contentElement.css("z-index"), 10);
        return isNaN(e) ? -1 : e
    }, syncZ: function () {
        this.domElement.find(".sl-block-overlay").css("z-index", this.getZ())
    }, setClassName: function (e) {
        e = e.replace(/\s{2,}/g, " "), e = e.replace(/[^a-zA-Z0-9-_\s]*/gi, ""), e = e.trim(), this.contentElement.attr("class", "sl-block-content" + (e ? " " + e : ""))
    }, getClassName: function () {
        var e = this.contentElement.attr("class");
        return e = e.split(" ").map(function (e) {
            return e = e.trim(), (/^(sl\-|cke\_)/gi.test(e) || "visible" === e) && (e = ""), e
        }).join(" "), e = e.replace(/\s{2,}/g, " "), e = e.trim()
    }, getBorderColor: function () {
        return this.contentElement.css("border-top-color")
    }, getAspectRatio: function () {
        return this.options.aspectRatio
    }, hasAspectRatio: function () {
        return this.getAspectRatio() > 0
    }, syncAspectRatio: function () {
        if (this.hasAspectRatio()) {
            var e = this.measure();
            this.resize({width: e.width, height: e.height, center: true})
        }
    }, syncTransformVisibility: function () {
        this.isFocused() ? this.transform.show() : this.transform.hide()
    }, showPlaceholder: function () {
        0 === this.domElement.find(".sl-block-placeholder").length && this.domElement.append('<div class="editing-ui sl-block-overlay sl-block-placeholder">')
    }, hidePlaceholder: function () {
        this.domElement.find(".sl-block-placeholder").remove()
    }, paint: function () {
        this.isEmpty() ? this.showPlaceholder() : this.hidePlaceholder(), this.syncZ()
    }, isEmpty: function () {
        return false
    }, isEditingText: function () {
        return false
    }, isFragment: function () {
        return this.contentElement.hasClass("fragment")
    }, removeFragment: function () {
        this.contentElement.removeClass("fragment").removeAttr("data-fragment-index")
    }, getToolbarOptions: function () {
        return SL.editor.controllers.Blocks.getCurrentBlocks().length > 1 ? [SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.BlockDepth, SL.editor.components.toolbars.options.BlockActions] : [SL.editor.components.toolbars.options.Divider, SL.editor.components.toolbars.options.BlockActions]
    },
    changeContentElementType: function (e) {
        this.contentElement.changeElementType(e);
        this.contentElement = this.domElement.find(".sl-block-content");
    },
    move: function (e, t, i) {
        if (i && i.isOffset)this.domElement.css({left: "+=" + e, top: "+=" + t}); else {
            var n = {};
            "number" == typeof e && (n.left = Math.round(e)), "number" == typeof t && (n.top = Math.round(t)), this.domElement.css(n)
        }
    }, moveToCenter: function () {
        var e = this.measure(), t = SL.view.getSlideSize();
        this.move((t.width - e.width) / 2, (t.height - e.height) / 2)
    }, resize: function (e) {
        e = e || {};
        var t;
        t = this.transform.isResizing() ? this.transform.getState().originalMeasurements : this.measure(), "number" == typeof e.top && (e.height = t.bottom - e.top, e.direction = "n"), "number" == typeof e.left && (e.width = t.right - e.left, e.direction = "w"), "number" == typeof e.right && (e.width = e.right - t.x), "number" == typeof e.bottom && (e.height = e.bottom - t.y);
        var i = Math.max(e.width, this.options.minWidth), n = Math.max(e.height, this.options.minHeight);
        if (this.transform.isResizingProportionally()) {
            var r = t.width / t.height;
            /s|n/.test(e.direction) ? i = n * r : n = i / r
        }
        if (this.hasAspectRatio()) {
            var o = this.getAspectRatio();
            e.direction ? /s|n/.test(e.direction) ? i = n * o : n = i / o : this.getAspectRatio() < 1 ? i = n * o : n = i / o
        }
        if (this.domElement.css({
                width: this.options.horizontalResizing ? i : "auto",
                height: this.options.verticalResizing ? n : "auto"
            }), this.transform.isResizingCentered() || e.center) {
            var s = this.measure();
            this.domElement.css({left: t.x + (t.width - s.width) / 2, top: t.y + (t.height - s.height) / 2})
        } else e.direction && (/n/.test(e.direction) && this.domElement.css("top", t.bottom - n), /w/.test(e.direction) && this.domElement.css("left", t.right - i), 1 === e.direction.length && (/n|s/.test(e.direction) ? this.domElement.css("left", t.x + (t.width - i) / 2) : /e|w/.test(e.direction) && this.domElement.css("top", t.y + (t.height - n) / 2)));
        this.transform.isResizing() && !this.transform.isResizingCentered() && (/n/.test(this.transform.getState().direction) && this.domElement.css("top", t.bottom - n), /e/.test(this.transform.getState().direction) && this.domElement.css("left", t.x), /s/.test(this.transform.getState().direction) && this.domElement.css("top", t.y), /w/.test(this.transform.getState().direction) && this.domElement.css("left", t.right - i))
    }, measure: function () {
        var e = this.domElement.get(0), t = {
            x: e.offsetLeft,
            y: e.offsetTop,
            width: this.domElement.outerWidth(),
            height: this.domElement.outerHeight()
        };
        return t.right = t.x + t.width, t.bottom = t.y + t.height, t
    }, hitTest: function (e) {
        return SL.util.trig.intersects(this.measure(), e)
    }, runIntro: function () {
        this.domElement.addClass("intro-start"), setTimeout(function () {
            this.domElement.removeClass("intro-start").addClass("intro-end"), setTimeout(function () {
                this.domElement.removeClass("intro-end")
            }.bind(this), 500)
        }.bind(this), this.options.introDelay || 1)
    }, pair: function (e, t) {
        this.pairings.push({block: e, direction: t})
    }, unpair: function () {
        this.pairings.length = 0
    }, syncPairs: function () {
        this.pairings.forEach(function (e) {
            e.block.syncPairs()
        })
    }, destroy: function () {
        this.destroyed = true, SL.editor.controllers.Blocks.focusChanged.remove(this.syncTransformVisibility), this.removed.dispatch(), this.removed.dispose(), this.dragStarted.dispose(), this.dragUpdated.dispose(), this.dragEnded.dispose(), this.propertyChanged.dispose(), this.transform.destroy(), this.domElement.off("vclick", this.onClick), this.domElement.off("vmousedown", this.onMouseDown), this.domElement.data("block-instance", null), this.domElement.remove()
    }, onClick: function (e) {
        SL.view.isEditing() && this.hasPlugin(SL.editor.blocks.plugin.Link) && this.isLinked() && e.preventDefault()
    }, onMouseDown: function (e) {
        return !SL.view.isEditing() || $(e.target).closest(".sl-block-transform .anchor").length > 0 || $(e.target).closest(".sl-table-column-resizer").length > 0 ? true : void(this.isEditingText() || (e.preventDefault(), SL.editor.controllers.Blocks.focus(this, e.shiftKey), $("input:focus, textarea:focus").blur(), $(document).on("vmousemove", this.onMouseMove), $(document).on("vmouseup", this.onMouseUp), this.moved = false, this.mouseDownCursor.x = e.clientX, this.mouseDownCursor.y = e.clientY, this.dragTargets = SL.editor.controllers.Blocks.getFocusedBlocks().map(function (e) {
            return {block: e, origin: e.measure(true)}
        })))
    }, onMouseMove: function (e) {
        var t = this.moved || Math.abs(this.mouseDownCursor.x - e.clientX) > 1 || Math.abs(this.mouseDownCursor.y - e.clientY) > 1;
        t && (e.preventDefault(), this.dragTargets.forEach(function (t) {
            t.block.move(t.origin.x + (e.clientX - this.mouseDownCursor.x), t.origin.y + (e.clientY - this.mouseDownCursor.y))
        }.bind(this)), this.moved === false && SL.editor.controllers.Guides.start(SL.editor.controllers.Blocks.getFocusedBlocks()), SL.editor.controllers.Guides.sync(), this.moved = true)
    }, onMouseUp: function (e) {
        if (e.preventDefault(), $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp), SL.editor.controllers.Guides.stop(), !this.moved) {
            "number" != typeof this.lastMouseUpTime && (this.lastMouseUpTime = 0, this.lastDoubleClickTime = 0);
            var t = Date.now(), i = 400;
            t - this.lastMouseUpTime < i && (t - this.lastDoubleClickTime > i && this.onDoubleClick(e), this.lastDoubleClickTime = t), this.lastMouseUpTime = t
        }
    }, onDoubleClick: function () {
    }, onKeyDown: function () {
    }, onKeyUp: function () {
    }
});