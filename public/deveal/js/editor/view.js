SL("editor").Editor = SL.views.Base.extend({
    init: function () {
        this._super();
        SL.editor.controllers.Capabilities.init();
        SLConfig.deck.theme_font = SLConfig.deck.theme_font || SL.config.DEFAULT_THEME_FONT;
        SLConfig.deck.theme_color = SLConfig.deck.theme_color || SL.config.DEFAULT_THEME_COLOR;
        SLConfig.deck.transition = SLConfig.deck.transition || SL.config.DEFAULT_THEME_TRANSITION;
        SLConfig.deck.background_transition = SLConfig.deck.background_transition || SL.config.DEFAULT_THEME_BACKGROUND_TRANSITION;
        SLConfig.deck.visibility = SLConfig.deck.visibility || SL.models.Deck.VISIBILITY_ALL;
        this.addHorizontalSlideButton = $(".add-horizontal-slide");
        this.addVerticalSlideButton = $(".add-vertical-slide");
        this.previewControlsExit = $(".preview-controls-exit");
        this.setupPromises = [], this.flags = {
            editing: true,
            saving: false,
            unsaved: false,
            newDeck: !SLConfig.deck.id
        };

        if (this.isNewDeck() && SL.current_user.hasDefaultTheme()) {
            SLConfig.deck.theme_id = SL.current_user.getDefaultTheme().get("id");
        }
        this.deckSaved = new signals.Signal;
        this.savedDeck = JSON.parse(JSON.stringify(SLConfig.deck));
        SL.helpers.PageLoader.show();
        var e = SL.current_user.getThemes().getByProperties({id: SLConfig.deck.theme_id});

        if (e) {
            if (SL.current_user.isMemberOfCurrentTeam()) {
                e.load().always(this.setup.bind(this))
            } else {
                e.load(SL.config.AJAX_DECK_THEME(SLConfig.deck.id)).always(this.setup.bind(this));
            }
        } else {
            this.setup();
        }
    },
    setup: function () {
        SL.fonts.isReady() === false && this.setupPromises.push(new Promise(function (e) {
            SL.fonts.ready.add(e)
        }));

        SL.keyboard.keydown(this.onDocumentKeyDown.bind(this));
        this.setupControllers();
        this.setupComponents();
        this.setupReveal();
        this.setupTheme();
        this.setupWYSIWYG();
        this.setupDefaultContent();
        this.setupActivityMonitor();
        this.preloadWYSIWYG();
        this.changeInterval = setInterval(this.checkChanges.bind(this), SL.config.UNSAVED_CHANGES_INTERVAL);
        this.saveInterval = setInterval(this.checkAutoSave.bind(this), SL.config.AUTOSAVE_INTERVAL);
        $("html").toggleClass("is-new", this.isNewDeck());
        $("html").toggleClass("rtl", SLConfig.deck.rtl);
        this.bind();
        this.enableEditing();
        this.setupCollaboration();
        this.layout();
        setTimeout(function () {
            SL.editor.controllers.DeckImport.init(this);
            SLConfig.deck.data = SL.editor.controllers.Serialize.getDeckAsString();
            this.firstSlideData = SL.editor.controllers.Serialize.getFirstSlideAsString();
            this.toolbars.sync();
        }.bind(this), 1);
        Promise.all(this.setupPromises).then(function () {
            SL.util.deck.afterSlidesChanged();
            SL.helpers.PageLoader.hide();
            $("html").addClass("editor-loaded-successfully");
        });
    },
    setupControllers: function () {
        SL.editor.controllers.Serialize.init(this);
        SL.editor.controllers.Contrast.init(this);
        SL.editor.controllers.Blocks.init(this);
        SL.editor.controllers.Media.init(this);
        SL.editor.controllers.History.init(this);
        SL.editor.controllers.Markup.init(this);
        SL.editor.controllers.Migration.init(this);
        SL.editor.controllers.Selection.init(this);
        SL.editor.controllers.Guides.init(this);
        SL.editor.controllers.Grid.init(this);
        SL.editor.controllers.URL.init(this);
        SL.editor.controllers.Mode.init(this, {
            css: new SL.editor.modes.CSS(this),
            arrange: new SL.editor.modes.Arrange(this),
            preview: new SL.editor.modes.Preview(this),
            fragment: new SL.editor.modes.Fragment(this)
        });
        SL.editor.controllers.Mode.modeActivated.add(function () {
            SL.editor.controllers.Blocks.blur()
        }.bind(this));
        SL.editor.controllers.Mode.modeDeactivated.add(function () {
            Reveal.configure({minScale: SL.editor.controllers.Capabilities.isTouchEditor() ? .4 : 1}), setTimeout(Reveal.layout, 1), this.layout(), SL.editor.controllers.Grid.refresh()
        }.bind(this));
        SL.session.enforce();
    },
    setupComponents: function () {
        this.sidebar = new SL.editor.components.Sidebar;
        this.toolbars = new SL.editor.components.Toolbars(this);
        this.colorpicker = new SL.editor.components.Colorpicker;
        this.slideOptions = new SL.editor.components.SlideOptions(this, {
            html: this.isDeveloperMode(),
            fragment: !SL.editor.controllers.Capabilities.isTouchEditorSmall()
        });
        this.slideOptions.syncRemoveSlide();
        this.templates = new SL.components.Templates;
    },
    setupCollaboration: function () {
        this.collaboration = new SL.components.collab.Collaboration({
            container: document.body,
            editor: true,
            coverPage: true
        }), SLConfig.deck.collaborative && (this.setupPromises.push(new Promise(function (e) {
            this.collaboration.loaded.add(e)
        }.bind(this))), this.collaboration.load())
    },
    setupReveal: function () {
        var e = {
            controls: true,
            progress: false,
            history: false,
            center: false,
            touch: false,
            fragments: false,
            help: false,
            pause: false,
            mouseWheel: false,
            rollingLinks: false,
            margin: .16,
            minScale: 1,
            maxScale: 1,
            keyboard: {27: null, 70: null},
            keyboardCondition: function () {
                return SL.editor.controllers.Mode.get("preview").isActive() || 0 === SL.editor.controllers.Blocks.getFocusedBlocks().length && !this.sidebar.isExpanded()
            }.bind(this),
            rtl: SLConfig.deck.rtl,
            loop: SLConfig.deck.should_loop,
            slideNumber: SLConfig.deck.slide_number,
            transition: SLConfig.deck.transition,
            backgroundTransition: SLConfig.deck.background_transition
        };
        SL.editor.controllers.Capabilities.isTouchEditor() && (e.margin = .05, e.minScale = .4), SL.editor.controllers.Capabilities.isTouchEditorSmall() && (e.margin = .12), Reveal.initialize(e), Reveal.addEventListener("ready", function () {
            this.addHorizontalSlideButton.addClass("show"), this.addVerticalSlideButton.addClass("show"), SL.editor.controllers.Blocks.sync(), SL.editor.controllers.Blocks.discoverBlockPairs()
        }.bind(this)), Reveal.addEventListener("slidechanged", function (e) {
            e.previousSlide && SL.editor.controllers.Blocks.blurBlocksBySlide(e.previousSlide), SL.editor.controllers.Blocks.sync(), SL.editor.controllers.Blocks.discoverBlockPairs(), this.checkOverflow()
        }.bind(this))
    },
    setupTheme: function () {
        var e = SL.current_user.getThemes().getByProperties({id: SLConfig.deck.theme_id});
        if (e) {
            SLConfig.deck.transition = e.get("transition"), SLConfig.deck.backgroundTransition = e.get("background_transition")
        } else {
            e = SL.models.Theme.fromDeck(SLConfig.deck);
        }
        SL.helpers.ThemeController.paint(e, {center: false});
        this.syncPageBackground();
    },
    setupWYSIWYG: function () {
        CKEDITOR.timestamp = "34505052016", CKEDITOR.on("dialogDefinition", function (e) {
            e.data.definition.resizable = CKEDITOR.DIALOG_RESIZE_NONE
        }), CKEDITOR.on("instanceReady", function (e) {
            e.editor.on("paste", function (e) {
                e.data && "html" === e.data.type && (e.data.dataValue = e.data.dataValue.replace(/(font\-size|line\-height):\s?\d+(px|em|pt|%)?;/gi, "")), SL.view.layout(), setTimeout(SL.view.layout.bind(SL.view), 1)
            }, null, null, 9)
        }), CKEDITOR.disableAutoInline = true, CKEDITOR.config.floatSpaceDockedOffsetY = 1, CKEDITOR.config.title = false
    },
    preloadWYSIWYG: function () {
        var e = $("<p>").hide().appendTo(document.body), t = CKEDITOR.inline(e.get(0));
        t && t.on("instanceReady", function () {
            t.destroy(), e.remove()
        }.bind(this))
    },
    setupDefaultContent: function () {
        this.isNewDeck() && SL.editor.controllers.Markup.replaceCurrentSlide(SL.data.templates.getNewDeckTemplate().get("html"))
    },
    setupActivityMonitor: function () {
        SL.activity.register(1e4, function () {
            this.isNewDeck() || this.hasShownOutdatedMessage || $.ajax({
                url: SL.config.AJAX_GET_DECK(SL.current_deck.get("id")),
                type: "GET",
                context: this
            }).done(function (e) {
                var t = SL.current_deck.get("data_updated_at"), i = e.data_updated_at, n = "number" == typeof t && !isNaN(t), r = "number" == typeof i && !isNaN(i);
                n && r && i > t && (SL.popup.openOne(SL.components.popup.DeckOutdated), this.hasShownOutdatedMessage = true)
            }.bind(this))
        }.bind(this))
    },
    bind: function () {
        $(window).on("keyup", this.onWindowKeyUp.bind(this));
        $(window).on("beforeunload", this.onWindowBeforeUnload.bind(this));
        $(window).on("resize", this.onWindowResize.bind(this));
        this.addHorizontalSlideButton.on("vclick", this.onAddHorizontalSlideClicked.bind(this));
        this.addVerticalSlideButton.on("vclick", this.onAddVerticalSlideClicked.bind(this));
        this.previewControlsExit.on("vclick", this.onExitPreviewClicked.bind(this));
        this.sidebar.saveClicked.add(this.save.bind(this));
        this.sidebar.previewClicked.add(this.onEnterPreviewClicked.bind(this));
        this.onUndoOrRedo = this.onUndoOrRedo.bind(this);
        this.onSaveTimeout = this.onSaveTimeout.bind(this);
        SL.editor.controllers.History.undid.add(this.onUndoOrRedo);
        SL.editor.controllers.History.redid.add(this.onUndoOrRedo);
    },
    layout: function () {
        var e = this.getSlideSize({scaled: true}), t = window.innerWidth - this.getSidebarWidth(), i = window.innerHeight, n = this.slideOptions.getWidth(), r = "r", o = {
            left: (t + e.width) / 2,
            top: (i - e.height) / 2,
            marginLeft: 0,
            marginTop: 0
        };
        if (this.collaboration) {
            var s = this.collaboration.getCollapsedWidth();
            o.left = Math.min(o.left, t - n - s), o.top = Math.max(o.top, 0), o.left + n < (t + e.width) / 2 && (o.left = (t - e.width) / 2 - n, o.left = Math.max(o.left, 10), r = "l")
        } else o.left = Math.min(o.left, t - n), o.top = Math.max(o.top, 0);
        o.left = Math.round(o.left), o.top = Math.round(o.top), this.slideOptions.domElement.css(o), this.slideOptions.setAlignment(r);
        var a = $(".reveal").get(0);
        (a && 0 !== a.scrollTop || 0 !== a.scrollLeft) && (a.scrollTop = 0, a.scrollLeft = 0)
    },
    checkChanges: function () {
        if (!this.isSaving()) {
            var e = SL.editor.controllers.Serialize.getDeckAsString();
            SL.pointer.isDown() || SL.editor.controllers.History.push(e);
            var t = e !== SLConfig.deck.data, i = SLConfig.deck.dirty;
            this.flags.unsaved = !(!t && !i), this.hasUnsavedChanges() ? this.sidebar.updateSaveButton("disabled", "Click to save") : this.sidebar.updateSaveButton("disabled is-saved", "Latest changes are saved")
        }
        this.checkOverflow()
    },
    checkAutoSave: function () {
        if (this.hasUnsavedChanges()) {
            if (!SL.editor.controllers.DeckImport.isImporting()) {
                this.save();
            }
        }
    },
    checkOverflow: function () {
        var e = 0, t = SL.editor.controllers.Blocks.getCombinedBounds(SL.editor.controllers.Blocks.getCurrentBlocks());
        t.y < -e || t.x < -e || t.right > SL.config.SLIDE_WIDTH + e || t.bottom > SL.config.SLIDE_HEIGHT + e ? (SL.editor.controllers.Markup.getCurrentSlide().addClass("overflowing"), this.slideOptions.showOverflowWarning()) : (SL.editor.controllers.Markup.getCurrentSlide().removeClass("overflowing"), this.slideOptions.hideOverflowWarning())
    },
    save: function (e) {
        this.isSaving();
        this.flags.saving = true;
        clearTimeout(this.saveTimeout);
        this.saveTimeout = setTimeout(this.onSaveTimeout, SL.config.DECK_SAVE_TIMEOUT);
        this.sidebar.updateSaveButton("disabled is-saving", "Saving changes");
        if (this.isNewDeck()) {
            this.createDeck(e)
        } else {
            this.updateDeck(e)
        }
    }, getSaveData: function (e) {
        var t = {
            deck: {
                title: SL.util.unescapeHTMLEntities((SLConfig.deck.title || "").substr(0, SL.config.DECK_TITLE_MAXLENGTH)),
                description: SL.util.unescapeHTMLEntities(SLConfig.deck.description),
                data: SL.util.string.trim(e),
                css_input: SLConfig.deck.css_input,
                css_output: SLConfig.deck.css_output,
                comments_enabled: SLConfig.deck.comments_enabled,
                forking_enabled: SLConfig.deck.forking_enabled,
                auto_slide_interval: SLConfig.deck.auto_slide_interval,
                transition: SLConfig.deck.transition,
                background_transition: SLConfig.deck.background_transition,
                theme_font: SLConfig.deck.theme_font,
                theme_color: SLConfig.deck.theme_color,
                should_loop: SLConfig.deck.should_loop,
                rtl: SLConfig.deck.rtl,
                share_notes: SLConfig.deck.share_notes,
                slide_number: SLConfig.deck.slide_number,
                notes: JSON.stringify(SLConfig.deck.notes),
                rolling_links: false,
                center: false
            }, version: SL.editor.Editor.VERSION
        };
        return SLConfig.deck.slug !== this.savedDeck.slug && (t.deck.custom_slug = SLConfig.deck.slug), SL.current_user.hasThemes() && (t.deck.theme_id = SLConfig.deck.theme_id), t
    },
    createDeck: function (e) {
        var t = SL.editor.controllers.Serialize.getDeckAsString();
        i = SLConfig.deck.title;
        if (!i) {
            var n = $(Reveal.getSlide(0)).find("h1").text().trim();
            if(n && /^(untitled|title\stext)$/gi.test(n) === false ){
                SLConfig.deck.title = n.substr(0, SL.config.DECK_TITLE_MAXLENGTH);
            }
        }
        var r = {
            type: "POST",
            url: SL.config.AJAX_CREATE_DECK(SLConfig.current_user.username),
            context: this,
            data: this.getSaveData(t)
        };

        $.ajax(r).done(function (deck) {
            $.extend(SLConfig.deck, deck);
            SLConfig.deck.data_updated_at = deck.data_updated_at;
            SLConfig.deck.data = deck;
            SLConfig.deck.dirty = false;
            $("html").removeClass("is-new");
            this.flags.newDeck = false;
            SL.editor.controllers.URL.write();
            SL.editor.controllers.Thumbnail.generate();
            this.onSaveSuccess(e, deck);
        }).fail(function (t) {
            this.onSaveError(e, t)
        }).always(function () {
            this.onSaveFinished(e)
        });
    },
    updateDeck: function (e) {
        var t = SL.editor.controllers.Serialize.getDeckAsString(), i = {
            type: "PUT",
            url: SL.config.AJAX_UPDATE_DECK(this.savedDeck ? this.savedDeck.id : SLConfig.deck.id),
            context: this,
            data: this.getSaveData(t)
        };
        $.ajax(i).done(function (i) {
            i && i.deck && (i.deck.slug && (SLConfig.deck.slug = i.deck.slug, SL.editor.controllers.URL.write()), SLConfig.deck.data_updated_at = i.deck.data_updated_at), SLConfig.deck.data = t, SLConfig.deck.dirty = false;
            var n = SL.editor.controllers.Serialize.getFirstSlideAsString();
            (this.firstSlideData !== n || SL.editor.controllers.Thumbnail.isInvalidated()) && (this.firstSlideData = n, SL.editor.controllers.Thumbnail.generate()), this.onSaveSuccess(e, i)
        }).fail(function (t) {
            this.onSaveError(e, t)
        }).always(function () {
            this.onSaveFinished(e)
        })
    },
    onSaveSuccess: function (e, deck) {
        this.savedDeck = JSON.parse(JSON.stringify(SLConfig.deck));

        if(deck){
            if(deck.deck){
                if(deck.deck.sanitize_messages){
                    if(deck.deck.sanitize_messages.length){
                        SL.notify(deck.deck.sanitize_messages[0], "negative");
                    }
                }
            }
        }

        if(this.unableToSaveWarning){
            this.unableToSaveWarning.hide();
        }

        if(e){
            e.apply(null, [true]);
        }
        this.deckSaved.dispatch();
    },
    onSaveError: function (e, t) {
        if(401 === t.status){
            SL.session.check();
        }

        this.unableToSaveWarning = new SL.components.RetryNotification(SL.locale.get("DECK_SAVE_ERROR"), {type: "negative"});
        this.unableToSaveWarning.destroyed.add(function () {
            this.unableToSaveWarning = null
        }.bind(this));
        this.unableToSaveWarning.retryClicked.add(function () {
            this.unableToSaveWarning.destroy();
            this.save();
        }.bind(this));

        if(this.hasUnsavedChanges()){
            this.unableToSaveWarning.startCountdown(SL.config.AUTOSAVE_INTERVAL);
        }
        if(e){
            e.apply(null, [false]);
        }
    },
    onSaveFinished: function () {
        this.flags.saving = false;
        clearTimeout(this.saveTimeout);
        this.checkChanges();
        $("html").addClass("editor-saved-successfully");
    },
    onSaveTimeout: function () {
        SLConfig.deck.dirty = true, this.flags.saving = false, clearTimeout(this.saveTimeout)
    }, hasSavedThisSession: function () {
        return $("html").hasClass("editor-saved-successfully")
    }, saveVisibility: function (e) {
        if (this.isNewDeck())return this.save(this.saveVisibility.bind(this, e)), false;
        var t = {
            type: "POST",
            url: SL.config.AJAX_PUBLISH_DECK(SLConfig.deck.id),
            context: this,
            data: {visibility: SLConfig.deck.visibility}
        };
        $.ajax(t).done(function (e) {
            $("html").attr("data-visibility", SLConfig.deck.visibility), e.deck.visibility === SL.models.Deck.VISIBILITY_SELF ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_SELF")) : e.deck.visibility === SL.models.Deck.VISIBILITY_TEAM ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_TEAM")) : e.deck.visibility === SL.models.Deck.VISIBILITY_ALL && SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ALL")), this.sidebar.updatePublishButton(), SLConfig.deck.data_updated_at = e.deck.data_updated_at
        }).fail(function () {
            this.sidebar.updatePublishButton(), SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ERROR"), "negative")
        })
    }, navigateToSlide: function (e) {
        if (e) {
            var t = Reveal.getIndices(e);
            setTimeout(function () {
                Reveal.slide(t.h, t.v)
            }, 1)
        }
    }, enableEditing: function () {
        this.flags.editing = true, $("html").addClass("is-editing")
    }, disableEditing: function () {
        this.flags.editing = false, $("html").removeClass("is-editing")
    }, redirect: function (e, t) {
        t === true && (this.flags.unsaved = false), window.location = e
    }, syncPageBackground: function () {
        $("html, body").css("background-color", SL.util.deck.getBackgroundColor())
    }, getCurrentTheme: function () {
        var e = SL.current_user.getThemes().getByProperties({id: SLConfig.deck.theme_id});
        return e || (e = SL.models.Theme.fromDeck(SLConfig.deck)), e
    }, getSlideSize: function (e) {
        var t = Reveal.getConfig(), i = 1;
        return e && e.scaled && (i = Reveal.getScale()), {width: t.width * i, height: t.height * i}
    }, getSidebarWidth: function () {
        var e = 70, t = 170;
        return e + t
    }, isDeveloperMode: function () {
        return SL.current_user.settings.get("developer_mode") && !SL.editor.controllers.Capabilities.isTouchEditor()
    }, isEditing: function () {
        return this.flags.editing
    }, isSaving: function () {
        return this.flags.saving
    }, isNewDeck: function () {
        return this.flags.newDeck
    }, hasUnsavedChanges: function () {
        return this.flags.unsaved
    }, onThemeChanged: function () {
        this.toolbars.sync(), this.slideOptions.syncCustomClasses(), this.syncPageBackground()
    }, onUserInput: function () {
        clearInterval(this.saveInterval), this.saveInterval = setInterval(this.checkAutoSave.bind(this), SL.config.AUTOSAVE_INTERVAL)
    }, onAddHorizontalSlideClicked: function (e) {
        e.preventDefault(), e.shiftKey ? SL.editor.controllers.Markup.addHorizontalSlide() : this.templates.show({
            anchor: this.addHorizontalSlideButton, alignment: SLConfig.deck.rtl ? "l" : "r", callback: function (e) {

                SL.editor.controllers.Markup.addHorizontalSlide(e)
            }
        })
    }, onAddVerticalSlideClicked: function (e) {
        e.preventDefault(), e.shiftKey ? SL.editor.controllers.Markup.addVerticalSlide() : this.templates.show({
            anchor: this.addVerticalSlideButton,
            alignment: "b",
            callback: function (e) {
                SL.editor.controllers.Markup.addVerticalSlide(e)
            }
        })
    }, onEnterPreviewClicked: function () {
        SL.editor.controllers.Mode.change("preview")
    }, onExitPreviewClicked: function (e) {
        e.preventDefault(), SL.editor.controllers.Mode.clear()
    }, onWindowKeyUp: function () {
        this.onUserInput()
    }, onDocumentKeyDown: function (e) {
        if (27 === e.keyCode) {
            var t = $("input:focus, textarea:focus, [contenteditable]:focus"), i = $(Reveal.getCurrentSlide()), n = SL.editor.controllers.Mode.get();
            if (n && n.isActive() && "css" === n.getID())return false;
            if (SL.popup.isOpen())return false;
            t && t.length ? t.blur() : this.sidebar.isExpanded() ? this.sidebar.close() : this.colorpicker.isVisible() ? this.colorpicker.hide() : this.slideOptions.hasOpenPanel() ? this.slideOptions.collapse() : this.toolbars.hasOpenPanel() ? this.toolbars.collapse() : SL.editor.controllers.Blocks.getFocusedBlocks().length ? SL.editor.controllers.Blocks.blur() : n && n.isActive() && /(absolute|fragment|preview)/gi.test(n.getID()) ? (n.deactivate(), /(absolute|fragment)/gi.test(n.getID()) && i.focus()) : Reveal.toggleOverview()
        } else {
            if (SL.util.isTypingEvent(e))return true;
            var r = this.sidebar.isExpanded(), o = e.metaKey || e.ctrlKey;
            8 === e.keyCode ? e.preventDefault() : o && 83 === e.keyCode ? (this.hasUnsavedChanges() && this.save(), e.preventDefault()) : !r && o && 89 === e.keyCode ? (SL.editor.controllers.History.redo(), e.preventDefault()) : !r && o && e.shiftKey && 90 === e.keyCode ? (SL.editor.controllers.History.redo(), e.preventDefault()) : !r && o && 90 === e.keyCode ? (SL.editor.controllers.History.undo(), e.preventDefault()) : r || !o || e.shiftKey || 70 !== e.keyCode ? !r && e.shiftKey && e.altKey && 70 === e.keyCode ? (SL.editor.controllers.Mode.toggle("fragment"), e.preventDefault()) : !r && e.shiftKey && e.altKey && 78 === e.keyCode ? (this.slideOptions.triggerNotes(), e.preventDefault()) : !r && e.shiftKey && e.altKey && 72 === e.keyCode && (this.slideOptions.triggerHTML(), e.preventDefault()) : (SL.editor.controllers.Mode.toggle("preview"), e.preventDefault())
        }
        return true
    }, onWindowBeforeUnload: function () {
        return this.hasUnsavedChanges() ? SL.locale.get("LEAVE_UNSAVED_DECK") : void 0
    }, onWindowResize: function () {
        Reveal.layout(), this.layout()
    }, onUndoOrRedo: function (e) {
        SL.util.skipCSSTransitions($("html"), 100), SL.editor.controllers.Mode.clear(), SL.editor.controllers.Blocks.blur(), $(".reveal .slides").html(e.data), Reveal.sync(), Reveal.slide(e.indices.h, e.indices.v), this.slideOptions.syncRemoveSlide(), SL.editor.controllers.Blocks.sync();
        var t = SL.editor.controllers.Mode.get(e.mode);
        t ? t.activate() : e.focusedBlocks && e.focusedBlocks.length && SL.editor.controllers.Blocks.getCurrentBlocks().forEach(function (t) {
            e.focusedBlocks.forEach(function (e) {
                t.getID() === e && SL.editor.controllers.Blocks.focus(t, true)
            })
        })
    }
});
SL.editor.Editor.VERSION = 2;