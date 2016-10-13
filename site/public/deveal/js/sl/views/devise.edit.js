SL("views.devise").Edit = SL.views.devise.All.extend({
    init: function () {
        this._super();
        $(".delete-account-toggle").on("click", this.onDeleteAccountToggleClicked.bind(this));
        $(".delete-profile-photo").on("click", this.onDeleteProfilePhotoClicked.bind(this));
        $("#user_email").on("change keyup", this.onEmailChanged.bind(this));
        $("#user_password").on("change keyup", this.onNewPasswordChanged.bind(this));
        this.undoAutoFill();
    },
    undoAutoFill: function () {
        if (navigator.userAgent.toLowerCase().indexOf("chrome") >= 0) {
            var t = window.setInterval(function () {
                var e = $("input:-webkit-autofill");
                if (e.length > 0) {
                    window.clearInterval(t);
                    e.each(function () {
                        var t = $(this).clone(!0, !0);
                        t.is("[type=password]") && t.val(""), $(this).after(t).remove();
                        var e = t.parent(".unit");
                        e.length && new SL.components.FormUnit(e)
                    });
                }
            }, 20);
        }
    },
    updatePasswordVerification: function () {
        var t = $("#user_email").parents(".unit");
        e = $("#user_password").parents(".unit");
        i = $("#user_current_password").parents(".unit");
        n = t.data("controller");
        s = e.data("controller");
        n && s && n.isUnchanged() && s.isUnchanged() ? (i.removeAttr("data-required"), i.addClass("hidden")) : (i.attr("data-required", "true"), i.removeClass("hidden"))
    },
    onDeleteAccountToggleClicked: function (t) {
        t.preventDefault();
        $(".delete-account").toggleClass("visible");
    },
    onDeleteProfilePhotoClicked: function (t) {
        t.preventDefault();
        $.ajax({
            url: SL.config.AJAX_UPDATE_USER,
            type: "PUT",
            context: this,
            data: {user: {profile_photo: ""}}
        }).done(function () {
            $(".photo-editor").attr("data-photo-type", "avatar")
        }).fail(function () {
            SL.notify("An error occured while saving", "negative")
        })
    },
    onEmailChanged: function () {
        this.updatePasswordVerification();
    },
    onNewPasswordChanged: function () {
        this.updatePasswordVerification();
    }
});