SL.util.math = {
    limitDecimals: function (t, e) {
        var i = Math.pow(10, e);
        return Math.round(t * i) / i
    }
};