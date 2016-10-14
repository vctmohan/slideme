SL.settings = {
    STORAGE_KEY: "slides-settings",
    STORAGE_VERSION: 1,
    EDITOR_AUTO_HIDE: "editorAutoHide",
    EDITOR_AUTO_SAVE: "editorAutoSave",
    init: function () {
        this.settings = {version: this.STORAGE_VERSION};
        this.changed = new signals.Signal;
        this.restore()
    },
    setDefaults: function () {
        if ("undefined" == typeof this.settings[this.EDITOR_AUTO_HIDE]) {
            this.settings[this.EDITOR_AUTO_HIDE] = false;
        }
        if ("undefined" == typeof this.settings[this.EDITOR_AUTO_SAVE]) {
            this.settings[this.EDITOR_AUTO_SAVE] = true;
        }
    },
    setValue: function (t, e) {
        if ("object" == typeof t) {
            $.extend(this.settings, t)
        } else {
            this.settings[t] = e;
        }
        this.save();
        this.changed.dispatch([t]);
    },
    getValue: function (t) {
        return this.settings[t]
    },
    removeValue: function (t) {
        if ("object" == typeof t) {
            if (t.length) {
                t.forEach(function (t) {
                    delete this.settings[t]
                }.bind(this))
            } else {
                delete this.settings[t];
            }
        }

        this.save();
        this.changed.dispatch([t]);
    },
    restore: function () {
        if (Modernizr.localstorage) {
            var t = localStorage.getItem(this.STORAGE_KEY);
            if (t) {
                var e = JSON.parse(localStorage.getItem(this.STORAGE_KEY));
                if (e) {
                    if (e.version === this.STORAGE_VERSION) {
                        this.settings = e;
                        this.setDefaults();
                        this.changed.dispatch();
                    }
                    else {
                        this.setDefaults();
                    }
                }
                this.save();
            }
        }
        this.setDefaults();
    },
    save: function () {
        if(Modernizr.localstorage){
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));
        }
    }
};