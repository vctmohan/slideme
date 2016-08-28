SL.pointer = {
    down: false,
    downTimeout: -1,
    init: function () {
        $(document).on("mousedown", this.onMouseDown.bind(this));
        $(document).on("mouseleave", this.onMouseLeave.bind(this));
        $(document).on("mouseup", this.onMouseUp.bind(this));
    }, 
    isDown: function () {
        return this.down
    }, 
    onMouseDown: function () {
        clearTimeout(this.downTimeout);
        this.down = true;
        this.downTimeout = setTimeout(function () {
            this.down = false
        }.bind(this), 3e4);
    }, 
    onMouseLeave: function () {
        clearTimeout(this.downTimeout);
        this.down = false;
    }, 
    onMouseUp: function () {
        clearTimeout(this.downTimeout);
        this.down = false;
    }
};