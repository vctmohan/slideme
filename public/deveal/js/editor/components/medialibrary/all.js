SL("editor.components.medialibrary").Filters = Class.extend({
    init: function (e, t, i) {
        this.options = $.extend({editable: true}, i), this.media = e, this.media.changed.add(this.onMediaChanged.bind(this)), this.tags = t, this.tags.changed.add(this.onTagsChanged.bind(this)), this.tags.associationChanged.add(this.onTagAssociationChanged.bind(this)), this.filterChanged = new signals.Signal, this.onSearchInput = $.throttle(this.onSearchInput, 300), this.render(), this.recount(), this.selectDefaultFilter(true)
    }, render: function () {
        this.domElement = $('<div class="media-library-filters">'), this.domElement.toggleClass("editable", this.options.editable), this.innerElement = $('<div class="media-library-filters-inner">').appendTo(this.domElement), this.scrollElement = this.innerElement, this.renderSearch(), this.renderTypes(), this.renderTags()
    }, renderTypes: function () {
        this.renderType(SL.models.Media.IMAGE.id, function () {
            return true
        }, "All Images", "All Images")
    }, renderType: function (e, t, i, n) {
        var r = $(['<div class="media-library-filter media-library-type-filter">', '<span class="label">' + i + "</span>", '<span class="count"></span>', "</div>"].join(""));
        return r.attr({
            "data-id": e,
            "data-label": i,
            "data-exclusive-label": n
        }), r.on("vclick", this.onFilterClicked.bind(this)), r.data("filter", t), r.appendTo(this.innerElement), r
    }, renderTags: function () {
        this.tagsElement = $(['<div class="media-library-tags media-drop-area">', '<div class="tags-list"></div>', "</div>"].join("")), this.tagsElement.appendTo(this.innerElement), this.tagsList = this.tagsElement.find(".tags-list"), this.options.editable && (this.tagsElement.append(['<div class="tags-create">', '<div class="tags-create-inner ladda-button" data-style="expand-right" data-spinner-color="#666" data-spinner-size="28">New tag</div>', "</div>"].join("")), this.tagsElement.find(".tags-create").on("vclick", this.onCreateTagClicked.bind(this)), this.tagsCreateLoader = Ladda.create(this.tagsElement.find(".tags-create-inner").get(0))), this.tags.forEach(this.renderTag.bind(this)), this.sortTags()
    }, renderTag: function (e) {
        var t = $(['<div class="media-library-filter media-drop-target" data-id="' + e.get("id") + '">', '<div class="front">', '<span class="label-output">' + e.get("name") + "</span>", '<div class="controls-out">', '<span class="count"></span>', "</div>", "</div>", "</div>", "</div>"].join(""));
        return t.on("vclick", this.onTagClicked.bind(this)), t.data({
            model: e,
            filter: e.createFilter()
        }), this.options.editable ? (t.find(".front").append(['<div class="controls-over">', '<span class="controls-button edit-button">Edit</span>', "</div>"].join("")), t.append(['<div class="back">', '<input class="label-input" value="' + e.get("name") + '" type="text">', '<div class="controls">', '<span class="controls-button delete-button negative icon i-trash-stroke"></span>', '<span class="controls-button save-button">Save</span>', "</div>", "</div>"].join("")), t.data("dropReceiver", function (t) {
            this.tags.addTagTo(e, t)
        }.bind(this))) : t.find(".controls-out").removeClass("controls-out").addClass("controls-permanent"), t.appendTo(this.tagsList), t
    }, renderSearch: function () {
        this.searchElement = $(['<div class="media-library-filter media-library-search-filter" data-id="search">', '<input class="search-input" type="text" placeholder="Search..." maxlength="50" />', "</div>"].join("")), this.searchElement.on("vclick", this.onSearchClicked.bind(this)), this.searchElement.data("filter", function () {
            return false
        }), this.searchElement.appendTo(this.innerElement), this.searchInput = this.searchElement.find(".search-input"), this.searchInput.on("input", this.onSearchInput.bind(this))
    }, recount: function (e) {
        e = e || this.domElement.find(".media-library-filter"), e.each(function (e, t) {
            var i = $(t), n = i.find(".count");
            n.length && n.text(this.media.filter(i.data("filter")).length)
        }.bind(this))
    }, appendTo: function (e) {
        this.domElement.appendTo(e)
    }, selectFilter: function (e, t) {
        var i = this.domElement.find('.media-library-filter[data-id="' + e + '"]');
        this.domElement.find(".is-selected").removeClass("is-selected"), i.addClass("is-selected"), this.selectedFilter = i.data("filter"), this.selectedFilterData = {}, i.closest(this.tagsList).length ? (this.selectedFilterData.type = SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG, this.selectedFilterData.tag = i.data("model"), this.selectedFilterData.placeholder = "No media has been added to this tag", this.options.editable && (this.selectedFilterData.placeholder = "This tag is empty. To add media, drag and drop it onto the tag in the sidebar.")) : (this.selectedFilterData.type = SL.editor.components.medialibrary.Filters.FILTER_TYPE_MEDIA, this.selectedFilterData.placeholder = "There is no media of this type"), t || this.filterChanged.dispatch(this.selectedFilter, this.selectedFilterData)
    }, selectDefaultFilter: function (e) {
        this.selectFilter(this.domElement.find(".media-library-filter:not(.media-library-search-filter)").first().attr("data-id"), e)
    }, showAllTypes: function () {
        this.domElement.find(".media-library-type-filter").each(function () {
            var e = $(this);
            e.css("display", ""), e.find(".label").text(e.attr("data-label"))
        })
    }, hideAllTypesExcept: function (e) {
        this.domElement.find(".media-library-type-filter").each(function () {
            var t = $(this);
            t.attr("data-id") === e ? (t.css("display", ""), t.find(".label").text(t.attr("data-exclusive-label"))) : (t.css("display", "none"), t.find(".label").text(t.attr("data-label")))
        })
    }, startEditingTag: function (e, t) {
        if (this.tagsList.find(".is-editing").length)return false;
        var i = (e.data("model"), e.find(".label-input"));
        this.domElement.addClass("is-editing"), t === true && (e.addClass("collapsed"), e.find(".label-output").empty(), setTimeout(function () {
            e.removeClass("collapsed")
        }, 1), this.scrollElement.animate({scrollTop: e.prop("offsetTop") + 80 - this.scrollElement.height()}, 300)), e.addClass("is-editing");
        var n = this.scrollElement.prop("scrollTop");
        i.focus().select(), this.scrollElement.prop("scrollTop", n), i.on("keydown", function (t) {
            13 === t.keyCode && (t.preventDefault(), this.stopEditingTag(e))
        }.bind(this))
    }, stopEditingTag: function (e, t) {
        var i = e.data("model"), n = e.find(".label-input"), r = e.find(".label-output");
        this.domElement.removeClass("is-editing");
        var o = n.val();
        o && !t && (i.set("name", o), i.save(["name"])), r.text(i.get("name")), n.off("keydown"), setTimeout(function () {
            e.removeClass("is-editing")
        }, 1)
    }, sortTags: function () {
        var e = this.tagsList.find(".media-library-filter").toArray();
        e.sort(function (e, t) {
            return e = $(e).data("model").get("name").toLowerCase(), t = $(t).data("model").get("name").toLowerCase(), t > e ? -1 : e > t ? 1 : 0
        }), e.forEach(function (e) {
            $(e).appendTo(this.tagsList)
        }.bind(this))
    }, getTagElementByID: function (e) {
        return this.tagsList.find('.media-library-filter[data-id="' + e + '"]')
    }, confirmTagRemoval: function (e) {
        var t = e.data("model");
        SL.prompt({
            anchor: e.find(".delete-button"),
            title: SL.locale.get("MEDIA_TAG_DELETE_CONFIRM"),
            type: "select",
            data: [{html: "<h3>Cancel</h3>"}, {
                html: "<h3>Delete</h3>",
                selected: true,
                className: "negative",
                callback: function () {
                    t.destroy().done(function () {
                        this.domElement.removeClass("is-editing"), this.tags.remove(t), SL.notify(SL.locale.get("MEDIA_TAG_DELETE_SUCCESS"))
                    }.bind(this)).fail(function () {
                        SL.notify(SL.locale.get("MEDIA_TAG_DELETE_ERROR"), "negative")
                    }.bind(this))
                }.bind(this)
            }]
        })
    }, getSelectedFilterData: function () {
        return this.selectedFilterData
    }, destroy: function () {
        this.filterChanged.dispose(), this.domElement.remove()
    }, onMediaChanged: function () {
        this.recount()
    }, onTagsChanged: function (e, t) {
        e && e.length && e.forEach(function (e) {
            this.startEditingTag(this.renderTag(e), true)
        }.bind(this)), t && t.length && t.forEach(function (e) {
            var t = this.tagsElement.find('[data-id="' + e.get("id") + '"]');
            this.stopEditingTag(t, true), t.css({height: 0, padding: 0, opacity: 0}), setTimeout(function () {
                t.remove()
            }, 300), t.hasClass("is-selected") && this.selectDefaultFilter()
        }.bind(this))
    }, onTagAssociationChanged: function (e) {
        this.recount(this.getTagElementByID(e.get("id")))
    }, onFilterClicked: function (e) {
        this.selectFilter($(e.currentTarget).attr("data-id"))
    }, onCreateTagClicked: function () {
        this.tagsCreateLoader.start(), this.tags.create().then(function (e) {
            this.recount(this.getTagElementByID(e.get("id"))), this.tagsCreateLoader.stop()
        }.bind(this), function () {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), this.tagsCreateLoader.stop()
        }.bind(this))
    }, onTagClicked: function (e) {
        var t = $(e.target), i = t.closest(".media-library-filter");
        i.length && (t.closest(".edit-button").length ? this.startEditingTag(i) : t.closest(".save-button").length ? this.stopEditingTag(i) : t.closest(".delete-button").length ? this.confirmTagRemoval(i) : i.hasClass("is-editing") || this.onFilterClicked(e))
    }, onSearchClicked: function () {
        this.selectFilter(this.searchElement.attr("data-id"), true), this.searchInput.focus(), this.onSearchInput()
    }, onSearchInput: function () {
        var e = this.searchInput.val();
        this.selectedFilter = this.media.createSearchFilter(e), this.selectedFilterData = {
            type: SL.editor.components.medialibrary.Filters.FILTER_TYPE_SEARCH,
            placeholder: "Please enter a search term"
        }, this.searchElement.data("filter", this.selectedFilter), e.length > 0 && (this.selectedFilterData.placeholder = 'No results for "' + e + '"'), this.filterChanged.dispatch(this.selectedFilter, this.selectedFilterData)
    }
});

