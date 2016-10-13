SL("editor.components.toolbars.options").Button = SL.editor.components.toolbars.options.Base.extend({
    init: function (e, t) {
        this._super(e, t)
    }, render: function () {
        this._super(), this.domElement.addClass("toolbar-button"), (this.config.title || this.config.icon) && (this.domElement.addClass("has-title"), this.titleElement = $('<div class="toolbar-option-title vcenter">').appendTo(this.domElement), this.config.title ? this.titleElement.html('<span class="title vcenter-target">' + this.config.title + "</span>") : this.config.icon && (this.domElement.addClass("is-icon"), this.titleElement.html('<span class="icon i-' + this.config.icon + ' vcenter-target"></span>'), this.config.activeIcon && (this.domElement.addClass("has-active-state"), this.activeElement = $('<div class="toolbar-option-title vcenter active">').appendTo(this.domElement), this.activeElement.html('<span class="icon i-' + this.config.activeIcon + ' vcenter-target"></span>'))))
    }
});