SL("components").Search = Class.extend({
    init: function (t) {
        this.config = t;
        this.searchForm = $(".search .search-form");
        this.searchFormInput = this.searchForm.find(".search-term");
        this.searchFormSubmit = this.searchForm.find(".search-submit");
        this.searchResults = $(".search .search-results");
        this.searchResultsHeader = this.searchResults.find("header");
        this.searchResultsTitle = this.searchResults.find(".search-results-title");
        this.searchResultsSorting = this.searchResults.find(".search-results-sorting");
        this.searchResultsList = this.searchResults.find("ul");
        this.searchFormLoader = Ladda.create(this.searchFormSubmit.get(0));
        this.bind();
        this.checkQuery();
    },
    bind: function () {
        this.searchForm.on("submit", this.onSearchFormSubmit.bind(this));
        this.searchResultsSorting.find("input[type=radio]").on("click", this.onSearchSortingChange.bind(this));
    },
    checkQuery: function () {
        var t = SL.util.getQuery();
        t.search && !this.searchFormInput.val() && (this.searchFormInput.val(t.search), t.page ? this.search(t.search, parseInt(t.page, 10)) : this.search(t.search))
    },
    renderSearchResults: function (t) {
        if ($(".search").removeClass("empty"), this.searchResults.show(), this.searchResultsList.empty(), this.renderSearchPagination(t), t.results && t.results.length) {
            this.searchResultsTitle.text(t.total + " " + SL.util.string.pluralize("result", "s", t.total > 1) + ' for "' + this.searchTerm + '"');
            for (var e = 0, i = t.results.length; i > e; e++) {
                var n = t.results[e];
                n.user && this.searchResultsList.append(SL.util.html.createDeckThumbnail(n))
            }
        } else this.searchResultsTitle.text(t.error || SL.locale.get("SEARCH_NO_RESULTS_FOR", {term: this.searchTerm}))
    },
    renderSearchPagination: function (t) {
        "undefined" == typeof t.decks_per_page && (t.decks_per_page = 8);
        var e = Math.ceil(t.total / t.decks_per_page);
        this.searchPagination && this.searchPagination.remove(), e > 1 && (this.searchPagination = $('<div class="search-results-pagination"></div>').appendTo(this.searchResultsHeader), this.searchPagination.append('<span class="page">' + SL.locale.get("SEARCH_PAGINATION_PAGE") + " " + this.searchPage + "/" + e + "</span>"), this.searchPage > 1 && this.searchPagination.append('<button class="button outline previous">' + SL.locale.get("PREVIOUS") + "</button>"), this.searchPagination.append('<button class="button outline next">' + SL.locale.get("NEXT") + "</button>"), this.searchPagination.find("button.previous").on("click", function () {
            this.search(this.searchTerm, Math.max(this.searchPage - 1, 1))
        }.bind(this)), this.searchPagination.find("button.next").on("click", function () {
            this.search(this.searchTerm, Math.min(this.searchPage + 1, e))
        }.bind(this)))
    },
    search: function (t, e, i) {
        if (this.searchTerm = t || this.searchFormInput.val(), this.searchPage = e || 1, this.searchSort = i || this.searchSort, window.history && "function" == typeof window.history.replaceState) {
            var n = "?search=" + escape(this.searchTerm);
            e > 1 && (n += "&page=" + e), window.history.replaceState(null, null, "/explore" + n)
        }
        this.searchSort || (this.searchSort = this.searchResultsSorting.find("input[type=radio]:checked").val()), this.searchResultsSorting.find("input[type=radio]").prop("checked", !1), this.searchResultsSorting.find("input[type=radio][value=" + this.searchSort + "]").prop("checked", !0), this.searchTerm ? (this.searchFormLoader.start(), $.ajax({
            type: "GET",
            url: this.config.url,
            context: this,
            data: {q: this.searchTerm, page: this.searchPage, sort: this.searchSort}
        }).done(function (t) {
            this.renderSearchResults(t)
        }).fail(function () {
            this.renderSearchResults({error: SL.locale.get("SEARCH_SERVER_ERROR")})
        }).always(function () {
            this.searchFormLoader.stop()
        })) : SL.notify(SL.locale.get("SEARCH_NO_TERM_ERROR"))
    },
    sort: function (t) {
        this.search(this.searchTerm, this.searchPage, t)
    },
    onSearchFormSubmit: function (t) {
        return this.search(), t.preventDefault(), !1
    },
    onSearchSortingChange: function () {
        this.sort(this.searchResultsSorting.find("input[type=radio]:checked").val())
    }
});