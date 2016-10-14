SL.util.user = {
    isLoggedIn: function () {
        return "object" == typeof SLConfig && "object" == typeof SLConfig.current_user
    }, isPro: function () {
        return SL.util.user.isLoggedIn() ? SLConfig.current_user.pro : null
    }, isEnterprise: function () {
        return SL.util.user.isLoggedIn() ? SLConfig.current_user.enterprise : null
    }, canUseCustomCSS: function () {
        return this.isLoggedIn() && this.isPro()
    }
};