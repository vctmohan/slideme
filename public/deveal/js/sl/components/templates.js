SL("components").Templates = Class.extend({
    init: function (t) {
        this.options = $.extend({
            alignment: "",
            width: 450,
            height: 800,
            arrowSize: 8
        }, t), this.pages = [], this.pagesHash = {}, SL.data.templates.getUserTemplates(), SL.data.templates.getTeamTemplates(), this.render(), this.bind()
    },
    render: function () {
        this.domElement = $('<div class="sl-templates">');
        this.innerElement = $('<div class="sl-templates-inner">').appendTo(this.domElement);
        this.domElement.data("instance", this);
        this.headerElement = $('<div class="sl-templates-header">').appendTo(this.innerElement);
        this.bodyElement = $('<div class="sl-templates-body">').appendTo(this.innerElement);
        this.footerElement = $('<div class="sl-templates-footer">').appendTo(this.innerElement);
        this.addTemplateButton = $(['<div class="add-new-template ladda-button" data-style="zoom-out" data-spinner-color="#222" data-spinner-size="32">', '<span class="icon i-plus"></span>', "<span>Save current slide</span>", "</div>"].join(""));
        this.addTemplateButton.on("click", this.onTemplateCreateClicked.bind(this));
        this.addTemplateButton.appendTo(this.footerElement);
        this.addTemplateButtonLoader = Ladda.create(this.addTemplateButton.get(0));
    },
    renderTemplates: function () {
        this.pages = [];
        this.headerElement.empty();
        this.bodyElement.empty();
        this.renderPage("default", "Default", SL.data.templates.getDefaultTemplates());
        SL.data.templates.getUserTemplates(function (t) {
            this.renderPage("user", "Yours", t)
        }.bind(this));
        SL.data.templates.getTeamTemplates(function (t) {
            (SL.current_user.isEnterpriseManager() || !t.isEmpty()) && this.renderPage("team", "Team", t)
        }.bind(this));
    },
    renderPage: function (t, e, i) {
        var n = $('<div class="page-tab" data-page-id="' + t + '">' + e + "</div>");
        n.on("vclick", function () {
            this.showPage(t)
        }.bind(this));
        n.appendTo(this.headerElement);
        var s = new SL.components.TemplatesPage({id: t, templates: i});
        s.templateSelected.add(this.onTemplateSelected.bind(this));
        s.appendTo(this.bodyElement);
        this.pages.push(s);
        this.pagesHash[t] = s;
        this.domElement.attr("data-pages-total", this.pages.length);
    }, selectDefaultPage: function () {
        var t = this.pages.some(function (t) {
            return t.isTeamTemplates() && t.getNumberOfVisibleTemplates() > 0
        });
        this.showPage(t ? "team" : "default")
    }, showPage: function (t) {
        this.currentPage = this.pagesHash[t], this.currentPage ? (this.bodyElement.find(".page").removeClass("past present future"), this.bodyElement.find('.page[data-page-id="' + t + '"]').addClass("present"), this.bodyElement.find('.page[data-page-id="' + t + '"]').prevAll().addClass("past"), this.bodyElement.find('.page[data-page-id="' + t + '"]').nextAll().addClass("future"), this.headerElement.find(".page-tab").removeClass("selected"), this.headerElement.find('.page-tab[data-page-id="' + t + '"]').addClass("selected")) : console.warn('Template page "' + t + '" not found.')
    }, refreshPages: function () {
        this.pages.forEach(function (t) {
            t.refresh()
        })
    }, bind: function () {
        this.layout = this.layout.bind(this), this.onKeyDown = this.onKeyDown.bind(this), this.onClicked = this.onClicked.bind(this), this.domElement.on("vclick", this.onClicked)
    }, layout: function () {
        var t = 10, e = this.domElement.outerWidth(), i = this.domElement.outerHeight(), n = this.options.width, s = this.options.height, o = {};
        n = Math.min(n, i - 2 * t), s = Math.min(s, i - 2 * t), this.options.anchor && (o.left = this.options.anchor.offset().left, o.top = this.options.anchor.offset().top, o.width = this.options.anchor.outerWidth(), o.height = this.options.anchor.outerHeight(), o.right = o.left + o.width, o.bottom = o.top + o.height);
        var a, r;
        this.options.anchor && "r" === this.options.alignment ? (n = Math.min(n, o.left - 2 * t), a = o.left - n - this.options.arrowSize - t, r = o.top + o.height / 2 - s / 2) : this.options.anchor && "b" === this.options.alignment ? (s = Math.min(s, o.top - 2 * t), a = o.left + o.width / 2 - n / 2, r = o.top - s - this.options.arrowSize - t) : this.options.anchor && "l" === this.options.alignment ? (n = Math.min(n, e - o.right - 2 * t), a = o.right + this.options.arrowSize + t, r = o.top + o.height / 2 - s / 2) : (a = (e - n) / 2, r = (i - s) / 2), this.innerElement.css({
            width: n,
            height: s,
            left: a,
            top: r
        })
    }, show: function (t) {
        this.options = $.extend(this.options, t), 0 === this.pages.length && this.renderTemplates(), this.domElement.attr("data-alignment", this.options.alignment), this.domElement.appendTo(document.body), SL.util.skipCSSTransitions(this.domElement), $(window).on("resize", this.layout), SL.keyboard.keydown(this.onKeyDown), this.refreshPages(), this.hasSelectedDefaultPage || (this.hasSelectedDefaultPage = true, this.selectDefaultPage()), this.layout()
    }, hide: function () {
        this.domElement.detach(), $(window).off("resize", this.layout), SL.keyboard.release(this.onKeyDown)
    }, onTemplateSelected: function (t) {
        if(this.options.callback){
            this.hide();
            this.options.callback(t.get("html"));
        }
    }, onTemplateCreateClicked: function () {
        return this.currentPage.isEditable() || this.showPage("user"), this.addTemplateButtonLoader.start(), this.currentPage.saveCurrentSlide().then(function () {
            this.addTemplateButtonLoader.stop()
        }.bind(this), function () {
            this.addTemplateButtonLoader.stop()
        }.bind(this)), false
    }, onKeyDown: function (t) {
        return 27 === t.keyCode ? (this.hide(), false) : true
    },
    onClicked: function (t) {
        $(t.target).is(this.domElement) && (t.preventDefault(), this.hide())
    }, destroy: function () {
        $(window).off("resize", this.layout), SL.keyboard.release(this.onKeyDown), this.domElement.remove()
    }
});