SL.editor.components.medialibrary.Filters.FILTER_TYPE_MEDIA = "media";
    SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG = "tag";
    SL.editor.components.medialibrary.Filters.FILTER_TYPE_SEARCH = "search";
    
SL("editor.components.medialibrary").ListDrag = Class.extend({
        init: function () {
            this.items = [], this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this)
        }, reset: function () {
            this.items = [], this.ghostElement && this.ghostElement.remove(), this.currentDropTarget = null, $(".media-drop-target").removeClass("drag-over"), $(".media-drop-area").removeClass("media-drop-area-active"), $(document).off("vmousemove", this.onMouseMove), $(document).off("vmouseup", this.onMouseUp)
        }, startDrag: function (e, t, i) {
            this.items = i;
            var n = t.offset();
            this.ghostOffset = {
                x: n.left - e.clientX,
                y: n.top - e.clientY
            }, this.ghostWidth = t.width(), this.ghostHeight = t.height(), this.ghostElement = $('<div class="media-library-drag-ghost">'), this.ghostElement.css({
                border: t.css("border"),
                backgroundImage: t.css("background-image"),
                backgroundSize: t.css("background-size"),
                backgroundPosition: t.css("background-position"),
                width: this.ghostWidth,
                height: this.ghostHeight,
                marginLeft: this.ghostOffset.x,
                marginTop: this.ghostOffset.y
            }), this.ghostElement.appendTo(document.body), i.length > 1 && (this.ghostElement.append('<span class="count">' + i.length + "</span>"), this.ghostElement.attr("data-depth", Math.min(i.length, 3))), this.dropTargets = $(".media-drop-target"), $(".media-drop-area").addClass("media-drop-area-active"), $(document).on("vmousemove", this.onMouseMove), $(document).on("vmouseup", this.onMouseUp)
        }, stopDrag: function () {
            this.reset()
        }, onMouseMove: function (e) {
            e.preventDefault();
            var t = e.clientX, i = e.clientY, n = "translate(" + t + "px," + i + "px)";
            this.ghostElement.css({
                webkitTransform: n,
                transform: n
            }), this.currentDropTarget = null, this.dropTargets.each(function (e, n) {
                var r = $(n), o = n.getBoundingClientRect();
                t > o.left && t < o.right && i > o.top && i < o.bottom ? (r.addClass("drag-over"), this.currentDropTarget = r) : r.removeClass("drag-over")
            }.bind(this))
        }, onMouseUp: function (e) {
            if (e.preventDefault(), this.currentDropTarget) {
                this.currentDropTarget.data("dropReceiver").call(null, this.items);
                var t = this.ghostElement, i = this.currentDropTarget.get(0).getBoundingClientRect(), n = i.left + (i.width - this.ghostWidth) / 2 - this.ghostOffset.x, r = i.top + (i.height - this.ghostHeight) / 2 - this.ghostOffset.y, o = "translate(" + n + "px," + r + "px) scale(0.2)";
                t.css({
                    webkitTransition: "all 0.2s ease",
                    transition: "all 0.2s ease",
                    webkitTransform: o,
                    transform: o,
                    opacity: 0
                }), setTimeout(function () {
                    t.remove()
                }, 500), this.ghostElement = null
            }
            this.stopDrag()
        }
    });
    
