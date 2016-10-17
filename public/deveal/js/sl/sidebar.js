Sidebar = Class.extend({
    init: function (e) {
        this.options = e || {};
        this.sidebarElement = $(".sidebar");
        this.sidebarPrimary = this.sidebarElement.find(".primary");
        this.sidebarSecondary = this.sidebarElement.find(".secondary");
        this.sidebarHeader = this.sidebarElement.find(".global-header");
        this.sidebarScrollShadowTop = this.sidebarElement.find(".scroll-shadow-top");
        this.sidebarScrollShadowBottom = this.sidebarElement.find(".scroll-shadow-bottom");
        this.panelElement = $(".sidebar-panel");
        this.saveButton = this.sidebarElement.find(".button.save");
        this.previewButton = this.sidebarElement.find(".button.preview");
        this.undoButton = this.sidebarElement.find(".button.undo");
        this.exportButton = this.sidebarElement.find(".button.export");
        this.importButton = this.sidebarElement.find(".button.import");
        this.publishButton = this.sidebarElement.find(".button.publish");
        this.settingsButton = this.sidebarElement.find(".button.settings");
        this.revisionsButton = this.sidebarElement.find(".button.revisions");
        this.medialibraryButton = this.sidebarElement.find(".button.medialibrary");
        this.arrangeButton = this.sidebarElement.find(".button.arrange");
        this.styleButton = this.sidebarElement.find(".button.style");
        this.presentButton = this.sidebarElement.find(".button.present");
        this.previewButton && this.previewButton.attr("data-tooltip", "Preview (" + SL.util.getMetaKeyName() + " + F)");
        this.undoButton && this.undoButton.attr("data-tooltip", "Undo (" + SL.util.getMetaKeyName() + " + Z)");
        this.currentPanel = null;
        this.createSignals();
        this.render();
        this.bind();
        this.layout();
        this.updatePublishButton();
        this.updateUndoButton();
        this.updatePresentButton();
        SL.editor.controllers.Capabilities.canExport() || this.exportButton.hide();
        SL.editor.controllers.Capabilities.canPresent() || this.presentButton.hide();
        SL.editor.controllers.Capabilities.canChangeStyles() || this.styleButton.hide();
        SL.editor.controllers.Capabilities.canSetVisibility() || this.publishButton.hide();
    },
    bind: function () {
        this.saveButton.on("vclick", this.onSaveClicked.bind(this));
        this.previewButton && this.previewButton.on("vclick", this.onPreviewClicked.bind(this));
        this.undoButton && this.undoButton.on("vclick", this.onUndoClicked.bind(this));
        this.exportButton && this.exportButton.on("vclick", this.onExportClicked.bind(this));
        this.importButton && this.importButton.on("vclick", this.onImportClicked.bind(this));
        this.settingsButton.on("vclick", this.onSettingsClicked.bind(this));
        this.revisionsButton.on("vclick", this.onRevisionsClicked.bind(this));
        this.medialibraryButton.on("vclick", this.onMediaLibraryClicked.bind(this));
        this.publishButton.on("vclick", this.onPublishClicked.bind(this));
        this.arrangeButton.on("vclick", this.onArrangeClicked.bind(this));
        this.styleButton.on("vclick", this.onStyleClicked.bind(this));
        this.panelElement.on("vclick", this.onPanelElementClicked.bind(this));
        this.sidebarSecondary.on("scroll", this.layout.bind(this));
        this.settingsPanel.onclose.add(this.close.bind(this));
        this.exportPanel.onclose.add(this.close.bind(this));
        this.importPanel.onclose.add(this.close.bind(this));
        this.revisionsPanel.onclose.add(this.close.bind(this));
        this.stylePanel.onclose.add(this.close.bind(this));
        $(window).on("resize", this.layout.bind(this));
        SL.editor.controllers.History.changed.add(this.updateUndoButton.bind(this));
        SL.editor.controllers.URL.changed.add(this.updatePresentButton.bind(this));
    }, createSignals: function () {
        this.saveClicked = new signals.Signal, this.previewClicked = new signals.Signal
    }, render: function () {
        this.revisionsPanel = new SL.editor.components.sidebar.Revisions, this.settingsPanel = new SL.editor.components.sidebar.Settings, this.exportPanel = new SL.editor.components.sidebar.Export, this.importPanel = new SL.editor.components.sidebar.Import, this.stylePanel = new SL.editor.components.sidebar.Style, this.renderMoreOptions()
    }, renderMoreOptions: function () {
        var e = [{
            label: "Save a copy", icon: "fork", callback: function () {
                SL.editor.controllers.API.forkDeck();
            }.bind(this)
        }];
        if(SL.editor.controllers.Capabilities.canDeleteDeck()) {
            e.push({
                label: "Delete deck",
                icon: "trash-fill",
                callback: function () {
                    SL.editor.controllers.API.deleteDeck();
                }.bind(this)
            });
        }
        this.moreOptionsElement = this.sidebarElement.find(".more-options");
        this.moreOptions = new SL.components.Menu({
                anchor: this.moreOptionsElement,
                anchorSpacing: 10,
                alignment: "r",
                showOnHover: true,
                options: e
            });

    }, layout: function () {
        var e = window.innerHeight - (this.sidebarPrimary.outerHeight(true) + this.sidebarHeader.outerHeight(true));
        this.sidebarSecondary.css("max-height", e);
        var t = this.sidebarSecondary.scrollTop(), i = this.sidebarSecondary.prop("scrollHeight"), n = this.sidebarSecondary.outerHeight(), r = i > n, o = t / (i - n);
        this.sidebarScrollShadowBottom.css({
            opacity: r ? 1 - o : 0,
            bottom: this.sidebarHeader.outerHeight()
        }), this.sidebarScrollShadowTop.css({opacity: r ? o : 0, top: this.sidebarSecondary.offset().top})
    }, open: function (e) {
        switch (this.currentPanel && this.currentPanel.close(), SL.editor.controllers.Mode.clear(), e) {
            case"settings":
                this.currentPanel = this.settingsPanel;
                break;
            case"export":
                this.currentPanel = this.exportPanel;
                break;
            case"import":
                this.currentPanel = this.importPanel;
                break;
            case"style":
                this.currentPanel = this.stylePanel;
                break;
            case"revisions":
                this.currentPanel = this.revisionsPanel
        }
        this.setActiveButton(e), this.currentPanel.open(), this.panelElement.addClass("visible")
    }, close: function (e) {
        this.currentPanel && (e === true && this.currentPanel.save(), this.currentPanel.close()), this.setActiveButton(null), this.panelElement.removeClass("visible")
    }, toggle: function (e) {
        this.isExpanded(e) ? this.close() : this.open(e)
    }, setActiveButton: function (e) {
        e ? (this.sidebarElement.addClass("has-active-panel"), this.sidebarSecondary.find(".active").removeClass("active"), this.sidebarSecondary.find(".button." + e).addClass("active")) : (this.sidebarElement.removeClass("has-active-panel"), this.sidebarSecondary.find(".active").removeClass("active"))
    }, isExpanded: function (e) {
        return e ? this.panelElement.find("." + e).hasClass("visible") : this.panelElement.hasClass("visible")
    }, updateSaveButton: function (e, t) {
        this.saveButton.attr({"class": "button save " + (e || ""), "data-tooltip": t || ""})
    }, updatePublishButton: function () {
        var e = this.publishButton.find(".icon");
        SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF ? e.removeClass("i-unlock-stroke").addClass("i-lock-stroke") : SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_TEAM ? e.removeClass("i-lock-stroke").addClass("i-unlock-stroke") : SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_ALL && e.removeClass("i-lock-stroke").addClass("i-unlock-stroke"), SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF || SL.util.user.isPro() ? this.publishButton.attr("data-tooltip", "Visibility") : this.publishButton.attr("data-tooltip", "<strong>This presentation is public.</strong><br>You need a Pro account to save <br>privately. Click to learn more.")
    }, updateArrangeButton: function (e) {
        this.setActiveButton("arranging" === e ? "arrange" : null)
    }, updateUndoButton: function () {
        this.undoButton && this.undoButton.toggleClass("disabled", !SL.editor.controllers.History.canUndo())
    }, updatePresentButton: function () {
        this.presentButton && SLConfig.deck.slug && this.presentButton.attr("href", SL.routes.DECK_LIVE(SLConfig.deck.user.username, SLConfig.deck.slug))
    }, onSaveClicked: function (e) {
        e.preventDefault(), this.saveClicked.dispatch()
    }, onPreviewClicked: function (e) {
        e.preventDefault(), this.previewClicked.dispatch()
    }, onUndoClicked: function (e) {
        e.preventDefault(), SL.editor.controllers.History.undo({ignoreMode: true})
    }, onExportClicked: function () {
        var e = $(".reveal .slides").children().map(function () {
            var e = $(this).clone();
            return e.find("section").add(e).each(function () {
                var e = $.map(this.attributes, function (e) {
                    return e.name
                }), t = $(this);
                $.each(e, function (e, i) {
                    t.removeAttr(i)
                })
            }), e.wrap("<div>").parent().html()
        }).toArray().join("");
        return e = '<div class="slides">' + e + "</div>", $(".sidebar .export textarea").text(SL.util.html.indent(e)), this.toggle("export"), false
    }, onImportClicked: function () {
        return this.toggle("import"), false
    }, onArrangeClicked: function () {
        return this.close(), SL.editor.controllers.Mode.toggle("arrange"), false
    }, onSettingsClicked: function () {
        return this.toggle("settings"), false
    }, onRevisionsClicked: function () {
        return this.toggle("revisions"), false
    }, onMediaLibraryClicked: function () {
        return SL.popup.open(SL.editor.components.medialibrary.MediaLibrary), false
    }, onStyleClicked: function () {
        return this.toggle("style"), false
    }, onPublishClicked: function (e) {
        if (e.preventDefault(), SL.util.user.isPro() || SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF) {
            var t = [];
            t.push({
                html: SL.locale.get("DECK_VISIBILITY_CHANGE_SELF"),
                selected: SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF,
                callback: function () {
                    SLConfig.deck.visibility = SL.models.Deck.VISIBILITY_SELF, SL.view.saveVisibility(), this.updatePublishButton()
                }.bind(this)
            }), SL.current_user.isEnterprise() && t.push({
                html: SL.locale.get("DECK_VISIBILITY_CHANGE_TEAM"),
                selected: SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_TEAM,
                className: "divider",
                callback: function () {
                    SLConfig.deck.visibility = SL.models.Deck.VISIBILITY_TEAM, SL.view.saveVisibility(), this.updatePublishButton()
                }.bind(this)
            }), t.push({
                html: SL.locale.get("DECK_VISIBILITY_CHANGE_ALL"),
                selected: SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_ALL,
                callback: function () {
                    SLConfig.deck.visibility = SL.models.Deck.VISIBILITY_ALL, SL.view.saveVisibility(), this.updatePublishButton()
                }.bind(this)
            }), SL.prompt({
                anchor: this.publishButton,
                alignment: "r",
                type: "select",
                className: "sl-visibility-prompt",
                data: t
            })
        } else window.open("/pricing")
    }, onPanelElementClicked: function (e) {
        e.target == this.panelElement.get(0) && this.close()
    }
});

