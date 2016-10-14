SL.notify = function (t, e) {
    return $(".sl-notifications .sl-notification").last().html() === t && $(".sl-notifications .sl-notification").last().remove(), "string" == typeof e && (e = {type: e}), new SL.components.Notification(t, e)
};