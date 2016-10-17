SL("components").Kudos = function () {
    function init() {
        $("[data-kudos-value][data-kudos-id]").each(function (t, e) {
            var i = e.getAttribute("data-kudos-id");
            i && !a[i] && (a[i] = e.getAttribute("data-kudos-value"))
        }.bind(this));
        $(".kudos-trigger[data-kudos-id]").on("click", function (t) {
            var n = t.currentTarget;
            "true" === n.getAttribute("data-kudoed-by-user") ? i(n.getAttribute("data-kudos-id")) : e(n.getAttribute("data-kudos-id"))
        }.bind(this));
    }

    function e(t) {
        n(t);
        $.ajax({
            type: "POST",
            url: SL.config.AJAX_KUDO_DECK(t),
            context: this
        }).fail(function () {
            s(t);
            SL.notify(SL.locale.get("GENERIC_ERROR"));
        })
    }

    function i(t) {
        s(t), $.ajax({
            type: "DELETE",
            url: SL.config.AJAX_UNKUDO_DECK(t),
            context: this
        }).fail(function () {
            n(t), SL.notify(SL.locale.get("GENERIC_ERROR"))
        })
    }

    function n(t) {
        var e = $('.kudos-trigger[data-kudos-id="' + t + '"]');
        e.attr("data-kudoed-by-user", "true"), a[t]++, o(t, a[t]);
        var i = e.find(".kudos-icon");
        i.length && (i.removeClass("bounce"), setTimeout(function () {
            i.addClass("bounce")
        }, 1))
    }

    function s(t) {
        var e = $('.kudos-trigger[data-kudos-id="' + t + '"]');
        e.attr("data-kudoed-by-user", "false"), a[t]--, o(t, a[t]), e.find(".kudos-icon").removeClass("bounce")
    }

    function o(t, e) {
        "number" == typeof a[t] && ("number" == typeof e && (a[t] = e), e = Math.max(a[t], 0), $("[data-kudos-id][data-kudos-value]").each(function (t, i) {
            i.setAttribute("data-kudos-value", e)
        }))
    }

    var a = {};
    init()
}();