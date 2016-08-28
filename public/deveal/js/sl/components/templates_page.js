SL("components").TemplatesPage = Class.extend({
    init: function (t) {
        this.options = t || {}, this.templateSelected = new signals.Signal, this.render()
    }, render: function () {
        this.domElement = $('<div class="page" data-page-id="' + this.options.id + '">'), this.actionList = $('<div class="action-list">').appendTo(this.domElement), this.templateList = $("<div>").appendTo(this.domElement), this.options.templates.forEach(this.renderTemplate.bind(this)), (this.isDefaultTemplates() || this.isTeamTemplates() && this.getNumberOfVisibleTemplates() > 0) && (this.blankTemplate = this.renderBlankTemplate(), this.duplicateTemplate = this.renderDuplicateTemplate())
    }, renderBlankTemplate: function (t) {
        return t = $.extend({
            container: this.actionList,
            editable: false
        }, t), this.renderTemplate(new SL.models.Template({
            label: "Blank",
            html: ""
        }), t)
    }, renderDuplicateTemplate: function (t, e) {
        return t = $.extend({
            container: this.actionList,
            editable: false
        }, t), this.renderTemplate(new SL.models.Template({
            label: "Duplicate",
            html: e || ""
        }), t)
    }, renderTemplate: function (t, e) {
        e = $.extend({prepend: false, editable: true, container: this.templateList}, e);
        var i = $('<div class="template-item">');
        i.html(['<div class="template-item-thumb themed">', '<div class="template-item-thumb-content reveal reveal-thumbnail">', '<div class="slides">', t.get("html"), "</div>", '<div class="backgrounds"></div>', "</div>", "</div>"].join("")), i.data("template-model", t), i.on("vclick", this.onTemplateSelected.bind(this, i)), i.find('.sl-block[data-block-type="code"] pre').addClass("hljs"), t.get("label") && i.append('<span class="template-item-label">' + t.get("label") + "</span>"), e.replaceTemplate ? e.replaceTemplate.replaceWith(i) : e.replaceTemplateAt ? e.container.find(".template-item").eq(e.replaceTemplateAt).replaceWith(i) : e.prepend ? e.container.prepend(i) : e.container.append(i);
        var n = i.find("section").attr("data-background-color"), s = i.find("section").attr("data-background-image"), o = i.find("section").attr("data-background-size"), a = $('<div class="slide-background present template-item-thumb-background">');
        if (a.addClass(i.find(".template-item-thumb .reveal section").attr("class")), a.appendTo(i.find(".template-item-thumb .reveal>.backgrounds")), (n || s) && (n && a.css("background-color", n), s && a.css("background-image", 'url("' + s + '")'), o && a.css("background-size", o)), this.isEditable() && e.editable) {
            var r = $('<div class="template-item-options"></div>').appendTo(i), l = $('<div class="option"><span class="icon i-trash-stroke"></span></div>');
            if (l.attr("data-tooltip", "Delete this template"), l.on("vclick", this.onTemplateDeleteClicked.bind(this, i)), l.appendTo(r), this.isTeamTemplates() && SL.current_user.getThemes().size() > 1) {
                var c = $('<div class="option"><span class="icon i-ellipsis-v"></span></div>');
                c.attr("data-tooltip", "Theme availability"), c.on("vclick", this.onTemplateThemeClicked.bind(this, i)), c.appendTo(r)
            }
        }
        return i
    }, refresh: function () {
        this.duplicateTemplate && this.duplicateTemplate.length && (this.duplicateTemplate = this.renderDuplicateTemplate({replaceTemplate: this.duplicateTemplate}, SL.data.templates.templatize(Reveal.getCurrentSlide()))), this.templateList.find(".placeholder").remove();
        var t = SL.view.getCurrentTheme(), e = this.domElement.find(".template-item");
        if (this.isTeamTemplates() && e.each(function (e, i) {
                var n = $(i), s = n.data("template-model").isAvailableForTheme(t);
                n.toggleClass(SL.current_user.isEnterpriseManager() ? "semi-hidden" : "hidden", !s)
            }.bind(this)), e = this.domElement.find(".template-item:not(.hidden)"), e.length)e.each(function (e, i) {
            var n = $(i), s = (n.data("template-model"), n.find(".template-item-thumb"));
            s.attr("class", s.attr("class").replace(/theme\-(font|color)\-([a-z0-9-])*/gi, "")), s.addClass("theme-font-" + t.get("font")), s.addClass("theme-color-" + t.get("color")), s.find(".template-item-thumb-content img[data-src]").each(function () {
                this.setAttribute("src", this.getAttribute("data-src")), this.removeAttribute("data-src")
            }), SL.data.templates.layoutTemplate(s.find("section"), true)
        }.bind(this)), this.templateList.find(".placeholder").remove(); else {
            var i = "You haven't saved any custom templates yet.<br>Click the button below to save one now.";
            this.isTeamTemplates() && (i = SL.current_user.isEnterpriseManager() ? "Templates saved here are made available to the everyone in your team." : "No templates are available for the current theme."), this.templateList.append('<p class="placeholder">' + i + "</p>")
        }
    }, appendTo: function (t) {
        this.domElement.appendTo(t)
    }, saveCurrentSlide: function () {
        var t = SL.config.AJAX_SLIDE_TEMPLATES_CREATE;
        return this.isTeamTemplates() && (t = SL.config.AJAX_TEAM_SLIDE_TEMPLATES_CREATE), $.ajax({
            type: "POST",
            url: t,
            context: this,
            data: {slide_template: {html: SL.data.templates.templatize(Reveal.getCurrentSlide())}}
        }).done(function (t) {
            this.options.templates.create(t, {prepend: true}).then(function (t) {
                this.renderTemplate(t, {prepend: true}), this.refresh()
            }.bind(this)), SL.notify(SL.locale.get("TEMPLATE_CREATE_SUCCESS"))
        }).fail(function () {
            SL.notify(SL.locale.get("TEMPLATE_CREATE_ERROR"), "negative")
        })
    }, isEditable: function () {
        return this.isUserTemplates() || this.isTeamTemplates() && SL.current_user.isEnterpriseManager()
    }, isDefaultTemplates: function () {
        return "default" === this.options.id
    }, isUserTemplates: function () {
        return "user" === this.options.id
    }, isTeamTemplates: function () {
        return "team" === this.options.id
    }, getNumberOfVisibleTemplates: function () {
        return this.domElement.find(".template-item:not(.hidden)").length
    }, onTemplateSelected: function (t, e) {
        e.preventDefault();
        this.templateSelected.dispatch(t.data("template-model"));
    }, onTemplateDeleteClicked: function (t, e) {
        return e.preventDefault(), SL.prompt({
            anchor: $(e.currentTarget),
            title: SL.locale.get("TEMPLATE_DELETE_CONFIRM"),
            type: "select",
            hoverTarget: t,
            data: [{html: "<h3>Cancel</h3>"}, {
                html: "<h3>Delete</h3>",
                selected: true,
                className: "negative",
                callback: function () {
                    var e = t.data("template-model"), i = SL.config.AJAX_SLIDE_TEMPLATES_DELETE(e.get("id"));
                    this.isTeamTemplates() && (i = SL.config.AJAX_TEAM_SLIDE_TEMPLATES_DELETE(e.get("id"))), $.ajax({
                        type: "DELETE",
                        url: i,
                        context: this
                    }).done(function () {
                        t.remove(), this.refresh()
                    })
                }.bind(this)
            }]
        }), false
    }, onTemplateThemeClicked: function (t, e) {
        e.preventDefault();
        var i = SL.current_user.getThemes();
        if (i.size() > 0) {
            var n = t.data("template-model"), s = n.get("id"), o = n.isAvailableForAllThemes(), a = ($(Reveal.getCurrentSlide()), [{
                value: "All themes",
                selected: o,
                exclusive: true,
                className: "header-item",
                callback: function () {
                    i.forEach(function (t) {
                        t.hasSlideTemplate(s) && t.removeSlideTemplate([s]).fail(this.onGenericError)
                    }.bind(this)), this.refresh()
                }.bind(this)
            }]);
            i.forEach(function (t) {
                a.push({
                    value: t.get("name"),
                    selected: o ? false : n.isAvailableForTheme(t),
                    callback: function (e, i) {
                        i ? t.addSlideTemplate([s]).fail(this.onGenericError) : t.removeSlideTemplate([s]).fail(this.onGenericError), this.refresh()
                    }.bind(this)
                })
            }.bind(this)), SL.prompt({
                anchor: $(e.currentTarget),
                title: "Available for...",
                type: "list",
                alignment: "l",
                data: a,
                multiselect: true,
                optional: true,
                hoverTarget: t
            })
        }
        return false
    }, onGenericError: function () {
        SL.notify(SL.locale.get("GENERIC_ERROR"), "negative")
    }
});