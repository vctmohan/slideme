SL.session = {
    enforce: function () {
        this.enforced = true;
        this.hasLoggedOut = false;
        this.loginInterval = setInterval(this.check.bind(this), SL.config.LOGIN_STATUS_INTERVAL);
    },
    check: function () {
        $.get(SL.config.AJAX_CHECK_STATUS).done(function (data) {
            if (data) {
                if (data.user_signed_in) {
                    this.onLoggedIn();
                } else {
                    this.onLoggedOut();
                }
            }
        }.bind(this))
    },
    onLoggedIn: function () {
        if(this.hasLoggedOut){
            this.hasLoggedOut = false;
            SL.popup.close(SL.components.popup.SessionExpired);
        }
    },
    onLoggedOut: function () {
       this.hasLoggedOut = true;
        SL.popup.open(SL.components.popup.SessionExpired);
    }
};