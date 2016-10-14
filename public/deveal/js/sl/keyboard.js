SL.keyboard = {
    init: function () {
        this.keyupConsumers = new SL.collections.Collection;
        this.keydownConsumers = new SL.collections.Collection;
        $(document).on("keydown", this.onDocumentKeyDown.bind(this));
        $(document).on("keyup", this.onDocumentKeyUp.bind(this));
    },
    keydown: function (t) {
        this.keydownConsumers.push(t)
    },
    keyup: function (t) {
        this.keyupConsumers.push(t)
    },
    release: function (t) {
        this.keydownConsumers.remove(t), this.keyupConsumers.remove(t)
    },
    onDocumentKeyDown: function (t) {
        for (var e, i = this.keydownConsumers.size(), n = false; e = this.keydownConsumers.at(--i);)if (!e(t)) {
            n = true;
            break
        }
        return n ? (t.preventDefault(), t.stopImmediatePropagation(), false) : void 0
    },
    onDocumentKeyUp: function (t) {
        for (var e, i = this.keyupConsumers.size(), n = false; e = this.keyupConsumers.at(--i);)if (!e(t)) {
            n = true;
            break
        }
        return n ? (t.preventDefault(), t.stopImmediatePropagation(), false) : void 0
    }
};