SL("editor.components.medialibrary").List = Class.extend({
        init: function (e, t, i) {
            this.options = $.extend({editable: true}, i), this.media = e, this.media.changed.add(this.onMediaChanged.bind(this)), this.tags = t, this.tags.associationChanged.add(this.onTagAssociationChanged.bind(this)), this.items = [], this.filteredItems = [], this.selectedItems = new SL.collections.Collection, this.overlayPool = [], this.itemSelected = new signals.Signal, this.drag = new SL.editor.components.medialibrary.ListDrag, this.render(), this.bind()
        }, render: function () {
            this.domElement = $('<div class="media-library-list">'), this.trayElement = $(['<div class="media-library-tray">', '<div class="status"></div>', '<div class="button negative delete-button">Delete</div>', '<div class="button outline white untag-button">Remove tag</div>', '<div class="button outline white clear-button">Clear selection</div>', "</div>"].join("")), this.placeholderElement = $(['<div class="media-library-list-placeholder">', "Empty", "</div>"].join("")), this.media.forEach(this.addItem.bind(this)), this.filteredItems = this.items
        }, bind: function () {
            if (this.loadItemsInView = $.throttle(this.loadItemsInView, 200), this.onMouseMove = this.onMouseMove.bind(this), this.onMouseUp = this.onMouseUp.bind(this), this.domElement.on("scroll", this.onListScrolled.bind(this)), this.trayElement.find(".delete-button").on("vclick", this.onDeleteSelectionClicked.bind(this)), this.trayElement.find(".untag-button").on("vclick", this.onUntagSelectionClicked.bind(this)), this.trayElement.find(".clear-button").on("vclick", this.onClearSelectionClicked.bind(this)), SL.util.device.IS_PHONE || SL.util.device.IS_TABLET) {
                var e = new Hammer(this.domElement.get(0));
                e.on("tap", this.onMouseUp), e.on("press", function (e) {
                    var t = $(e.target).closest(".media-library-list-item").data("item");
                    t && (this.lastSelectedItem = t, this.toggleSelection(t)), e.preventDefault()
                }.bind(this))
            } else this.domElement.on("vmousedown", this.onMouseDown.bind(this))
        }, layout: function () {
            var e = $(".media-library-list-item").first();
            this.cellWidth = e.outerWidth(true), this.cellHeight = e.outerHeight(true), this.columnCount = Math.floor(this.domElement.outerWidth() / this.cellWidth)
        }, appendTo: function (e) {
            this.domElement.appendTo(e), this.trayElement.appendTo(e), this.placeholderElement.appendTo(e), this.layout(), this.loadItemsInView()
        }, addItem: function (e, t, i) {
            var n = $('<div class="media-library-list-item"></div>'), r = {
                model: e,
                element: n,
                elementNode: n.get(0),
                selected: false,
                visible: true
            };
            n.data("item", r), t === true ? (n.prependTo(this.domElement), this.items.unshift(r)) : (n.appendTo(this.domElement), this.items.push(r)), i === true && (n.addClass("has-intro hidden"), setTimeout(function () {
                n.removeClass("hidden")
            }, 1))
        }, removeItem: function (e) {
            for (var t = this.items.length; --t >= 0;) {
                var i = this.items[t];
                i.model === e && (i.model = null, i.element.remove(), this.items.splice(t, 1))
            }
        }, setPrimaryFilter: function (e) {
            this.filterA = e, this.applyFilter()
        }, clearPrimaryFilter: function () {
            this.filterA = null, this.applyFilter()
        }, setSecondaryFilter: function (e, t) {
            this.clearSelection(), this.filterB = e, this.filterBData = t, this.applyFilter(), this.setPlaceholderContent(t.placeholder), this.afterSelectionChange()
        }, clearSecondaryFilter: function () {
            this.filterB = null, this.filterBData = null, this.applyFilter(), this.setPlaceholderContent("Empty")
        }, applyFilter: function () {
            this.filteredItems = [];
            for (var e = 0, t = this.items.length; t > e; e++) {
                var i = this.items[e];
                this.filterA && !this.filterA(i.model) || this.filterB && !this.filterB(i.model) ? (i.elementNode.style.display = "none", i.visible = false, this.detachOverlay(i)) : (this.filteredItems.push(i), i.visible = true, i.elementNode.style.display = "")
            }
            this.domElement.scrollTop(0), this.loadItemsInView(), this.placeholderElement.toggleClass("visible", 0 === this.filteredItems.length)
        }, loadItemsInView: function () {
            if (this.filteredItems.length)for (var e, t, i = this.domElement.scrollTop(), n = 100, r = this.domElement.outerHeight(), o = 0, s = this.filteredItems.length; s > o; o++)e = this.filteredItems[o], t = Math.floor(o / this.columnCount) * this.cellHeight, t + this.cellHeight - i > -n && r + n > t - i ? (e.overlay || this.attachOverlay(e), e.elementNode.hasAttribute("data-thumb-loaded") || (e.elementNode.style.backgroundImage = 'url("' + e.model.get("thumb_url") + '")', e.elementNode.setAttribute("data-thumb-loaded", "true"))) : e.overlay && !e.selected && this.detachOverlay(e)
        }, setPlaceholderContent: function (e) {
            this.placeholderElement.html(this.media.isEmpty() ? this.options.editable ? "You haven't uploaded any media yet.<br>Use the upload button to the left or drag media from your desktop." : "No media has been uploaded yet." : e || "Empty")
        }, attachOverlay: function (e) {
            return e.overlay || !this.options.editable ? false : (0 === this.overlayPool.length && this.overlayPool.push($(['<div class="info-overlay">', '<span class="info-overlay-action inline-button icon i-embed" data-tooltip="Insert SVG inline"></span>', '<span class="info-overlay-action label-button icon i-type"></span>', '<span class="info-overlay-action select-button" data-tooltip="Select">', '<span class="icon i-checkmark checkmark"></span>', "</span>", "</div>"].join(""))), e.overlay = this.overlayPool.pop(), e.overlay.appendTo(e.element), void this.refreshOverlay(e))
        }, refreshOverlay: function (e) {
            if (e.overlay) {
                var t = e.model.get("label");
                t && "" !== t || (t = "Label"), e.overlay.find(".label-button").attr("data-tooltip", t), e.model.isSVG() ? (e.overlay.addClass("has-inline-option"), e.overlay.find(".inline-button").toggleClass("is-on", !!e.model.get("inline"))) : e.overlay.removeClass("has-inline-option")
            }
        }, detachOverlay: function (e) {
            e && e.overlay && (this.overlayPool.push(e.overlay), e.overlay = null)
        }, toggleSelection: function (e, t) {
            e.visible && (e.selected = "boolean" == typeof t ? t : !e.selected, e.selected ? (e.element.addClass("is-selected"), this.selectedItems.push(e)) : (e.element.removeClass("is-selected"), this.selectedItems.remove(e)), this.afterSelectionChange())
        }, toggleSelectionThrough: function (e) {
            if (this.lastSelectedItem) {
                var t = !e.selected, i = this.lastSelectedItem.element.index(), n = e.element.index();
                if (n > i)for (var r = i + 1; n >= r; r++)this.toggleSelection(this.items[r], t); else if (i > n)for (var r = n; i > r; r++)this.toggleSelection(this.items[r], t)
            }
        }, clearSelection: function () {
            this.selectedItems.forEach(function (e) {
                e.selected = false, e.element.removeClass("is-selected")
            }.bind(this)), this.selectedItems.clear(), this.lastSelectedItem = null, this.afterSelectionChange()
        }, afterSelectionChange: function () {
            var e = this.selectedItems.size();
            this.domElement.toggleClass("is-selecting", e > 0), this.trayElement.toggleClass("visible", e > 0), this.trayElement.find(".status").text(e + " " + SL.util.string.pluralize("item", "s", 1 !== e) + " selected"), this.filterBData && this.filterBData.type === SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG ? this.trayElement.find(".untag-button").show() : this.trayElement.find(".untag-button").hide()
        }, deleteSelection: function () {
            var e = "Do you want to permanently delete this media from all existing presentations or remove it from the library?";
            this.selectedItems.size() > 1 && (e = "Do you want to permanently delete these items from all existing presentations or remove them from the library?"), SL.prompt({
                anchor: this.trayElement.find(".delete-button"),
                title: e,
                type: "select",
                data: [{html: "<h3>Cancel</h3>"}, {
                    html: "<h3>Remove from library</h3>", callback: function () {
                        this.selectedItems.forEach(function (e) {
                            e.model.set("hidden", true), e.model.save(["hidden"]).fail(function () {
                                SL.notify("An error occurred, media was not removed", "negative")
                            }.bind(this)), this.media.remove(e.model)
                        }.bind(this)), this.clearSelection()
                    }.bind(this)
                }, {
                    html: "<h3>Delete permanently</h3>", selected: true, className: "negative", callback: function () {
                        this.selectedItems.forEach(function (e) {
                            e.model.destroy().fail(function () {
                                SL.notify("An error occurred, media was not deleted", "negative")
                            }.bind(this)), this.media.remove(e.model)
                        }.bind(this)), this.clearSelection()
                    }.bind(this)
                }]
            })
        }, editLabel: function (e) {
            e.element.addClass("hover");
            var t = SL.prompt({
                anchor: e.element.find(".label-button"),
                title: "Edit asset label",
                type: "input",
                confirmLabel: "Save",
                data: {
                    value: e.model.get("label"),
                    placeholder: "Label...",
                    maxlength: SL.config.MEDIA_LABEL_MAXLENGTH,
                    width: 400
                }
            });
            t.confirmed.add(function (t) {
                e.element.removeClass("hover"), t && "" !== t.trim() ? (e.model.set("label", t), e.model.save(["label"]), this.refreshOverlay(e)) : SL.notify("Label can't be empty", "negative")
            }.bind(this)), t.canceled.add(function () {
                e.element.removeClass("hover")
            }.bind(this))
        }, toggleInline: function (e) {
            e.model.set("inline", !e.model.get("inline")), e.model.save(["inline"]), this.refreshOverlay(e)
        }, onMediaChanged: function (e, t) {
            e && e.length && (e.forEach(function (e) {
                this.addItem(e, true, true)
            }.bind(this)), this.applyFilter()), t && t.length && (t.forEach(this.removeItem.bind(this)), this.media.isEmpty() ? this.applyFilter() : this.loadItemsInView())
        }, onTagAssociationChanged: function (e) {
            var t = this.filterBData && this.filterBData.type === SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG && this.filterBData.tag.get("id") === e.get("id");
            t && this.applyFilter()
        }, onMouseDown: function (e) {
            2 !== e.button && (this.mouseDownTarget = $(e.target), this.mouseDownX = e.clientX, this.mouseDownY = e.clientY, this.domElement.on("vmousemove", this.onMouseMove), this.domElement.on("vmouseup", this.onMouseUp))
        }, onMouseMove: function (e) {
            var t = SL.util.trig.distanceBetween({x: this.mouseDownX, y: this.mouseDownY}, {x: e.clientX, y: e.clientY});
            if (t > 10 && this.options.editable) {
                var i = this.mouseDownTarget.closest(".media-library-list-item").data("item");
                if (i) {
                    this.domElement.off("vmousemove", this.onMouseMove), this.domElement.off("vmouseup", this.onMouseUp);
                    var n = [i.model];
                    this.selectedItems.size() > 0 && i.selected && (n = this.selectedItems.map(function (e) {
                        return e.model
                    })), this.drag.startDrag(e, i.element, n)
                }
            }
            e.preventDefault()
        }, onMouseUp: function (e) {
            var t = $(e.target), i = t.closest(".media-library-list-item").data("item");
            i && (this.selectedItems.size() > 0 || t.closest(".select-button").length ? e.shiftKey ? this.toggleSelectionThrough(i) : (this.lastSelectedItem = i, this.toggleSelection(i)) : t.closest(".label-button").length ? this.editLabel(i) : t.closest(".inline-button").length ? this.toggleInline(i) : this.itemSelected.dispatch(i.model)), this.domElement.off("vmousemove", this.onMouseMove), this.domElement.off("vmouseup", this.onMouseUp), e.preventDefault()
        }, onListScrolled: function () {
            this.loadItemsInView()
        }, onDeleteSelectionClicked: function () {
            this.deleteSelection()
        }, onUntagSelectionClicked: function () {
            if (this.filterBData && this.filterBData.type === SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG) {
                var e = this.selectedItems.map(function (e) {
                    return e.model
                });
                this.tags.removeTagFrom(this.filterBData.tag, e), this.applyFilter(), this.clearSelection()
            }
        }, onClearSelectionClicked: function () {
            this.clearSelection()
        }
    });
    
