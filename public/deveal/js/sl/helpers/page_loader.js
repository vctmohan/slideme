SL.helpers.PageLoader = {
    show: function (t) {
        t = $.extend({style: null, message: null}, t);
        var e = $(".page-loader");

        if(0 === e.length){
            e = $(['<div class="page-loader">', '<div class="page-loader-inner hidden">', '<p class="page-loader-message"></p>', '<div class="page-loader-spinner spinner"></div>', "</div>", "</div>"].join("")).appendTo(document.body);
        setTimeout(function () {
                e.find(".page-loader-inner").removeClass("hidden")
            }, 1);
        }

        if(t.container) {
            e.appendTo(t.container);
        }

        if(t.message){
            e.find(".page-loader-message").html(t.message);
        }

        if(t.style){
            e.attr("data-style", t.style);
        }

        clearTimeout(this.hideTimeout);
        e.removeClass("frozen");
        e.addClass("visible");

    },
    hide: function () {
        $(".page-loader").removeClass("visible");
        clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(function () {
            $(".page-loader").addClass("frozen");
        }.bind(this), 1e3);
    },
    waitForFonts: function (t) {
        if (SL.fonts.isReady() === false) {
            this.show(t);
            SL.fonts.ready.add(this.hide);
        }
    }
}