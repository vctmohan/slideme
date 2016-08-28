SL.config = {
    SLIDE_WIDTH: 960,
    SLIDE_HEIGHT: 700,
    LOGIN_STATUS_INTERVAL: 6e4,
    UNSAVED_CHANGES_INTERVAL: 1500,
    AUTOSAVE_INTERVAL: 4e3,
    DECK_SAVE_TIMEOUT: 25e3,
    DECK_TITLE_MAXLENGTH: 200,
    MEDIA_LABEL_MAXLENGTH: 200,
    SPEAKER_NOTES_MAXLENGTH: 1e4,
    COLLABORATION_IDLE_TIMEOUT: 24e4,
    COLLABORATION_RESET_WRITING_TIMEOUT: 15e3,
    COLLABORATION_SEND_WRITING_INTERVAL: 5e3,
    COLLABORATION_COMMENT_MAXLENGTH: 1e3,
    MAX_IMAGE_UPLOAD_SIZE: 1e4,
    MAX_IMPORT_UPLOAD_SIZE: 1e5,
    IMPORT_SOCKET_TIMEOUT: 24e4,
    PRESENT_CONTROLS_DEFAULT: true,
    PRESENT_UPSIZING_DEFAULT: true,
    PRESENT_UPSIZING_MAX_SCALE: 10,
    DEFAULT_SLIDE_TRANSITION_DURATION: 800,
    DEFAULT_THEME_COLOR: "white-blue",
    DEFAULT_THEME_FONT: "montserrat",
    DEFAULT_THEME_TRANSITION: "slide",
    DEFAULT_THEME_BACKGROUND_TRANSITION: "slide",
    AUTO_SLIDE_OPTIONS: [2, 4, 6, 8, 10, 15, 20, 30, 40],
    RESERVED_SLIDE_CLASSES: ["past", "present", "future", "disabled", "overflowing"],
    FRAGMENT_STYLES: [{id: "", title: "Fade in"}, {
        id: "fade-down",
        title: "Fade in from above"
    }, {id: "fade-up", title: "Fade in from below"}, {
        id: "fade-right",
        title: "Fade in from left"
    }, {id: "fade-left", title: "Fade in from right"}, {
        id: "fade-out",
        title: "Fade out"
    }, {id: "current-visible", title: "Fade in then out"}],
    THEME_COLORS: [{id: "white-blue"}, {id: "sand-blue"}, {id: "beige-brown"}, {id: "silver-green"}, {id: "silver-blue"}, {id: "sky-blue"}, {id: "blue-yellow"}, {id: "cobalt-orange"}, {id: "asphalt-orange"}, {id: "forest-yellow"}, {id: "mint-beige"}, {id: "sea-yellow"}, {id: "yellow-black"}, {id: "coral-blue"}, {id: "grey-blue"}, {id: "black-blue"}, {id: "black-mint"}, {id: "black-orange"}],
    THEME_FONTS: [{id: "montserrat", title: "Montserrat"}, {
        id: "league",
        title: "League"
    }, {id: "opensans", title: "Open Sans"}, {
        id: "josefine",
        title: "Josefine"
    }, {id: "palatino", title: "Palatino"}, {
        id: "news",
        title: "News"
    }, {id: "helvetica", title: "Helvetica"}, {
        id: "merriweather",
        title: "Merriweather"
    }, {id: "asul", title: "Asul"}, {
        id: "sketch",
        title: "Sketch"
    }, {id: "quicksand", title: "Quicksand"}, {
        id: "overpass",
        title: "Overpass v1",
        deprecated: true
    }, {id: "overpass2", title: "Overpass"}],
    THEME_TRANSITIONS: [{id: "slide", title: "Slide"}, {
        id: "linear",
        title: "Linear",
        deprecated: true
    }, {id: "fade", title: "Fade"}, {id: "none", title: "None"}, {
        id: "default",
        title: "Convex"
    }, {id: "concave", title: "Concave"}, {
        id: "zoom",
        title: "Zoom"
    }, {id: "cube", title: "Cube", deprecated: true}, {
        id: "page",
        title: "Page",
        deprecated: true
    }],
    THEME_BACKGROUND_TRANSITIONS: [{id: "slide", title: "Slide"}, {
        id: "fade",
        title: "Fade"
    }, {id: "none", title: "None"}, {
        id: "convex",
        title: "Convex"
    }, {id: "concave", title: "Concave"}, {id: "zoom", title: "Zoom"}],
    BLOCKS: new SL.collections.Collection([{
        type: "text",
        factory: "Text",
        label: "Text",
        icon: "type"
    }, {
        type: "image",
        factory: "Image",
        label: "Image",
        icon: "picture"
    }, {
        type: "shape",
        factory: "Shape",
        label: "Shape",
        icon: "shapes"
    }, {type: "line", factory: "Line", label: "Line", icon: ""}, {
        type: "iframe",
        factory: "Iframe",
        label: "Iframe",
        icon: "browser"
    }, {
        type: "table",
        factory: "Table",
        label: "Table",
        icon: "table"
    }, {
        type: "code",
        factory: "Code",
        label: "Code",
        icon: "file-css"
    }, {
        type: "math",
        factory: "Math",
        label: "Math",
        icon: "divide"
    }, {
        type: "snippet",
        factory: "Snippet",
        label: "snippet",
        icon: "file-xml",
        hidden: true
    }]),
    DEFAULT_DECK_THUMBNAIL: "https://s3.amazonaws.com/static.slid.es/images/default-deck-thumbnail.png",
    DEFAULT_USER_THUMBNAIL: "https://s3.amazonaws.com/static.slid.es/images/default-profile-picture.png",
    DECK_THUMBNAIL_TEMPLATE: ['<li class="deck-thumbnail">', '<div class="deck-image" style="background-image: url({{DECK_THUMB_URL}})">', '<a class="deck-link" href="{{DECK_URL}}"></a>', "</div>", '<footer class="deck-details">', '<a class="author" href="{{USER_URL}}">', '<span class="picture" style="background-image: url({{USER_THUMB_URL}})"></span>', '<span class="name">{{USER_NAME}}</span>', "</a>", '<div class="stats">', '<div>{{DECK_VIEWS}}<span class="icon i-eye"></span></div>', "</div>", "</footer>", "</li>"].join(""),
    AJAX_SEARCH: "/api/v1/search.json",
    AJAX_SEARCH_ORGANIZATION: "/api/v1/team/search.json",
    AJAX_GET_DECK: function (t) {
        return "/api/v1/decks/" + t + ".json"
    },
    AJAX_CREATE_DECK: function () {
        return "/api/v1/decks.json"
    },
    AJAX_UPDATE_DECK: function (t) {
        return "/api/v1/decks/" + t + ".json"
    },
    AJAX_PUBLISH_DECK: function (t) {
        return "/api/v1/decks/" + t + "/publish.json"
    },
    AJAX_GET_DECK_DATA: function (t) {
        return "/api/v1/decks/" + t + "/data.json"
    },
    AJAX_MAKE_DECK_COLLABORATIVE: function (t) {
        return "/api/v1/decks/" + t + "/make_collaborative.json"
    },
    AJAX_GET_DECK_VERSIONS: function (t) {
        return "/api/v1/decks/" + t + "/revisions.json"
    },
    AJAX_PREVIEW_DECK_VERSION: function (t, e, i) {
        return "/" + t + "/" + e + "/preview?revision=" + i
    },
    AJAX_RESTORE_DECK_VERSION: function (t, e) {
        return "/api/v1/decks/" + t + "/revisions/" + e + "/restore.json"
    },
    AJAX_EXPORT_DECK: function (t, e) {
        return "/" + t + "/" + e + "/export"
    },
    AJAX_THUMBNAIL_DECK: function (t) {
        return "/api/v1/decks/" + t + "/thumbnails.json"
    },
    AJAX_FORK_DECK: function (t) {
        return "/api/v1/decks/" + t + "/fork.json"
    },
    AJAX_SHARE_DECK_VIA_EMAIL: function (t) {
        return "/api/v1/decks/" + t + "/deck_shares.json"
    },
    AJAX_KUDO_DECK: function (t) {
        return "/api/v1/decks/" + t + "/kudos/kudo.json"
    },
    AJAX_UNKUDO_DECK: function (t) {
        return "/api/v1/decks/" + t + "/kudos/unkudo.json"
    },
    AJAX_EXPORT_START: function (t) {
        return "/api/v1/decks/" + t + "/exports.json"
    },
    AJAX_EXPORT_LIST: function (t) {
        return "/api/v1/decks/" + t + "/exports.json"
    },
    AJAX_EXPORT_STATUS: function (t, e) {
        return "/api/v1/decks/" + t + "/exports/" + e + ".json"
    },
    AJAX_PDF_IMPORT_NEW: "/api/v1/imports.json",
    AJAX_PDF_IMPORT_UPLOADED: function (t) {
        return "/api/v1/imports/" + t + ".json"
    },
    AJAX_DROPBOX_CONNECT: "/settings/dropbox/authorize",
    AJAX_DROPBOX_DISCONNECT: "https://www.dropbox.com/account/security#apps",
    AJAX_DROPBOX_SYNC_DECK: function (t) {
        return "/api/v1/decks/" + t + "/export.json"
    },
    AJAX_UPDATE_TEAM: "/api/v1/team.json",
    AJAX_LOOKUP_TEAM: "/api/v1/team/lookup.json",
    AJAX_TEAM_MEMBER_SEARCH: "/api/v1/team/users/search.json",
    AJAX_TEAM_MEMBERS_LIST: "/api/v1/team/users.json",
    AJAX_TEAM_MEMBER_CREATE: "/api/v1/team/users.json",
    AJAX_TEAM_MEMBER_UPDATE: function (t) {
        return "/api/v1/team/users/" + t + ".json"
    },
    AJAX_TEAM_MEMBER_DELETE: function (t) {
        return "/api/v1/team/users/" + t + ".json"
    },
    AJAX_TEAM_MEMBER_REACTIVATE: function (t) {
        return "/api/v1/team/users/" + t + "/reactivate.json"
    },
    AJAX_TEAM_MEMBER_DEACTIVATE: function (t) {
        return "/api/v1/team/users/" + t + "/deactivate.json"
    },
    AJAX_TEAM_INVITATIONS_LIST: "/api/v1/team/invitations.json",
    AJAX_TEAM_INVITATIONS_CREATE: "/api/v1/team/invitations.json",
    AJAX_TEAM_INVITATIONS_DELETE: function (t) {
        return "/api/v1/team/invitations/" + t + ".json"
    },
    AJAX_TEAM_INVITATIONS_RESEND: function (t) {
        return "/api/v1/team/invitations/" + t + "/resend.json"
    },
    AJAX_THEMES_LIST: "/api/v1/themes.json",
    AJAX_THEMES_CREATE: "/api/v1/themes.json",
    AJAX_THEMES_READ: function (t) {
        return "/api/v1/themes/" + t + ".json"
    },
    AJAX_THEMES_UPDATE: function (t) {
        return "/api/v1/themes/" + t + ".json"
    },
    AJAX_THEMES_DELETE: function (t) {
        return "/api/v1/themes/" + t + ".json"
    },
    AJAX_DECK_THEME: function (t) {
        return "/api/v1/decks/" + t + "/theme.json"
    },
    AJAX_THEME_ADD_SLIDE_TEMPLATE: function (t) {
        return "/api/v1/themes/" + t + "/add_slide_template.json"
    },
    AJAX_THEME_REMOVE_SLIDE_TEMPLATE: function (t) {
        return "/api/v1/themes/" + t + "/remove_slide_template.json"
    },
    AJAX_ACCESS_TOKENS_LIST: function (t) {
        return "/api/v1/decks/" + t + "/access_tokens.json"
    },
    AJAX_ACCESS_TOKENS_CREATE: function (t) {
        return "/api/v1/decks/" + t + "/access_tokens.json"
    },
    AJAX_ACCESS_TOKENS_UPDATE: function (t, e) {
        return "/api/v1/decks/" + t + "/access_tokens/" + e + ".json"
    },
    AJAX_ACCESS_TOKENS_DELETE: function (t, e) {
        return "/api/v1/decks/" + t + "/access_tokens/" + e + ".json"
    },
    AJAX_ACCESS_TOKENS_PASSWORD_AUTH: function (t) {
        return "/access_tokens/" + t + ".json"
    },
    AJAX_SLIDE_TEMPLATES_LIST: "/api/v1/slide_templates.json",
    AJAX_SLIDE_TEMPLATES_CREATE: "/api/v1/slide_templates.json",
    AJAX_SLIDE_TEMPLATES_UPDATE: function (t) {
        return "/api/v1/slide_templates/" + t + ".json"
    },
    AJAX_SLIDE_TEMPLATES_DELETE: function (t) {
        return "/api/v1/slide_templates/" + t + ".json"
    },
    AJAX_TEAM_SLIDE_TEMPLATES_LIST: "/api/v1/team/slide_templates.json",
    AJAX_TEAM_SLIDE_TEMPLATES_CREATE: "/api/v1/team/slide_templates.json",
    AJAX_TEAM_SLIDE_TEMPLATES_UPDATE: function (t) {
        return "/api/v1/team/slide_templates/" + t + ".json"
    },
    AJAX_TEAM_SLIDE_TEMPLATES_DELETE: function (t) {
        return "/api/v1/team/slide_templates/" + t + ".json"
    },
    AJAX_GET_USER: function (t) {
        return "/api/v1/users/" + t + ".json"
    },
    AJAX_LOOKUP_USER: "/api/v1/users/lookup.json",
    AJAX_SERVICES_USER: "/api/v1/users/services.json",
    AJAX_UPDATE_USER: "/users.json",
    AJAX_GET_USER_SETTINGS: "/api/v1/user_settings.json",
    AJAX_UPDATE_USER_SETTINGS: "/api/v1/user_settings.json",
    AJAX_SUBSCRIPTIONS: "/subscriptions",
    AJAX_SUBSCRIPTIONS_STATUS: "/account/details.json",
    AJAX_SUBSCRIPTIONS_PRINT_RECEIPT: function (t) {
        return "/account/receipts/" + t
    },
    AJAX_TEAMS_CREATE: "/teams.json",
    AJAX_TEAMS_REACTIVATE: "/subscriptions/reactivate.json",
    AJAX_CHECK_STATUS: "/api/v1/status.json",
    AJAX_MEDIA_LIST: "/api/v1/media.json",
    AJAX_MEDIA_CREATE: "/api/v1/media.json",
    AJAX_MEDIA_UPDATE: function (t) {
        return "/api/v1/media/" + t + ".json"
    },
    AJAX_MEDIA_DELETE: function (t) {
        return "/api/v1/media/" + t + ".json"
    },
    AJAX_MEDIA_TAG_LIST: "/api/v1/tags.json",
    AJAX_MEDIA_TAG_CREATE: "/api/v1/tags.json",
    AJAX_MEDIA_TAG_UPDATE: function (t) {
        return "/api/v1/tags/" + t + ".json"
    },
    AJAX_MEDIA_TAG_DELETE: function (t) {
        return "/api/v1/tags/" + t + ".json"
    },
    AJAX_MEDIA_TAG_ADD_MEDIA: function (t) {
        return "/api/v1/tags/" + t + "/add_media.json"
    },
    AJAX_MEDIA_TAG_REMOVE_MEDIA: function (t) {
        return "/api/v1/tags/" + t + "/remove_media.json"
    },
    AJAX_TEAM_MEDIA_LIST: "/api/v1/team/media.json",
    AJAX_TEAM_MEDIA_CREATE: "/api/v1/team/media.json",
    AJAX_TEAM_MEDIA_UPDATE: function (t) {
        return "/api/v1/team/media/" + t + ".json"
    },
    AJAX_TEAM_MEDIA_DELETE: function (t) {
        return "/api/v1/team/media/" + t + ".json"
    },
    AJAX_TEAM_MEDIA_TAG_LIST: "/api/v1/team/tags.json",
    AJAX_TEAM_MEDIA_TAG_CREATE: "/api/v1/team/tags.json",
    AJAX_TEAM_MEDIA_TAG_UPDATE: function (t) {
        return "/api/v1/team/tags/" + t + ".json"
    },
    AJAX_TEAM_MEDIA_TAG_DELETE: function (t) {
        return "/api/v1/team/tags/" + t + ".json"
    },
    AJAX_TEAM_MEDIA_TAG_ADD_MEDIA: function (t) {
        return "/api/v1/team/tags/" + t + "/add_media.json"
    },
    AJAX_TEAM_MEDIA_TAG_REMOVE_MEDIA: function (t) {
        return "/api/v1/team/tags/" + t + "/remove_media.json"
    },
    AJAX_DECKUSER_LIST: function (t) {
        return "/api/v1/decks/" + t + "/users.json"
    },
    AJAX_DECKUSER_READ: function (t, e) {
        return "/api/v1/decks/" + t + "/users/" + e + ".json"
    },
    AJAX_DECKUSER_CREATE: function (t) {
        return "/api/v1/decks/" + t + "/users/invite.json"
    },
    AJAX_DECKUSER_UPDATE: function (t, e) {
        return "/api/v1/decks/" + t + "/users/" + e + ".json"
    },
    AJAX_DECKUSER_DELETE: function (t, e) {
        return "/api/v1/decks/" + t + "/users/" + e + ".json"
    },
    AJAX_DECKUSER_BECOME_EDITOR: function (t, e) {
        return "/api/v1/decks/" + t + "/users/" + e + "/become_editor.json"
    },
    AJAX_DECKUSER_UPDATE_LAST_SEEN_AT: function (t) {
        return "/api/v1/decks/" + t + "/users/update_last_seen_at.json"
    },
    AJAX_COMMENTS_LIST: function (t, e) {
        return "/api/v1/decks/" + t + "/comments.json" + (e ? "?slide_hash=" + e : "")
    },
    AJAX_COMMENTS_CREATE: function (t) {
        return "/api/v1/decks/" + t + "/comments.json"
    },
    AJAX_COMMENTS_UPDATE: function (t, e) {
        return "/api/v1/decks/" + t + "/comments/" + e + ".json"
    },
    AJAX_COMMENTS_DELETE: function (t, e) {
        return "/api/v1/decks/" + t + "/comments/" + e + ".json"
    },
    STREAM_ENGINE_HOST: window.location.protocol + "//stream2.slides.com",
    STREAM_ENGINE_LIVE_NAMESPACE: "live",
    STREAM_ENGINE_EDITOR_NAMESPACE: "editor",
    APP_HOST: "slides.com",
    S3_HOST: "https://s3.amazonaws.com/media-p.slid.es",
    ASSET_URLS: {
        "offline-v2.css": "//assets.slid.es/assets/offline-v2-ca492d04b9e3443dd0405b145c3e57fe.css",
        "homepage-background.jpg": "//assets.slid.es/assets/homepage-background-b002e480a9b1026f07a1a3d066404640.jpg",
        "reveal-plugins/markdown/marked.js": "//assets.slid.es/assets/reveal-plugins/markdown/marked-285d0e546e608bca75e0c8af0d6b44cd.js",
        "reveal-plugins/markdown/markdown.js": "//assets.slid.es/assets/reveal-plugins/markdown/markdown-769f9bfbb5d81257779bf0353cc6ecd4.js",
        "reveal-plugins/highlight/highlight.js": "//assets.slid.es/assets/reveal-plugins/highlight/highlight-9efb98b823ef2e51598faabaa51da5be.js"
    }
};