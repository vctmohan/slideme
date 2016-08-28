SL.util.anim = {
    collapseListItem: function (t, e, i) {
        t = $(t), t.addClass("no-transition"), t.css({overflow: "hidden"}), t.animate({
            opacity: 0,
            height: 0,
            minHeight: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0
        }, {duration: i || 500, complete: e})
    }
};
