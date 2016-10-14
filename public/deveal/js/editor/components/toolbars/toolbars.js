SL("editor.components").Toolbars = Class.extend({
    init: function (e) {
        this.editor = e, this.stack = [], this.render(), this.show(), this.push(new SL.editor.components.toolbars.Add)
    },
    render: function () {
        this.domElement = $('<div class="toolbars">').appendTo(document.body);
        this.innerElement = $('<div class="toolbars-inner">').appendTo(this.domElement);
        this.scrollerElement = $('<div class="toolbars-scroller">').appendTo(this.innerElement);
        this.footerElement = $('<div class="toolbars-footer"></div>').appendTo(this.domElement);
        SL.editor.controllers.Capabilities.isTouchEditor();
        this.footerElement.append('<div class="option editor-settings" data-tooltip="Editor settings"><span class="icon i-equalizer"></span></div>');
        this.footerElement.find(".option.editor-settings").on("click", this.onSettingsClicked);
    },
    show: function () {
        this.domElement.addClass("visible")
    }, hide: function () {
        this.domElement.removeClass("visible")
    }, push: function (e) {
        this.stack.push(e), e.appendTo(this.scrollerElement), this.layout()
    }, pop: function () {
        this.stack.length > 1 && this.stack.pop().destroyAfter(1e3), this.layout()
    }, get: function (e) {
        return this.stack[this.stack.length - 1 + (e || 0)]
    }, clear: function () {
        for (; this.stack.length > 1;)this.stack.pop().destroyAfter(1e3);
        this.layout()
    }, sync: function () {
        this.stack.forEach(function (e) {
            e.sync()
        })
    }, layout: function () {
        for (var e = 0, t = 0, i = this.stack.length; i > t; t++) {
            var n = this.stack[t];
            n.move(e, null), e += n.measure().width, i - 1 > t && n.collapse()
        }
        var r = this.get(), o = r.measure();
        this.domElement.find(".toolbar").removeClass("visible"), r.domElement.addClass("visible");
        var s = "translateX(" + -Math.round(o.x) + "px)";
        this.scrollerElement.css({"-webkit-transform": s, "-moz-transform": s, "-ms-transform": s, transform: s})
    }, getToolbarMeasurements: function () {
        var e = this.innerElement.position(), t = {
            x: e.left,
            y: e.top,
            width: this.innerElement.width(),
            height: this.innerElement.height()
        };
        return t.bottom = t.y + t.height, t.right = t.x + t.width, t
    }, hasOpenPanel: function () {
        return this.stack.some(function (e) {
            return e.hasOpenPanel()
        })
    }, collapse: function () {
        this.stack.forEach(function (e) {
            e.collapse()
        })
    }, onSettingsClicked: function (e) {
        this.settingsPrompt = SL.prompt({
            anchor: e.currentTarget,
            type: "custom",
            title: "Editor Settings",
            className: "editor-settings",
            html: ['<div class="editor-option sl-checkbox outline">', '<input id="editor-settings-grid" type="checkbox">', '<label for="editor-settings-grid" data-tooltip="Display a grid behind the slide to help with alignment." data-tooltip-delay="500" data-tooltip-alignment="r" data-tooltip-maxwidth="220">Grid</label>', "</div>", '<div class="editor-option sl-checkbox outline">', '<input id="editor-settings-snap" type="checkbox">', '<label for="editor-settings-snap" data-tooltip="Snap dragged blocks to the grid, slide edges and other blocks." data-tooltip-delay="500" data-tooltip-alignment="r" data-tooltip-maxwidth="220">Snap</label>', "</div>", '<div class="editor-option sl-checkbox outline">', '<input id="editor-settings-developer-mode" type="checkbox">', '<label for="editor-settings-developer-mode" data-tooltip="Turn on developer-friendly features:<br>- Per slide HTML editor.<br>- Access to full deck HTML, for exporting to reveal.js.<br>- Add class names to any focused block. Makes it easy to target content with custom CSS." data-tooltip-delay="500" data-tooltip-alignment="r" data-tooltip-maxwidth="340">Developer mode</label>', "</div>"].join("")
        });
        var t = this.settingsPrompt.getDOMElement().find("#editor-settings-grid");
        t.prop("checked", SL.current_user.settings.get("editor_grid")), t.on("change", function (e) {
            SL.current_user.settings.set("editor_grid", e.currentTarget.checked), SL.current_user.settings.save(["editor_grid"]), SL.editor.controllers.Grid.refresh(), SL.analytics.trackEditor("Toggle Grid")
        });
        var i = this.settingsPrompt.getDOMElement().find("#editor-settings-snap");
        i.prop("checked", SL.current_user.settings.get("editor_snap")), i.on("change", function (e) {
            SL.current_user.settings.set("editor_snap", e.currentTarget.checked), SL.current_user.settings.save(["editor_snap"]), SL.analytics.trackEditor("Toggle Snap")
        });
        var n = this.settingsPrompt.getDOMElement().find("#editor-settings-developer-mode");
        n.prop("checked", SL.current_user.settings.get("developer_mode")), n.on("change", function (e) {
            SL.current_user.settings.set("developer_mode", e.currentTarget.checked), SL.current_user.settings.save(["developer_mode"]), SL.view.slideOptions.configure({html: e.currentTarget.checked}), SL.analytics.trackEditor("Toggle Developer Mode")
        })
    }
});