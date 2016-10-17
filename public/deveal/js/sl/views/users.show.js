SL("views.users").Show = SL.views.Base.extend({
    init: function () {
        this._super();
        SL.util.device.IS_PHONE && $("html").addClass("is-mobile-phone");
        this.setupTabs();
        this.setupFilters();
        this.setupDecks();
        this.restoreFilters();
        $(".decks .deck .ladda-button").each(function (t, e) {
            $(e).data("ladda", Ladda.create(e))
        });
        $(window).on("scroll", this.onWindowScroll.bind(this));
    },
    setupTabs: function () {
        $(".deck-filters-tab").on("vclick", function (t) {
            this.selectTab($(t.currentTarget).attr("data-tab-id"));
        }.bind(this));
        this.tabValueDefault = $(".deck-filters-tab").first().attr("data-tab-id");
    },
    setupFilters: function () {
        this.onSortOptionSelected = this.onSortOptionSelected.bind(this);
        this.sortDecks = this.sortDecks.bind(this);
        this.searchDecks = $.throttle(this.searchDecks.bind(this), 300);
        this.saveFilters = $.throttle(this.saveFilters.bind(this), 1e3);
        this.setupSortOptions();
        $(".deck-filters-sort").on("vclick", function (t) {
            return this.sortOptions.forEach(function (t) {
                t.selected = t.value === this.sortValue
            }.bind(this)), SL.prompt({
                anchor: $(t.currentTarget),
                title: "Sort decks",
                type: "list",
                alignment: "b",
                data: this.sortOptions,
                multiselect: false,
                optional: true
            }), false
        }.bind(this));
        $(".deck-filters-search").on("vclick", function (t) {
            $(this).focus();
            t.preventDefault();
        });
        $(".deck-filters-search").on("input", function (t) {
            this.searchDecks($(t.currentTarget).val());
        }.bind(this));
        $(".deck-filters-search-clear").on("vclick", function (t) {
            this.searchDecks("");
            $(".deck-filters-search").val("");
            t.preventDefault();
        }.bind(this));
    },
    setupSortOptions: function () {
        this.sortOptions = [], this.sortOptions.push({
            value: "created",
            title: "Newest first",
            callback: this.onSortOptionSelected,
            method: function (t, e) {
                return moment(this.getDeckData(e).created_at).unix() - moment(this.getDeckData(t).created_at).unix()
            }.bind(this)
        });
        this.sortOptions.push({
            value: "created-reverse",
            title: "Oldest first",
            callback: this.onSortOptionSelected,
            method: function (t, e) {
                return moment(this.getDeckData(t).created_at).unix() - moment(this.getDeckData(e).created_at).unix()
            }.bind(this)
        });
        if ($('.deck[data-visibility="all"]').length) {
            this.sortOptions.push({
                value: "views",
                title: "Most views",
                callback: this.onSortOptionSelected,
                method: function (t, e) {
                    var i = this.getDeckData(t), n = this.getDeckData(e), s = i.visibility === SL.models.Deck.VISIBILITY_ALL ? i.view_count : -1, o = n.visibility === SL.models.Deck.VISIBILITY_ALL ? n.view_count : -1;
                    return o - s
                }.bind(this)
            });
        }

        this.sortOptions.push({
            value: "az",
            title: "Alphabetically",
            callback: this.onSortOptionSelected,
            method: function (t, e) {
                return t = this.getDeckData(t).title.trim().toLowerCase();
                e = this.getDeckData(e).title.trim().toLowerCase();
                e > t ? -1 : t > e ? 1 : 0
            }.bind(this)
        });
        this.sortValueDefault = this.sortOptions[0].value;
        this.sortValue = this.sortValueDefault;
    },
    setupDecks: function () {
        $(".decks .deck").each(function (t, e) {
            e = $(e);
            e.find(".edit").on("vclick", this.onEditClicked.bind(this, e));
            e.find(".share").on("vclick", this.onShareClicked.bind(this, e));
            e.find(".fork").on("vclick", this.onForkClicked.bind(this, e));
            e.find(".clone").on("vclick", this.onCloneClicked.bind(this, e));
            e.find(".delete").on("vclick", this.onDeleteClicked.bind(this, e));
            e.find(".deck-lock-icon").on("vclick", this.onVisibilityClicked.bind(this, e));
            e.find(".visibility").on("vclick", this.onVisibilityClicked.bind(this, e));
            if (e.hasClass("is-owner")) {
                e.find(".deck-title-value").attr({
                    "data-tooltip": "Click to edit",
                    "data-tooltip-alignment": "l",
                    "data-tooltip-delay": 200
                });
                e.find(".deck-title-value").on("click", this.onDeckTitleClicked.bind(this, e));
                e.find(".deck-description-value").attr({
                    "data-tooltip": "Click to edit",
                    "data-tooltip-alignment": "l",
                    "data-tooltip-delay": 200
                });
                e.find(".deck-description-value").on("click", this.onDeckDescriptionClicked.bind(this, e));
            }

        }.bind(this));
        this.loadImagesInView();
        this.loadImagesInView = $.throttle(this.loadImagesInView, 200);
    }, loadImagesInView: function () {
        var t = 300, e = -t, i = window.innerHeight + t;
        $(".decks .deck [data-image-url]").each(function (t, n) {
            var s = n.getBoundingClientRect();
            s.bottom > e && s.top < i && (n.style.backgroundImage = 'url("' + n.getAttribute("data-image-url") + '")', n.removeAttribute("data-image-url"))
        }.bind(this))
    }, flashDecks: function () {
        clearTimeout(this.flashDecksTimeout), $(".decks").addClass("flash"), this.flashDecksTimeout = setTimeout(function () {
            $(".decks").removeClass("flash")
        }, 1e3)
    }, selectTab: function (t) {
        $(".deck-filters-tab").removeClass("selected"), $(".deck-filters-tab[data-tab-id=" + t + "]").addClass("selected"), $(".decks").removeClass("visible"), $(".decks[data-tab-id=" + t + "]").addClass("visible"), this.tabValue = t, this.saveFilters()
    }, sortDecks: function (t) {
        var e = this.getSortOptionByValue(t);
        e && (this.sortValue = t, $(".deck-filters-sort").text(e.title), $(".decks").each(function () {
            var t = $(this).find(".deck");
            t.sort(e.method), t.detach().appendTo(this)
        }), this.saveFilters(), this.loadImagesInView(), this.flashDecks())
    }, searchDecks: function (t) {
        if ($(".deck-placeholder").remove(), $(".decks").unhighlight(), t = (t || "").trim(), "" === t)$(".decks .deck").removeClass("hidden"); else {
            var e = new RegExp(t, "i");
            $(".decks .deck").each(function (i, n) {
                n = $(n);
                var s = n.find(".deck-title-value").text(), o = n.find(".deck-description-value").text();
                n.toggleClass("hidden", !e.test(s) && !e.test(o)), t.length > 1 && n.find(".deck-title-value, .deck-description-value").highlight(t)
            }.bind(this)), $(".decks").each(function () {
                if (0 === $(this).find(".deck:not(.hidden)").length) {
                    var e = $('<div class="deck-placeholder"><p></p></div>');
                    e.find("p").text('No results matching "' + t + '"'), e.appendTo(this)
                }
            })
        }
        this.searchValue = t, this.saveFilters(), this.loadImagesInView()
    }, saveFilters: function () {
        if (Modernizr.history) {
            var t = [];
            this.sortValue !== this.sortValueDefault && t.push("sort=" + escape(this.sortValue)), this.searchValue && "" !== this.searchValue && t.push("search=" + escape(this.searchValue)), this.tabValue && "" !== this.tabValue && this.tabValue !== this.tabValueDefault && t.push("tab=" + escape(this.tabValue)), t.length ? window.history.replaceState(null, null, window.location.pathname + "?" + t.join("&")) : window.history.replaceState(null, null, window.location.pathname)
        }
    }, restoreFilters: function () {
        var t = SL.util.getQuery();
        t.search && ($(".deck-filters-search").val(t.search), this.searchDecks(t.search)), t.sort && this.sortDecks(t.sort), t.tab && this.selectTab(t.tab)
    }, getSortOptionByValue: function (t) {
        return this.sortOptions.filter(function (e) {
            return e.value === t
        }).shift()
    }, getDeckData: function (t) {
        return t = $(t), {
            user: {
                id: parseInt(t.attr("data-user-id"), 10),
                username: t.attr("data-username")
            },
            id: t.attr("data-id"),
            slug: t.attr("data-slug"),
            title: t.find(".deck-title-value").text(),
            view_count: t.attr("data-view-count") || 0,
            created_at: t.attr("data-created-at"),
            updated_at: t.attr("data-updated-at"),
            visibility: t.attr("data-visibility")
        }
    }, saveVisibility: function (t, e) {
        var i = this.getDeckData(t), n = {
            type: "POST",
            url: SL.config.AJAX_PUBLISH_DECK(i.id),
            context: this,
            data: {visibility: e}
        }, s = t.find(".visibility").data("ladda");
        s && s.start(), $.ajax(n).done(function (e) {
            e.deck.visibility === SL.models.Deck.VISIBILITY_SELF ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_SELF")) : e.deck.visibility === SL.models.Deck.VISIBILITY_TEAM ? SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_TEAM")) : e.deck.visibility === SL.models.Deck.VISIBILITY_ALL && SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ALL")), "string" == typeof e.deck.slug && t.attr("data-slug", e.deck.slug), "string" == typeof e.deck.visibility && t.attr("data-visibility", e.deck.visibility)
        }).fail(function () {
            SL.notify(SL.locale.get("DECK_VISIBILITY_CHANGED_ERROR"), "negative")
        }).always(function () {
            s && s.stop(), t.removeClass("hover")
        })
    }, cloneDeck: function (t, e) {
        var i = this.getDeckData(t);
        t.addClass("hover");
        var n = t.find(".clone.ladda-button").data("ladda");
        n && n.start(), $.ajax({
            type: "POST",
            url: SL.config.AJAX_FORK_DECK(i.id),
            context: this
        }).done(function () {
            SL.util.callback(e)
        }).fail(function () {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), n && n.stop(), t.removeClass("hover")
        })
    }, onEditClicked: function (t, e) {
        e.preventDefault(), window.location = t.attr("data-url") + "/edit"
    }, 
    onDeleteClicked: function (t, e) {
        e.preventDefault();
        t.addClass("hover");
        var i = this.getDeckData(t);
        n = SL.prompt({
            anchor: $(e.currentTarget),
            title: SL.locale.get("DECK_DELETE_CONFIRM", {title: SL.util.escapeHTMLEntities(i.title)}),
            type: "select",
            data: [{
                html: "<h3>Cancel</h3>", callback: function () {
                    t.removeClass("hover")
                }.bind(this)
            }, {
                html: "<h3>Delete</h3>",
                selected: true,
                className: "negative",
                callback: function () {
                    t.find(".deck-metadata .status").text("Deleting...");
                    var e = t.find(".delete.ladda-button").data("ladda");
                    e && e.start(), $.ajax({
                        type: "DELETE",
                        url: SL.config.AJAX_UPDATE_DECK(i.id),
                        data: {},
                        context: this
                    }).done(function () {
                        SL.util.anim.collapseListItem(t, function () {
                            e && e.stop(), t.remove()
                        }.bind(this)), SL.notify(SL.locale.get("DECK_DELETE_SUCCESS"))
                    }).fail(function () {
                        SL.notify(SL.locale.get("DECK_DELETE_ERROR"), "negative"), e && e.stop()
                    }).always(function () {
                        t.removeClass("hover")
                    })
                }.bind(this)
            }]
        });
        n.canceled.add(function () {
            t.removeClass("hover")
        });
    }, 
    onVisibilityClicked: function (t, e) {
        e.preventDefault(), t.addClass("hover");
        var i = this.getDeckData(t), n = [];
        n.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_SELF"),
            selected: i.visibility === SL.models.Deck.VISIBILITY_SELF,
            callback: function () {
                this.saveVisibility(t, SL.models.Deck.VISIBILITY_SELF);
            }.bind(this)
        }), SL.current_user.isEnterprise() && n.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_TEAM"),
            selected: i.visibility === SL.models.Deck.VISIBILITY_TEAM,
            className: "divider",
            callback: function () {
                this.saveVisibility(t, SL.models.Deck.VISIBILITY_TEAM);
            }.bind(this)
        }), n.push({
            html: SL.locale.get("DECK_VISIBILITY_CHANGE_ALL"),
            selected: i.visibility === SL.models.Deck.VISIBILITY_ALL,
            callback: function () {
                this.saveVisibility(t, SL.models.Deck.VISIBILITY_ALL);
            }.bind(this)
        });
        var s = SL.prompt({
            anchor: $(e.currentTarget),
            type: "select",
            className: "sl-visibility-prompt",
            data: n
        });
        s.canceled.add(function () {
            t.removeClass("hover")
        })
    }, onShareClicked: function (t, e) {
        e.preventDefault();
        var i = this.getDeckData(t);
        return "string" != typeof i.user.username || "string" != typeof i.slug && "string" != typeof i.id ? SL.notify(SL.locale.get("GENERIC_ERROR"), "negative") : SL.popup.open(SL.components.decksharer.DeckSharer, {deck: new SL.models.Deck(i)}), false
    }, onCloneClicked: function (t, e) {
        return e.preventDefault(), this.cloneDeck(t, function () {
            window.location.reload()
        }), false
    }, onForkClicked: function (t, e) {
        return e.preventDefault(), this.cloneDeck(t, function () {
            window.location = SL.current_user.getProfileURL()
        }), false
    }, onDeckTitleClicked: function (t) {
        var e = t.find(".deck-title-value"), i = SL.prompt({
            anchor: e,
            title: "Edit deck title",
            type: "input",
            confirmLabel: "Save",
            data: {
                value: e.text(),
                placeholder: "Deck title...",
                maxlength: SL.config.DECK_TITLE_MAXLENGTH,
                width: 400,
                confirmBeforeDiscard: true
            }
        });
        return i.confirmed.add(function (i) {
            i && "" !== i.trim() ? (e.text(i), $.ajax({
                url: SL.config.AJAX_UPDATE_DECK(this.getDeckData(t).id),
                type: "PUT",
                context: this,
                data: {deck: {title: i}}
            }).fail(function () {
                SL.notify("An error occured while saving your deck title", "negative")
            })) : SL.notify("Title can't be empty", "negative")
        }.bind(this)), false
    }, onDeckDescriptionClicked: function (t) {
        var e = t.find(".deck-description-value"), i = SL.prompt({
            anchor: e,
            title: "Edit deck description",
            type: "input",
            confirmLabel: "Save",
            data: {
                value: e.text(),
                placeholder: "A short description of this deck...",
                multiline: true,
                confirmBeforeDiscard: true
            }
        });
        return i.confirmed.add(function (i) {
            e.text(i), $.ajax({
                url: SL.config.AJAX_UPDATE_DECK(this.getDeckData(t).id),
                type: "PUT",
                context: this,
                data: {deck: {description: i}}
            }).fail(function () {
                SL.notify("An error occured while saving your deck description", "negative")
            })
        }.bind(this)), false
    }, onWindowScroll: function () {
        this.loadImagesInView()
    }, onSortOptionSelected: function (t) {
        this.sortDecks(t);
    }
});