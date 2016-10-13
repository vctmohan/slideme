SL("editor.controllers").Guides = {
    init: function () {
        this.guides = {h: [], v: []}, this.render()
    }, render: function () {
        this.domElement = $('<div class="sl-block-guides editing-ui">')
    }, start: function (e, t) {
        if (this.isEnabled() !== false) {
            if (this.options = $.extend({
                    snap: true,
                    action: "move",
                    threshold: 6
                }, t), this.slideBounds = SL.view.getSlideSize(), this.slideBounds.x = 0, this.slideBounds.y = 0, this.domElement.appendTo(SL.editor.controllers.Markup.getCurrentSlide()), this.allBlocks = SL.editor.controllers.Blocks.getCurrentBlocks(), this.targetBlocks = e, this.gridLines = [], SL.editor.controllers.Grid.isEnabled()) {
                for (var i = SL.editor.controllers.Grid.getCols(), n = SL.editor.controllers.Grid.getRows(), r = this.slideBounds.width / i, o = this.slideBounds.height / n, s = 1; i > s; s++)this.gridLines.push(this.getCenterEdges({
                    x: s * r,
                    y: 0,
                    width: 0,
                    height: this.slideBounds.height
                }, "grid-col-" + s, "horizontal"));
                for (var a = 1; n > a; a++)this.gridLines.push(this.getCenterEdges({
                    x: 0,
                    y: a * o,
                    width: this.slideBounds.width,
                    height: 0
                }, "grid-row-" + a, "vertical"))
            }
            var l = this.getTargetBounds();
            this.targetBlocks.forEach(function (e) {
                var t = e.measure();
                e._guideOffsetX = t.x - l.x, e._guideOffsetY = t.y - l.y
            })
        }
    }, stop: function () {
        this.domElement.remove(), this.clearGuideElements(), this.targetBlocks = []
    }, sync: function () {
        this.isEnabled() !== false && this.targetBlocks.length && (this.options.snap ? (this.findGuides(this.options.threshold), this.enforceGuides(), this.findGuides(1), this.renderGuides()) : (this.findGuides(this.options.threshold), this.renderGuides()))
    }, findGuides: function (e) {
        this.guides.h.length = 0, this.guides.v.length = 0;
        var t, i = this.getTargetBounds();
        if ("line-anchor" === this.options.action) {
            t = this.getCenterEdges(i, "target-bounds");
            var n = this.targetBlocks[0];
            if ("line" === n.getType()) {
                var r = this.targetBlocks[0].getGlobalLinePoint(n.getOppositePointID(this.options.direction)), o = this.getCenterEdges({
                    x: r.x,
                    y: r.y,
                    width: 0,
                    height: 0
                }, "line-anchor-opposite");
                this.compareEdges(t, o, e)
            }
        } else t = this.getEdges(i, "target-bounds", "resize" === this.options.action);
        this.allBlocks.forEach(function (i) {
            if (-1 === this.targetBlocks.indexOf(i)) {
                var n;
                n = "line" === i.getType() ? this.getLineEdges(i.measure(), i.getID(), i) : this.getEdges(i.measure(), i.getID()), this.compareEdges(t, n, e)
            }
        }.bind(this)), this.gridLines.forEach(function (i) {
            this.compareEdges(t, i, e)
        }.bind(this)), this.compareEdges(t, this.getEdges(this.slideBounds, "slide-bounds"), e), this.guides.h.sort(function (e, t) {
            return e.distance - t.distance
        }), this.guides.v.sort(function (e, t) {
            return e.distance - t.distance
        })
    }, compareEdges: function (e, t, i) {
        var n;
        e.h.forEach(function (e) {
            t.h.forEach(function (t) {
                n = Math.abs(e.x - t.x), i > n && this.guides.h.push({distance: n, targetEdge: e, compareEdge: t})
            }.bind(this))
        }.bind(this)), e.v.forEach(function (e) {
            t.v.forEach(function (t) {
                n = Math.abs(e.y - t.y), i > n && this.guides.v.push({distance: n, targetEdge: e, compareEdge: t})
            }.bind(this))
        }.bind(this))
    }, enforceGuides: function () {
        if ("resize" === this.options.action) {
            var e = this.targetBlocks[0];
            if (e.transform.isResizingCentered())return;
            var t = {n: 0, e: 0, s: 0, w: 0, hc: 0, vc: 0};
            this.guides.h = this.guides.h.filter(function (e) {
                return 1 === ++t[e.targetEdge.direction]
            }), this.guides.v = this.guides.v.filter(function (e) {
                return 1 === ++t[e.targetEdge.direction]
            }), this.guides.h.forEach(function (t) {
                /w|e/.test(this.options.direction) && this.options.direction.indexOf(t.targetEdge.direction) > -1 && (/w/.test(t.targetEdge.direction) ? e.resize({
                    left: t.compareEdge.x,
                    direction: t.targetEdge.direction
                }) : /e/.test(t.targetEdge.direction) && e.resize({
                    right: t.compareEdge.x,
                    direction: t.targetEdge.direction
                }))
            }.bind(this)), this.guides.v.forEach(function (t) {
                /n|s/.test(this.options.direction) && this.options.direction.indexOf(t.targetEdge.direction) > -1 && (/n/.test(t.targetEdge.direction) ? e.resize({
                    top: t.compareEdge.y,
                    direction: t.targetEdge.direction
                }) : /s/.test(t.targetEdge.direction) && e.resize({
                    bottom: t.compareEdge.y,
                    direction: t.targetEdge.direction
                }))
            }.bind(this))
        } else if ("move" === this.options.action)this.guides.h.splice(1), this.guides.v.splice(1), this.guides.h.forEach(function (e) {
            this.targetBlocks.forEach(function (t) {
                t.move(e.compareEdge.x + e.targetEdge.offset + t._guideOffsetX)
            }.bind(this))
        }.bind(this)), this.guides.v.forEach(function (e) {
            this.targetBlocks.forEach(function (t) {
                t.move(null, e.compareEdge.y + e.targetEdge.offset + t._guideOffsetY)
            }.bind(this))
        }.bind(this)); else if ("line-anchor" === this.options.action) {
            var i = this.targetBlocks[0];
            this.guides.h.length && i.setGlobalLinePoint(this.options.direction, this.guides.h[0].compareEdge.x), this.guides.v.length && i.setGlobalLinePoint(this.options.direction, null, this.guides.v[0].compareEdge.y)
        }
    }, renderGuides: function () {
        var e = [], t = this.getTargetBounds();
        this.guides.h.forEach(function (i) {
            e.push(this.renderGuide(i, t))
        }.bind(this)), this.guides.v.forEach(function (i) {
            e.push(this.renderGuide(i, t))
        }.bind(this)), this.clearGuideElements(e)
    }, renderGuide: function (e, t) {
        var i = e.targetEdge, n = e.compareEdge, r = $('[data-guide-id="' + n.id + '"]');
        0 === r.length && (r = $('<div data-guide-id="' + n.id + '">').appendTo(this.domElement), setTimeout(function () {
            r.addClass("show")
        }, 1));
        var o = {
            top: Math.min(n.bounds.y, t.y),
            right: Math.max(n.bounds.x + n.bounds.width, t.x + t.width),
            bottom: Math.max(n.bounds.y + n.bounds.height, t.y + t.height),
            left: Math.min(n.bounds.x, t.x)
        };
        if ("number" == typeof n.y) {
            var s = "s" === i.direction ? -1 : 0;
            r.addClass("guide-h"), r.css({top: Math.floor(n.y + s), left: o.left, width: o.right - o.left})
        } else {
            var a = "e" === i.direction ? -1 : 0;
            r.addClass("guide-v"), r.css({left: Math.floor(n.x + a), top: o.top, height: o.bottom - o.top})
        }
        return n.id
    }, getEdges: function (e, t, i) {
        var n = {
            h: [{id: t + "-h1", bounds: e, x: e.x, offset: 0, direction: "w"}, {
                id: t + "-h2",
                bounds: e,
                x: e.x + e.width / 2,
                offset: -e.width / 2,
                direction: "hc"
            }, {id: t + "-h3", bounds: e, x: e.x + e.width, offset: -e.width, direction: "e"}],
            v: [{id: t + "-v1", bounds: e, y: e.y, offset: 0, direction: "n"}, {
                id: t + "-v2",
                bounds: e,
                y: e.y + e.height / 2,
                offset: -e.height / 2,
                direction: "vc"
            }, {id: t + "-v3", bounds: e, y: e.y + e.height, offset: -e.height, direction: "s"}]
        };
        return i === true && (n.h.splice(1, 1), n.v.splice(1, 1)), n
    }, getCenterEdges: function (e, t, i) {
        var n = {h: [], v: []}, r = {
            id: t + "-v2",
            bounds: e,
            y: e.y + e.height / 2,
            offset: -e.height / 2,
            direction: t
        }, o = {id: t + "-h2", bounds: e, x: e.x + e.width / 2, offset: -e.width / 2, direction: t};
        return i && "vertical" !== i || n.v.push(r), i && "horizontal" !== i || n.h.push(o), n
    }, getLineEdges: function (e, t, i) {
        var n = {h: [], v: []}, r = [i.getGlobalLinePoint("p1"), i.getGlobalLinePoint("p2")];
        return r.push({
            x: e.x + (Math.max(r[0].x, r[1].x) - Math.min(r[0].x, r[1].x)) / 2,
            y: e.y + (Math.max(r[0].y, r[1].y) - Math.min(r[0].y, r[1].y)) / 2
        }), r.forEach(function (e, i) {
            var r = {x: e.x, y: e.y, width: 0, height: 0};
            n.v.push({id: t + "-v" + i, bounds: r, y: r.y, offset: 0, direction: t}), n.h.push({
                id: t + "-h" + i,
                bounds: r,
                x: r.x,
                offset: 0,
                direction: t
            })
        }), n
    }, getTargetBounds: function () {
        if (this.options && "line-anchor" === this.options.action && this.targetBlocks.length) {
            var e = this.targetBlocks[0];
            if ("line" === e.getType()) {
                var t = this.targetBlocks[0].getGlobalLinePoint(this.options.direction);
                return {x: t.x, y: t.y, width: 1, height: 1}
            }
        }
        return SL.editor.controllers.Blocks.getCombinedBounds(this.targetBlocks)
    }, clearGuideElements: function (e) {
        var t = this.domElement.find(".guide-v, .guide-h");
        e && e.length && (t = t.filter(function (t, i) {
            return -1 === e.indexOf(i.getAttribute("data-guide-id"))
        })), t.remove()
    }, isEnabled: function () {
        return SL.editor.controllers.Capabilities.isTouchEditor() ? true : SL.current_user.settings.get("editor_snap")
    }
};