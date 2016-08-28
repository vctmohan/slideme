SL.warnings = {
    STORAGE_KEY: "slides-last-warning-id",
    MESSAGE_ID: 23,
    init: function () {
        this.showMessage()
    },
    showMessage: function () {
        if (this.hasMessage() && !this.hasExpired() && SL.util.user.isLoggedIn() && Modernizr.localstorage) {
            var t = parseInt(localStorage.getItem(this.STORAGE_KEY), 10) || 0;
            if (t < this.MESSAGE_ID) {
                var e = SL.notify(this.MESSAGE_TEXT, {optional: false});
                e.destroyed.add(this.hideMessage.bind(this))
            }
        }
    },
    hideMessage: function () {
        Modernizr.localstorage && localStorage.setItem(this.STORAGE_KEY, this.MESSAGE_ID)
    },
    hasMessage: function () {
        return !!this.MESSAGE_TEXT
    },
    hasExpired: function () {
        return this.MESSAGE_EXPIRY ? moment().diff(moment(this.MESSAGE_EXPIRY)) > 0 : false
    }
};