SL("views.subscriptions").New = SL.views.Base.extend({
    init: function () {
        this._super();
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onStripeResponse = this.onStripeResponse.bind(this);
        this.formElement = $("#payment-form");
        this.formElement.on("submit", this.onFormSubmit);
        this.formSubmitButton = this.formElement.find("button[type=submit]");
        this.formSubmitLoader = Ladda.create(this.formSubmitButton.get(0));
        $("#stripe-card-number").payment("formatCardNumber");
        $("#stripe-card-cvc").payment("formatCardCVC");
        SL.util.device.supportedByEditor() || $(".column").prepend("<section class=\"critical-error\"><h2>Not supported</h2><p>It looks like you're using a browser which isn't suported by the Slides editor. Please make sure to try the editor before upgrading.</p></section>"), $("html").hasClass("subscriptions new") && ($('input[name="subscription[billing_period]"]').on("change", this.syncSubmitButton.bind(this)), this.syncSubmitButton())
    }, syncSubmitButton: function () {
        var t = this.formElement.find('input[name="subscription[billing_period]"]:checked'), e = t.attr("data-period-value"), i = t.attr("data-usd-value"), n = this.formElement.find(".devise-note");
        0 === n.length && (n = $('<div class="devise-note">').insertAfter(this.formElement.find(".actions"))), e && i ? n.html("You are starting a <strong>" + e + "</strong> subscription and will be charged <strong>$" + i + "</strong> today.") : n.remove()
    }, onFormSubmit: function (t) {
        return this.formSubmitLoader.start(), Stripe.createToken(this.formElement, this.onStripeResponse), t.preventDefault(), false
    }, onStripeResponse: function (t, e) {
        if (e.error)SL.notify(e.error.message, "negative"), this.formSubmitLoader.stop(); else {
            var i = e.id;
            this.formElement.find('input[name="subscription[token]"]').remove(), this.formElement.append($('<input type="hidden" name="subscription[token]" />').val(i)), this.formElement.get(0).submit()
        }
    }
});