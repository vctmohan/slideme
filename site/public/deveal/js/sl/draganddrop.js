SL.draganddrop = {
    init: function () {
        this.listeners = new SL.collections.Collection;
        this.onDragStart = this.onDragStart.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragOut = this.onDragOut.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.isListening = false;
        this.isInternalDrag = false;
    }, subscribe: function (t) {
        this.listeners.push(t);
        this.bind();
    }, unsubscribe: function (t) {
        this.listeners.remove(t), this.listeners.isEmpty() && this.unbind()
    }, dispatch: function (t, e) {
        var i = this.listeners.last();
        i && i[t](e)
    }, bind: function () {
        this.isListening === false && (this.isListening = true, $(document.documentElement).on("dragstart", this.onDragStart).on("dragover dragenter", this.onDragOver).on("dragleave", this.onDragOut).on("drop", this.onDrop))
    }, unbind: function () {
        this.isListening === true && (this.isListening = false, $(document.documentElement).off("dragstart", this.onDragStart).off("dragover dragenter", this.onDragOver).off("dragleave", this.onDragOut).off("drop", this.onDrop))
    }, onDragStart: function (t) {
        t.preventDefault(), this.isInternalDrag = true
    }, onDragOver: function (t) {
        this.isInternalDrag || (t.preventDefault(), this.dispatch("onDragOver", t))
    }, onDragOut: function (t) {
        this.isInternalDrag || (t.preventDefault(), this.dispatch("onDragOut", t))
    }, onDrop: function (t) {
        return this.isInternalDrag ? void 0 : (t.stopPropagation(), t.preventDefault(), this.isInternalDrag = false, this.dispatch("onDrop", t), false)
    }
};