SL("editor.components.medialibrary").MediaLibraryPage = Class.extend({
        init: function (e, t, i) {
            this.media = e, this.media.loadCompleted.add(this.onMediaLoaded.bind(this)), this.media.loadFailed.add(this.onMediaFailed.bind(this)), this.tags = t, this.tags.loadCompleted.add(this.onTagsLoaded.bind(this)), this.tags.loadFailed.add(this.onTagsFailed.bind(this)), this.tags.changed.add(this.onTagsChanged.bind(this)), this.options = $.extend({
                editable: true,
                selectAfterUpload: true
            }, i), this.selected = new signals.Signal, this.render(), this.setupDragAndDrop()
        }, load: function () {
            this.mediaLoaded = false, this.tagsLoaded = false, this.loadStatus && this.loadStatus.remove(), this.loadStatus = $('<div class="media-library-load-status">').appendTo(this.domElement), this.loadStatus.html("Loading..."), this.media.load(), this.tags.load()
        }, onMediaLoaded: function () {
            this.mediaLoaded = true, this.tagsLoaded && this.onMediaAndTagsLoaded()
        }, onMediaFailed: function () {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), this.loadStatus.html('Failed to load media <button class="button outline retry">Try again</button>'), this.loadStatus.find(".retry").on("click", this.load.bind(this))
        }, onTagsLoaded: function () {
            this.tagsLoaded = true, this.mediaLoaded && this.onMediaAndTagsLoaded()
        }, onTagsFailed: function () {
            SL.notify(SL.locale.get("GENERIC_ERROR"), "negative"), this.loadStatus.html('Failed to load tags <button class="button outline retry">Try again</button>'), this.loadStatus.find(".retry").on("click", this.load.bind(this))
        }, onMediaAndTagsLoaded: function () {
            this.renderFilters(), this.renderUploader(), this.renderList(), this.refresh(), this.sidebarElement.addClass("visible"), this.contentElement.addClass("visible"), this.scrollShadow = new SL.components.ScrollShadow({
                parentElement: this.filters.domElement,
                contentElement: this.filters.innerElement,
                shadowSize: 6,
                resizeContent: false
            }), this.loadStatus.remove()
        }, render: function () {
            this.domElement = $('<div class="media-library-page"></div>'), this.sidebarElement = $('<div class="media-library-sidebar">').appendTo(this.domElement), this.contentElement = $('<div class="media-library-content">').appendTo(this.domElement)
        }, renderFilters: function () {
            this.filters = new SL.editor.components.medialibrary.Filters(this.media, this.tags, {editable: this.isEditable()}), this.filters.filterChanged.add(this.onFilterChanged.bind(this)), this.filters.appendTo(this.sidebarElement)
        }, renderUploader: function () {
            this.isEditable() && (this.uploader = new SL.editor.components.medialibrary.Uploader(this.media), this.uploader.uploadEnqueued.add(this.onUploadEnqueued.bind(this)), this.uploader.uploadStarted.add(this.onUploadStarted.bind(this)), this.uploader.uploadCompleted.add(this.onUploadCompleted.bind(this)), this.uploader.appendTo(this.sidebarElement))
        }, renderList: function () {
            this.list = new SL.editor.components.medialibrary.List(this.media, this.tags, {editable: this.isEditable()}), this.list.itemSelected.add(this.select.bind(this)), this.list.appendTo(this.contentElement)
        }, setupDragAndDrop: function () {
            var e = $(['<div class="media-library-drag-instructions">', '<div class="inner">', "Drop to upload media", "</div>", "</div>"].join(""));
            this.dragAndDropListener = {
                onDragOver: function () {
                    e.appendTo(this.domElement)
                }.bind(this), onDragOut: function () {
                    e.remove()
                }.bind(this), onDrop: function (t) {
                    e.remove();
                    var i = t.originalEvent.dataTransfer.files;
                    if (this.isSelecting())this.uploader.enqueue(i[0]); else for (var n = 0; n < i.length; n++)this.uploader.enqueue(i[n]);
                }.bind(this)
            }
        }, show: function (e) {
            this.domElement.appendTo(e), this.domElement.removeClass("visible"), clearTimeout(this.showTimeout), this.showTimeout = setTimeout(function () {
                this.domElement.addClass("visible")
            }.bind(this), 1)
        }, hide: function () {
            clearTimeout(this.showTimeout), this.domElement.detach()
        }, bind: function () {
            SL.draganddrop.subscribe(this.dragAndDropListener)
        }, unbind: function () {
            SL.draganddrop.unsubscribe(this.dragAndDropListener)
        }, configure: function (e) {
            this.options = $.extend(this.options, e), this.refresh()
        }, refresh: function () {
            this.media && this.media.isLoaded() && (this.list.clearSelection(), this.uploader && this.uploader.configure({multiple: !this.isSelecting() || !this.options.selectAfterUpload}), this.isSelecting() ? (this.list.setPrimaryFilter(this.options.select.filter), this.list.clearSecondaryFilter(), this.filters.hideAllTypesExcept(this.options.select.id), this.filters.selectFilter(this.options.select.id)) : (this.filters.showAllTypes(), this.list.clearPrimaryFilter(), this.filters.selectDefaultFilter()), this.scrollShadow && this.scrollShadow.sync())
        }, layout: function () {
            var e = this.sidebarElement.width();
            this.contentElement.css({
                width: this.domElement.width() - e,
                left: e,
                paddingLeft: 0
            }), this.list && this.list.layout()
        }, select: function (e) {
            this.selected.dispatch(e)
        }, isSelecting: function () {
            return !!this.options.select
        }, isEditable: function () {
            return !!this.options.editable
        }, onFilterChanged: function (e, t) {
            this.list.setSecondaryFilter(e, t)
        }, onUploadEnqueued: function (e) {
            var t = this.filters.getSelectedFilterData();
            t.type === SL.editor.components.medialibrary.Filters.FILTER_TYPE_TAG && e.uploadCompleted.add(function () {
                this.tags.addTagTo(t.tag, [e])
            }.bind(this))
        }, onUploadStarted: function (e) {
            this.isSelecting() && this.options.selectAfterUpload && this.select(e)
        }, onUploadCompleted: function (e) {
            this.media.push(e)
        }, onTagsChanged: function () {
            this.scrollShadow && this.scrollShadow.sync()
        }
    });

