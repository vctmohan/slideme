SL("editor.components.toolbars.options").Base = Class.extend({
    init: function (e, t) {
        this.block = e, this.config = t || {}, this.property = this.getPropertySettings(), this.render(), this.bind()
    }, render: function () {
        if (this.domElement = $('<div class="toolbar-option">'), this.config.type && this.domElement.attr("data-option-type", this.config.type), this.config.tooltip && this.domElement.attr({
                "data-tooltip": this.config.tooltip,
                "data-tooltip-delay": 1e3,
                "data-tooltip-maxwidth": 200
            }), this.config.label && (this.domElement.append('<h4 class="toolbar-option-label">' + this.config.label + "</h4>"), this.config.helpTooltip)) {
            var e;
            e = $(this.config.helpTooltipLink ? '<a class="toolbar-option-help" href="' + this.config.helpTooltipLink + '" target="_blank">' : '<div class="toolbar-option-help">'), e.attr({
                "data-tooltip": this.config.helpTooltip,
                "data-tooltip-alignment": "r",
                "data-tooltip-maxwidth": 240
            }), e.html("?"), e.appendTo(this.domElement.find(".toolbar-option-label"))
        }
    }, bind: function () {
        this.config.shortcut && Mousetrap.bind(this.config.shortcut, function (e) {
            e.preventDefault(), this.trigger()
        }.bind(this)), this.domElement.on("vclick", this.onClicked.bind(this))
    }, appendTo: function (e) {
        this.domElement.appendTo(e)
    }, destroy: function () {
        this.domElement.remove()
    }, getPropertySettings: function () {
        return this.block && "string" == typeof this.config.property ? this.block.getPropertySettings(this.config.property) : null
    }, onClicked: function (e) {
        $(e.target).is(".toolbar-option-help") || e.preventDefault()
    }
});