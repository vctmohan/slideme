SL("views.devise").All = SL.views.Base.extend({
    init: function () {
        this._super();
        this.setupForm();
        $(".auth-button.email.toggle").on("vclick", function (t) {
            t.preventDefault();
            var e = $(".auth-option.email-auth");
            e.toggleClass("hidden");
            e.hasClass("hidden") === !1 && e.find('input[type="text"], input[type="email"]').first().focus()
        });
    }, 
    setupForm: function () {
        if (this.formElement = $("form"), this.formElement.length) {
            this.formElement.find(".unit[data-validate]").each(function (t, e) {
                new SL.components.FormUnit(e)
            });
            var t = this.formElement.find("button[type=submit]");
            t.length && this.formElement.on("submit", function (e) {
                if (!e.isDefaultPrevented()) {
                    if ($(".g-recaptcha").length && "undefined" != typeof window.grecaptcha && "function" == typeof window.grecaptcha.getResponse && !grecaptcha.getResponse()) {
                        return SL.notify("Please answer the reCAPTCHA to prove you're not a robot"), e.preventDefault(), !1;
                    }
                    Ladda.create(t.get(0)).start()
                }
            }.bind(this))
        }
    }
});