SL("editor.components.medialibrary").MediaLibrary = SL.components.popup.Popup.extend({
        TYPE: "media-library",
        init: function (e) {
            this._super($.extend({
                title: "Media Library",
                width: 1010,
                height: 660,
                singleton: true
            }, e)), this.selected = new signals.Signal
        },
        render: function () {
            if (this._super(), this.innerElement.addClass("media-library"), this.userPage = new SL.editor.components.medialibrary.MediaLibraryPage(new SL.collections.Media, new SL.collections.MediaTags), this.userPage.selected.add(this.onMediaSelected.bind(this)), this.userPage.load(), SL.current_user.isEnterprise()) {
                var e = new SL.collections.TeamMedia;
                this.headerTabs = $(['<div class="media-library-header-tabs">', '<div class="media-library-header-tab user-tab">Your Media</div>', '<div class="media-library-header-tab team-tab" data-tooltip-alignment="r">Team Media</div>', "</div>"].join("")), this.userTab = this.headerTabs.find(".user-tab"), this.teamTab = this.headerTabs.find(".team-tab"), this.userTab.on("vclick", this.showUserPage.bind(this)), this.teamTab.on("vclick", this.showTeamPage.bind(this)), this.innerElement.addClass("has-header-tabs"), this.headerTitleElement.replaceWith(this.headerTabs), e.loadCompleted.add(function () {
                    !SL.current_user.isEnterpriseManager() && e.isEmpty() && (this.teamTab.addClass("is-disabled"), this.teamTab.attr("data-tooltip", "Your team doesn't have any shared media yet.<br>Only admins can upload team media."))
                }.bind(this)), e.loadFailed.add(function () {
                    this.teamTab.attr("data-tooltip", "Failed to load")
                }.bind(this)), this.teamPage = new SL.editor.components.medialibrary.MediaLibraryPage(e, new SL.collections.TeamMediaTags, {
                    editable: SL.current_user.isEnterpriseManager(),
                    selectAfterUpload: false
                }), this.teamPage.selected.add(this.onMediaSelected.bind(this)), this.teamPage.load()
            }
            this.showUserPage()
        },
        showUserPage: function () {
            this.currentPage = this.userPage, this.teamPage && (this.teamPage.hide(), this.teamTab.removeClass("is-selected"), this.userTab.addClass("is-selected")), this.userPage.show(this.bodyElement), this.userPage.configure(this.options), this.refresh(), this.layout()
        },
        showTeamPage: function () {
            this.currentPage = this.teamPage, this.userPage.hide(), this.userTab.removeClass("is-selected"), this.teamPage.show(this.bodyElement), this.teamPage.configure(this.options), this.teamTab.addClass("is-selected"), this.refresh(), this.layout()
        },
        open: function (e) {
            e = $.extend({select: null}, e), this._super(e), this.currentPage.configure(e), this.currentPage.bind(), this.refresh(), this.layout()
        },
        close: function () {
            this._super.apply(this, arguments), this.selected.removeAll(), this.currentPage.unbind()
        },
        layout: function () {
            this._super.apply(this, arguments), this.currentPage.layout()
        },
        refresh: function () {
            this.currentPage.refresh()
        },
        isSelecting: function () {
            return !!this.options.select
        },
        onMediaSelected: function (e) {
            this.isSelecting() ? this.selected.dispatch(e) : SL.editor.controllers.Blocks.add({
                type: "image",
                afterInit: function (t) {
                    t.setImageModel(e)
                }
            }), this.close()
        }
    });

