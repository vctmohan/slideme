SL("components").FormUnit = Class.extend({
    init: function (t) {
        this.domElement = $(t), this.inputElement = this.domElement.find("input, textarea").first(), this.errorElement = $('<div class="error">'), this.errorIcon = $('<span class="icon">!</span>').appendTo(this.errorElement), this.errorMessage = $('<p class="message">!</p>').appendTo(this.errorElement), this.validateType = this.domElement.attr("data-validate"), this.validateTimeout = -1, this.originalValue = this.inputElement.val(), this.originalError = this.domElement.attr("data-error-message"), this.asyncValidatedValue = null, this.clientErrors = [], this.serverErrors = [], this.inputElement.on("input", this.onInput.bind(this)), this.inputElement.on("change", this.onInputChange.bind(this)), this.inputElement.on("focus", this.onInputFocus.bind(this)), this.inputElement.on("blur", this.onInputBlur.bind(this)), this.inputElement.on("invalid", this.onInputInvalid.bind(this)), this.domElement.parents("form").first().on("submit", this.onFormSubmit.bind(this)), this.originalError && (this.domElement.removeClass("hidden"), this.validate(), this.inputElement.focus()), this.domElement.data("controller", this)
    }, validate: function (t) {
        clearTimeout(this.validateTimeout);
        var e = this.inputElement.val();
        if ("string" != typeof e)return this.serverErrors = [], this.clientErrors = [], void this.render();
        if (e === this.originalValue && (this.originalValue || "password" === this.validateType) && this.originalError)this.clientErrors = [this.originalError]; else if (e.length) {
            var i = SL.util.validate[this.validateType];
            "function" == typeof i ? this.clientErrors = i(e) : console.log('Could not find validation method of type "' + this.validateType + '"')
        } else this.clientErrors = [], t && this.isRequired() && this.clientErrors.push(SL.locale.FORM_ERROR_REQUIRED);
        return this.validateAsync(), this.render(), 0 === this.clientErrors.length && 0 === this.serverErrors.length
    }, validateAsync: function () {
        if ("username" === this.validateType) {
            var t = SLConfig && SLConfig.current_user ? SLConfig.current_user.username : "", e = this.inputElement.val();
            0 === SL.util.validate.username(e).length && (t && e === t ? (this.asyncValidatedValue = t, this.serverErrors = []) : e !== this.asyncValidatedValue && $.ajax({
                url: SL.config.AJAX_LOOKUP_USER,
                type: "GET",
                data: {id: e},
                context: this,
                statusCode: {
                    204: function () {
                        this.serverErrors = [SL.locale.get("FORM_ERROR_USERNAME_TAKEN")]
                    }, 404: function () {
                        this.serverErrors = []
                    }
                }
            }).complete(function () {
                this.render(), this.asyncValidatedValue = e
            }))
        } else if ("team_slug" === this.validateType) {
            var i = SL.current_team ? SL.current_team.get("slug") : "", n = this.inputElement.val();
            0 === SL.util.validate.team_slug(n).length && (i && n === i ? (this.asyncValidatedValue = i, this.serverErrors = []) : n !== this.asyncValidatedValue && $.ajax({
                url: SL.config.AJAX_LOOKUP_TEAM,
                type: "GET",
                data: {id: n},
                context: this,
                statusCode: {
                    204: function () {
                        this.serverErrors = [SL.locale.get("FORM_ERROR_ORGANIZATION_SLUG_TAKEN")]
                    }, 404: function () {
                        this.serverErrors = []
                    }
                }
            }).complete(function () {
                this.render(), this.asyncValidatedValue = n
            }))
        }
    }, render: function () {
        var t = this.serverErrors.concat(this.clientErrors);
        t.length ? (this.domElement.addClass("has-error"), this.errorElement.appendTo(this.domElement), this.errorMessage.text(t[0]), setTimeout(function () {
            this.errorElement.addClass("visible")
        }.bind(this), 1)) : (this.domElement.removeClass("has-error"), this.errorElement.removeClass("visible").remove())
    }, format: function () {
        if ("username" === this.validateType || "team_slug" === this.validateType) {
            var t = this.inputElement.val();
            t && this.inputElement.val(this.inputElement.val().toLowerCase())
        }
        if ("url" === this.validateType) {
            var t = this.inputElement.val();
            t && t.length > 2 && /^http(s?):\/\//gi.test(t) === !1 && this.inputElement.val("http://" + t)
        }
    }, focus: function () {
        this.inputElement.focus()
    }, beforeSubmit: function () {
        return this.validate(!0), this.clientErrors.length > 0 || this.serverErrors.length > 0 ? (this.focus(), !1) : !0
    }, renderImage: function () {
        var t = this.inputElement.get(0);
        if (t.files && t.files[0]) {
            var e = new FileReader;
            e.onload = function (t) {
                var e = this.domElement.find("img"), i = t.target.result;
                e.length ? e.attr("src", i) : $('<img src="' + i + '">').appendTo(this.domElement.find(".image-uploader"))
            }.bind(this), e.readAsDataURL(t.files[0])
        }
    }, isRequired: function () {
        return !this.domElement.hasClass("hidden") && this.domElement.is("[data-required]")
    }, isUnchanged: function () {
        return this.inputElement.val() === this.originalValue
    }, onInput: function () {
        if (clearTimeout(this.validateTimeout), !SL.util.device.IS_PHONE && !SL.util.device.IS_TABLET) {
            var t = 600;
            (this.clientErrors.length || this.serverErrors.length) && (t = 300), this.validateTimeout = setTimeout(this.validate.bind(this), t)
        }
    }, onInputChange: function (t) {
        this.domElement.hasClass("image") && this.renderImage(t.target), this.validate()
    }, onInputFocus: function () {
        this.domElement.addClass("focused")
    }, onInputBlur: function () {
        this.format(), this.domElement.removeClass("focused")
    }, onInputInvalid: function () {
        return this.beforeSubmit()
    }, onFormSubmit: function (t) {
        return this.beforeSubmit() === !1 ? (t.preventDefault(), !1) : void 0
    }
});