Sidebar.Base = Class.extend({
    init: function () {
        this.saved = false, this.onWindowResize = this.onWindowResize.bind(this), this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this), this.onSaveClicked = this.onSaveClicked.bind(this), this.onCancelClicked = this.onCancelClicked.bind(this), this.onCloseClicked = this.onCloseClicked.bind(this), this.render(), this.bind(), this.createSignals()
    }, render: function () {
        this.bodyElement = this.domElement.find(".panel-body"), this.footerElement = this.domElement.find(".panel-footer"), this.scrollShadow = new SL.components.ScrollShadow({
            parentElement: this.domElement,
            contentElement: this.bodyElement,
            footerElement: this.footerElement,
            resizeContent: false
        })
    }, bind: function () {
        this.domElement.find(".save").on("click", this.onSaveClicked), this.domElement.find(".cancel").on("click", this.onCancelClicked), this.domElement.find(".close").on("click", this.onCloseClicked)
    }, createSignals: function () {
        this.onclose = new signals.Signal
    }, buffer: function () {
        this.config = JSON.parse(JSON.stringify(SLConfig))
    }, open: function () {
        this.saved = false, this.domElement.addClass("visible"), this.layout(), $(window).on("resize", this.onWindowResize), $(document).on("keydown", this.onDocumentKeyDown)
    }, close: function () {
        this.domElement.removeClass("visible"), $(window).off("resize", this.onWindowResize), $(document).off("keydown", this.onDocumentKeyDown), this.saved === false && this.revert()
    }, layout: function () {
        if (this.bodyElement.length && this.footerElement.length) {
            var e = this.bodyElement.get(0).scrollHeight, t = this.footerElement.outerHeight(true) + parseInt(this.footerElement.css("margin-top"), 10);
            this.domElement.toggleClass("overflowing", e > window.innerHeight - t)
        }
        this.scrollShadow.sync()
    }, revert: function () {
        this.buffer(), this.updateSelection(), this.applySelection()
    }, save: function () {
        return this.saved = true, true
    }, updateSelection: function () {
    }, applySelection: function () {
    }, onSaveClicked: function () {
        this.save() && this.onclose.dispatch()
    }, onCancelClicked: function () {
        this.onclose.dispatch()
    }, onCloseClicked: function () {
        this.onclose.dispatch()
    }, onDocumentKeyDown: function () {
    }, onWindowResize: function () {
        this.layout()
    }
});