SL("editor.components.medialibrary").Uploader = Class.extend({
        MAX_CONCURRENT_UPLOADS: 2,
        FILE_FORMATS: [{validator: /image.*/, maxSize: SL.config.MAX_IMAGE_UPLOAD_SIZE}],
        init: function (e) {
            this.media = e, this.options = {multiple: true}, this.queue = new SL.collections.Collection, this.render(), this.renderInput(), this.bind()
        },
        bind: function () {
            this.onUploadCompleted = this.onUploadCompleted.bind(this), this.onUploadFailed = this.onUploadFailed.bind(this), this.uploadEnqueued = new signals.Signal, this.uploadStarted = new signals.Signal, this.uploadCompleted = new signals.Signal
        },
        render: function () {
            this.domElement = $('<div class="media-library-uploader">'), this.uploadButton = $('<div class="media-library-uploader-button">Upload <span class="icon i-cloud-upload2"></span></div>'), this.uploadButton.appendTo(this.domElement), this.uploadList = $('<div class="media-library-uploader-list">'), this.uploadList.appendTo(this.domElement)
        },
        renderInput: function () {
            this.fileInput && this.fileInput.remove(), this.fileInput = $('<input class="file-input" type="file">'), this.fileInput.on("change", this.onInputChanged.bind(this)), this.fileInput.appendTo(this.uploadButton), this.options.multiple ? this.fileInput.attr("multiple", "multiple") : this.fileInput.removeAttr("multiple", "multiple")
        },
        configure: function (e) {
            this.options = $.extend(this.options, e), this.renderInput()
        },
        appendTo: function (e) {
            this.domElement.appendTo(e)
        },
        isUploading: function () {
            return this.queue.some(function (e) {
                return e.isUploading()
            })
        },
        validateFile: function (e) {
            var t = "number" == typeof e.size ? e.size / 1024 : 0;
            return this.FILE_FORMATS.some(function (i) {
                return e.type.match(i.validator) ? i.maxSize && t > i.maxSize ? false : true : false
            })
        },
        enqueue: function (e) {
            if (this.queue.size() >= 50)return SL.notify("Upload queue is full, please wait", "negative"), false;
            var t = new SL.models.Media(null, this.media.crud, e);
            t.uploaderElement = $(['<div class="media-library-uploader-item">', '<div class="item-text">', '<span class="status"><span class="icon i-clock"></span></span>', '<span class="filename">' + (e.name || "untitled") + "</span>", "</div>", '<div class="item-progress">', '<span class="bar"></span>', "</div>", "</div>"].join("")), t.uploaderElement.appendTo(this.uploadList), setTimeout(t.uploaderElement.addClass.bind(t.uploaderElement, "animate-in"), 1), t.uploadCompleted.add(this.onUploadCompleted), t.uploadFailed.add(this.onUploadFailed), t.uploadProgressed.add(function (e) {
                var i = "scaleX(" + e + ")";
                t.uploaderElement.find(".bar").css({"-webkit-transform": i, "-moz-transform": i, transform: i})
            }.bind(this)), this.queue.push(t), this.uploadEnqueued.dispatch(t), this.checkQueue()
        },
        dequeue: function (e, t, i) {
            var n = e.uploaderElement;
            n && (e.uploaderElement = null, n.addClass(t), n.find(".status").html(i), setTimeout(function () {
                n.removeClass("animate-in").addClass("animate-out"), setTimeout(n.remove.bind(n), 500)
            }.bind(this), 2e3), this.queue.remove(e), e.isUploaded() && this.uploadCompleted.dispatch(e))
        },
        checkQueue: function () {
            this.queue.forEach(function (e) {
                e.isUploaded() ? this.dequeue(e, "completed", '<span class="icon i-checkmark"></span>') : e.isUploadFailed() && this.dequeue(e, "failed", '<span class="icon i-denied"></span>')
            }.bind(this));
            var e = 0;
            this.queue.forEach(function (t) {
                e < this.MAX_CONCURRENT_UPLOADS && (t.isUploading() ? e += 1 : t.isWaitingToUpload() && (t.upload(), t.uploaderElement.find(".status").html('<div class="upload-spinner"></div>'), e += 1, this.uploadStarted.dispatch(t)))
            }.bind(this)), this.domElement.toggleClass("is-uploading", e > 0)
        },
        onUploadCompleted: function () {
            this.checkQueue()
        },
        onUploadFailed: function (e) {
            SL.notify(e || "An error occurred while uploading your image.", "negative"), this.checkQueue()
        },
        onInputChanged: function (e) {
            var t = SL.util.toArray(this.fileInput.get(0).files);
            t = t.filter(this.validateFile.bind(this)), t.length ? (t.forEach(this.enqueue.bind(this))) : SL.notify("Invalid file. We support <strong>PNG</strong>, <strong>JPG</strong>, <strong>GIF</strong> and <strong>SVG</strong> files up to <strong>10 MB</strong>", "negative"), this.renderInput(), e.preventDefault()
        },
        destroy: function () {
            this.queue = null, this.uploadStarted.dispose(), this.uploadCompleted.dispose()
        }
    });