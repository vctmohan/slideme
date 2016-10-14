SL("editor.components.toolbars.options").Select = SL.editor.components.toolbars.options.Value.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "select",
            panelType: "select",
            panelWidth: "auto",
            panelHeight: "auto",
            panelMaxHeight: 300,
            panelAlignment: "r",
            value: 0,
            items: []
        }, t)), this.keySearchString = "", this.keySearchTimeout
    }, render: function () {
        this._super(), this.domElement.addClass("toolbar-select"), this.triggerElement = $('<div class="toolbar-select-trigger">'), this.triggerElement.appendTo(this.domElement)
    }, renderPanel: function () {
        this.panel = new SL.editor.components.toolbars.util.Panel({
            type: this.config.panelType,
            anchor: this.triggerElement,
            keydown: this.onKeyDown.bind(this),
            maxHeight: this.config.panelMaxHeight,
            width: this.config.panelWidth,
            height: this.config.panelHeight,
            alignment: this.config.panelAlignment
        }), this.panel.shown.add(this.onPanelShown.bind(this)), this.config.items.forEach(this.renderItem.bind(this)), this.getListElements().on("vclick", this.onListItemClicked.bind(this))
    }, renderItem: function (e) {
        this.panel.contentElement.append('<div class="toolbar-select-item" data-value="' + e.value + '">' + (e.title || e.value) + "</div>")
    }, setValue: function (e, t) {
        this.hasValue(e) && (this._super(e, t), this.displaySelectedValue(), this.getListElements().removeClass("selected"), this.getListElements().filter('[data-value="' + this.value + '"]').first().addClass("selected")), t && this.panel && this.panel.hide()
    }, hasValue: function (e) {
        return this.config.items.some(function (t) {
            return t.value === e
        })
    }, displaySelectedValue: function () {
        this.triggerElement.text(this.getTitleByValue(this.value))
    }, clearFocus: function () {
        this.getListElements().removeClass("focused")
    }, focusDefault: function () {
        var e = this.getListElements(), t = e.filter(".focused"), i = e.filter(".selected");
        0 === t.length && (i.length ? i.addClass("focused") : e.first().addClass("focused"))
    }, focusItem: function (e) {
        e && e.length && (this.getListElements().removeClass("focused"), e.addClass("focused")), this.scrollIntoView()
    }, focusStep: function (e) {
        this.focusDefault();
        var t = this.getListElements().filter(".focused");
        this.focusItem(0 > e ? t.prev() : t.next()), this.scrollIntoView()
    }, focusByTitle: function (e) {
        var t = this.getListElements().filter(function (t, i) {
            return 0 === i.textContent.toLowerCase().indexOf(e.toLowerCase())
        });
        t.length && this.focusItem(t.first())
    }, scrollIntoView: function () {
        var e = this.getListElements(), t = e.filter(".focused"), i = e.filter(".selected");
        t.length ? SL.util.dom.scrollIntoViewIfNeeded(t.get(0)) : i.length && SL.util.dom.scrollIntoViewIfNeeded(i.get(0))
    }, getTitleByValue: function (e) {
        var t = null;
        return this.config.items.forEach(function (i) {
            i.value === e && (t = i.title)
        }), t
    }, getDefaultValue: function () {
        return this.config.items[0].value
    }, getListElements: function () {
        return this.panel ? this.panel.contentElement.find(".toolbar-select-item") : $()
    }, onListItemClicked: function (e) {
        var t = $(e.currentTarget).attr("data-value");
        t && this.setValue(t, true)
    }, onPanelShown: function () {
        this.getListElements().removeClass("selected"), this.getListElements().filter('[data-value="' + this.getValue() + '"]').first().addClass("selected"), this.scrollIntoView(), this.clearFocus()
    }, onClicked: function (e) {
        this._super(e), this.panel ? this.panel.toggle() : (this.renderPanel(), this.panel.show())
    }, onKeyDown: function (e) {
        if (38 === e.keyCode || 9 === e.keyCode && e.shiftKey)this.focusStep(-1); else if (40 === e.keyCode || 9 === e.keyCode)this.focusStep(1); else if (13 === e.keyCode) {
            var t = this.getListElements().filter(".focused").attr("data-value");
            t && this.setValue(t, true)
        } else if (27 === e.keyCode)this.panel.hide(); else {
            var i = String.fromCharCode(e.keyCode);
            i.match(/[A-Z0-9#\+]/i) && (clearTimeout(this.keySearchTimeout), this.keySearchTimeout = setTimeout(function () {
                this.keySearchString = ""
            }.bind(this), 500), this.keySearchString += i, this.focusByTitle(this.keySearchString))
        }
        return false
    }, destroy: function () {
        this.panel && (this.panel.destroy(), this.panel = null), this._super()
    }
});