Sidebar.Settings = Sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .settings");
        this.rtlToggle = this.domElement.find('.sl-checkbox input[value="rtl"]');
        this.loopToggle = this.domElement.find('.sl-checkbox input[value="should_loop"]');
        this.commentsEnabledToggle = this.domElement.find('.sl-checkbox input[value="comments_enabled"]');
        this.forkingEnabledToggle = this.domElement.find('.sl-checkbox input[value="forking_enabled"]');
        this.shareNotesToggle = this.domElement.find('.sl-checkbox input[value="share_notes"]');
        this.slideNumberToggle = this.domElement.find('.sl-checkbox input[value="slide_number"]');
        this.titleInput = this.domElement.find("#deck-input-title");
        this.descriptionInput = this.domElement.find("#deck-input-description");
        this.slug = this.domElement.find(".slug");
        this.slugInput = this.domElement.find("#deck-input-slug");
        this.slugPrefix = this.domElement.find(".slug .text-prefix");
        this.autoSlideInput = this.domElement.find("#deck-input-autoslide");
        this.renderAutoSlideOptions();
        this._super();
    }, renderAutoSlideOptions: function () {
        var e = '<option value="0">Off</option>';
        SL.config.AUTO_SLIDE_OPTIONS.forEach(function (t) {
            e += '<option value="' + 1e3 * t + '">' + t + " seconds</option>"
        }), this.autoSlideInput.html(e)
    }, bind: function () {
        this._super(), this.domElement.find(".sl-checkbox input").on("change", this.onToggleChange.bind(this)), this.titleInput.on("input", this.onTitleInput.bind(this)), this.slugInput.on("input", this.onSlugInput.bind(this)), this.slugInput.on("focus", this.onSlugFocus.bind(this)), this.slugInput.on("blur", this.onSlugBlur.bind(this)), this.descriptionInput.on("keypress", this.onDescriptionKeyPress.bind(this))
    }, open: function () {
        this._super(), this.buffer(), this.updateSelection(), this.titleInput.val(SL.util.unescapeHTMLEntities(this.config.deck.title || "")), this.slugInput.val(this.config.deck.slug), this.descriptionInput.val(SL.util.unescapeHTMLEntities(this.config.deck.description || "")), this.autoSlideInput.val(this.config.deck.auto_slide_interval || 0), this.slugPrefix.text(window.location.host + "/" + SLConfig.current_user.username + "/"), this.slugInput.css("padding-left", this.slugPrefix.position().left + this.slugPrefix.width())
    }, close: function () {
        this._super()
    }, save: function () {
        var e = this.titleInput.val(), t = this.slugInput.val(), i = this.descriptionInput.val();
        return e ? t ? (this._super(), SLConfig.deck.title = e, SLConfig.deck.description = i ? i.replace(/\n/g, " ") : "", SLConfig.deck.slug = t, SLConfig.deck.rtl = this.rtlToggle.is(":checked"), SLConfig.deck.should_loop = this.loopToggle.is(":checked"), SLConfig.deck.comments_enabled = this.commentsEnabledToggle.is(":checked"), SLConfig.deck.forking_enabled = this.forkingEnabledToggle.is(":checked"), SLConfig.deck.share_notes = this.shareNotesToggle.is(":checked"), SLConfig.deck.slide_number = this.slideNumberToggle.is(":checked"), SLConfig.deck.auto_slide_interval = parseInt(this.autoSlideInput.val(), 10) || 0, SLConfig.deck.dirty = true, $("html").toggleClass("rtl", SLConfig.deck.rtl), true) : (SL.notify(SL.locale.get("DECK_EDIT_INVALID_SLUG"), "negative"), false) : (SL.notify(SL.locale.get("DECK_EDIT_INVALID_TITLE"), "negative"), false)
    }, updateSelection: function () {
        this.rtlToggle.prop("checked", this.config.deck.rtl), this.loopToggle.prop("checked", this.config.deck.should_loop), this.commentsEnabledToggle.prop("checked", this.config.deck.comments_enabled), this.forkingEnabledToggle.prop("checked", this.config.deck.forking_enabled), this.shareNotesToggle.prop("checked", this.config.deck.share_notes), this.slideNumberToggle.prop("checked", this.config.deck.slide_number)
    }, applySelection: function () {
        Reveal.configure({
            rtl: this.rtlToggle.is(":checked"),
            loop: this.loopToggle.is(":checked"),
            slideNumber: this.slideNumberToggle.is(":checked")
        })
    }, generateSlug: function () {
        if (this.deckIsPrivate() && this.slugIsUnchanged() || this.slugWasManuallyCleared) {
            var e = this.titleInput.val(), t = SL.util.string.slug(e);
            this.slugInput.val(t)
        }
    }, deckIsPrivate: function () {
        return SLConfig.deck.visibility === SL.models.Deck.VISIBILITY_SELF
    }, slugIsUnchanged: function () {
        return (SLConfig.deck.slug || "") === (SL.util.string.slug(SLConfig.deck.title) || "")
    }, onToggleChange: function () {
        this.applySelection()
    }, onTitleInput: function () {
        this.generateSlug()
    }, onDescriptionKeyPress: function (e) {
        return 13 == e.keyCode ? false : void 0
    }, onSlugInput: function () {
        this.slugWasManuallyCleared = "" === this.slugInput.val()
    }, onSlugFocus: function () {
        this.deckIsPrivate() || SL.tooltip.show("Changing the URL of your deck will break existing links to it.", {
            anchor: this.slugInput,
            alignment: "r",
            maxwidth: 220
        })
    }, onSlugBlur: function () {
        SL.tooltip.hide(), this.slugInput.val(SL.util.string.slug(this.slugInput.val()))
    }
});
Sidebar.Style = Sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .style"), this._super()
    }, bind: function () {
        this._super(), this.domElement.find(".edit-style").on("click", this.onAdvancedStylesCLicked.bind(this))
    }, scroll: function () {
        this.domElement.find(".panel-body").scrollTop(0), $(".page-wrapper").scrollTop(0)
    }, open: function () {
        this._super(), this.themeoptions ? this.themeoptions.populate(SL.models.Theme.fromDeck(SLConfig.deck)) : (this.themeoptions = new SL.components.ThemeOptions({
            center: false,
            rollingLinks: false,
            fonts: SL.config.THEME_FONTS,
            colors: SL.config.THEME_COLORS,
            themes: SL.current_user.getThemes(),
            model: SL.models.Theme.fromDeck(SLConfig.deck),
            container: this.domElement.find(".panel-body")
        }), this.themeoptions.changed.add(this.onThemeOptionsChanged.bind(this)), SL.fonts.loadAll()), this.scroll(), this.layout()
    }, close: function () {
        this._super()
    }, revert: function () {
        this._super(), SL.helpers.ThemeController.paint(SL.view.getCurrentTheme(), {center: false, js: false})
    }, save: function () {
        var e = SL.view.getCurrentTheme(), t = this.themeoptions.getTheme(), i = e.get("id") == t.get("id"), n = (e.get("js") || "") == (t.get("js") || "");
        return i || n ? (this._super(), this.saveData(), true) : (this.promptReload(), false)
    }, saveData: function () {
        var e = this.themeoptions.getTheme();
        SLConfig.deck.dirty = true, SLConfig.deck.theme_id = e.get("id"), SLConfig.deck.theme_font = e.get("font"), SLConfig.deck.theme_color = e.get("color"), SLConfig.deck.center = e.get("center"), SLConfig.deck.rolling_links = e.get("rolling_links"), SLConfig.deck.transition = e.get("transition"), SLConfig.deck.background_transition = e.get("background_transition"), Reveal.configure({
            center: false,
            rolling_links: SLConfig.deck.rolling_links,
            transition: SLConfig.deck.transition,
            backgroundTransition: SLConfig.deck.background_transition
        }), SL.editor.controllers.Thumbnail.invalidate(), SL.editor.controllers.Contrast.sync(), SL.view.onThemeChanged()
    }, promptReload: function () {
        SL.prompt({
            anchor: this.domElement.find(".save"),
            title: "The editor needs to reload to apply your changes.",
            alignment: "t",
            type: "select",
            data: [{html: "<h3>Cancel</h3>"}, {
                html: "<h3>Continue</h3>",
                className: "positive",
                callback: this.saveAndReload.bind(this)
            }]
        })
    }, saveAndReload: function () {
        this.saveData(), SL.view.save(function () {
            window.location.reload()
        }), SL.prompt({
            anchor: this.domElement.find(".save"),
            title: 'Saving and reloading...<div class="spinner centered-horizontally" data-spinner-color="#777"></div>',
            alignment: "t",
            optional: false,
            options: []
        }), SL.util.html.generateSpinners()
    }, onAdvancedStylesCLicked: function () {
        SL.editor.controllers.Mode.change("css")
    }, onThemeOptionsChanged: function () {
        this.layout(), SL.editor.controllers.Grid.refresh()
    }
});
