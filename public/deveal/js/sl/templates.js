/*
 * options show{
 anchor: this.addHorizontalSlideButton, alignment: SLConfig.deck.rtl ? "l" : "r", callback: function (e) {
 SL.editor.controllers.Markup.addHorizontalSlide(e)
 }
 }*/

Templates = Class.extend({
    init: function (options) {
        this.domElement = $('.sl-templates');
        this.innerElement = $('.sl-templates-inner');
        this.options = $.extend({
            alignment: "r",
            width: 450,
            height: 800,
            arrowSize: 8
        }, options);
        this.pages = [];
        this.pagesHash = {};
        //SL.data.templates.getUserTemplates();
        //SL.data.templates.getTeamTemplates();
        this.bind();
    },
    renderPage: function (t, e, i) {
        var n = $('<div class="page-tab" data-page-id="' + t + '">' + e + "</div>");
        n.on("vclick", function () {
            this.showPage(t), SL.analytics.trackEditor("Slide templates tab clicked", t)
        }.bind(this)), n.appendTo(this.headerElement);
        var s = new SL.components.TemplatesPage({id: t, templates: i});
        s.templateSelected.add(this.onTemplateSelected.bind(this)), s.appendTo(this.bodyElement), this.pages.push(s), this.pagesHash[t] = s, this.domElement.attr("data-pages-total", this.pages.length)
    },
    selectDefaultPage: function () {
        var t = this.pages.some(function (t) {
            return t.isTeamTemplates() && t.getNumberOfVisibleTemplates() > 0
        });
        this.showPage(t ? "team" : "default")
    },
    showPage: function (t) {
        this.currentPage = this.pagesHash[t], this.currentPage ? (this.bodyElement.find(".page").removeClass("past present future"), this.bodyElement.find('.page[data-page-id="' + t + '"]').addClass("present"), this.bodyElement.find('.page[data-page-id="' + t + '"]').prevAll().addClass("past"), this.bodyElement.find('.page[data-page-id="' + t + '"]').nextAll().addClass("future"), this.headerElement.find(".page-tab").removeClass("selected"), this.headerElement.find('.page-tab[data-page-id="' + t + '"]').addClass("selected")) : console.warn('Template page "' + t + '" not found.')
    },
    bind: function () {
        this.layout = this.layout.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClicked = this.onClicked.bind(this);
        this.domElement.on("vclick", this.onClicked)
    },
    layout: function () {
        var t = 10;
        e = this.domElement.outerWidth();
        i = this.domElement.outerHeight();
        width = this.options.width;
        height = this.options.height;
        anchor = {};
        width = Math.min(width, i - 2 * t);
        height = Math.min(height, i - 2 * t);

        if (this.options.anchor) {
            anchor.left = this.options.anchor.offset().left;
            anchor.top = this.options.anchor.offset().top;
            anchor.width = this.options.anchor.outerWidth();
            anchor.height = this.options.anchor.outerHeight();
            anchor.right = anchor.left + anchor.width;
            anchor.bottom = anchor.top + anchor.height;
        }

        var left, top;

        if (this.options.anchor) {
            if ("r" === this.options.alignment) {
                width = Math.min(width, anchor.left - 2 * t);
                left = anchor.left - width - this.options.arrowSize - t;
                top = anchor.top + anchor.height / 2 - height / 2;
            } else {
                if ("b" === this.options.alignment) {
                    height = Math.min(height, anchor.top - 2 * t);
                    left = anchor.left + anchor.width / 2 - width / 2;
                    top = anchor.top - height - this.options.arrowSize - t;
                } else {
                    if ("l" === this.options.alignment) {
                        width = Math.min(width, e - anchor.right - 2 * t);
                        left = anchor.right + this.options.arrowSize + t;
                        top = anchor.top + anchor.height / 2 - height / 2;
                    } else {
                        left = (e - width) / 2;
                        top = (i - height) / 2;
                    }
                }
            }
        }

        this.innerElement.css({
            width: width,
            height: height,
            left: left,
            top: top
        })

        this.domElement.attr("data-alignment",this.options.alignment);

    },
    show: function (options) {
        this.domElement.removeClass("hidden");
        this.options = $.extend(this.options, options);
        $(window).on("resize", this.layout);
        //SL.keyboard.keydown(this.onKeyDown);
        this.layout();
    },
    hide: function () {
        $(".sl-templates").addClass("hidden");
    },
    onTemplateSelected: function (t) {
        this.options.callback && (this.hide(), this.options.callback(t.get("html")))
    },
    onTemplateCreateClicked: function () {
        return this.currentPage.isEditable() || this.showPage("user"), this.addTemplateButtonLoader.start(), this.currentPage.saveCurrentSlide().then(function () {
            this.addTemplateButtonLoader.stop()
        }.bind(this), function () {
            this.addTemplateButtonLoader.stop()
        }.bind(this)), SL.analytics.trackEditor(this.currentPage.isTeamTemplates() ? "Saved team template" : "Saved user template"), false
    },
    onKeyDown: function (t) {
        return 27 === t.keyCode ? (this.hide(), false) : true
    },
    onClicked: function (t) {
        $(t.target).is(this.domElement) && (t.preventDefault(), this.hide())
    },
    destroy: function () {
        $(window).off("resize", this.layout), SL.keyboard.release(this.onKeyDown), this.domElement.remove()
    }
});