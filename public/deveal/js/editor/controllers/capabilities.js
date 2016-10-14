SL("editor.controllers").Capabilities = {
    TOUCH_EDITOR: false,
    TOUCH_EDITOR_SMALL: false,
    init: function () {
        if (!SL.util.device.supportedByEditor()) {
            $(document.body).append('<div class="not-supported"><h2>Not Supported</h2><p>The Slides editor doesn\'t currently support the browser you\'re using. Please consider changing to a different browser, such as <a href="https://www.google.com/chrome">Google Chrome</a> or <a href="https://www.mozilla.org/firefox/">Firefox</a>.</p><a class="skip" href="#">Continue anyway</a></div>');
            $(".not-supported .skip").on("click", function () {
                $(".not-supported").remove();
            });
            return false;
        }

        SL.editor.controllers.Capabilities.TOUCH_EDITOR = /ipad|iphone|ipod|android/gi.test(navigator.userAgent) && !!("ontouchstart" in window);
        SL.editor.controllers.Capabilities.TOUCH_EDITOR_SMALL = SL.editor.controllers.Capabilities.TOUCH_EDITOR && window.innerWidth > 0 && window.innerWidth < 1e3;
        SL.editor.controllers.Capabilities.TOUCH_EDITOR && ($("html").addClass("touch-editor"), SL.editor.controllers.Capabilities.TOUCH_EDITOR_SMALL && $("html").addClass("touch-editor-small"));
        var is_user = SL.current_user.get("id") === SL.current_deck.get("user").id;
        this._canExport = is_user;
        this._canPresent = is_user;
        this._canShareDeck = is_user || SL.current_deck.isVisibilityAll();
        this._canDeleteDeck = is_user;
        this._canChangeStyles = is_user || !SL.current_team || !SL.current_team.hasThemes() || SL.current_user.isMemberOfCurrentTeam();
        this._canSetVisibility = is_user;
        return true;
    },
    isTouchEditor: function () {
        return SL.editor.controllers.Capabilities.TOUCH_EDITOR
    },
    isTouchEditorSmall: function () {
        return SL.editor.controllers.Capabilities.TOUCH_EDITOR_SMALL;
    },
    canExport: function () {
        return this._canExport;
    },
    canPresent: function () {
        return this._canPresent;
    },
    canDeleteDeck: function () {
        return this._canDeleteDeck;
    },
    canChangeStyles: function () {
        return this._canChangeStyles;
    },
    canSetVisibility: function () {
        return this._canSetVisibility;
    }
};