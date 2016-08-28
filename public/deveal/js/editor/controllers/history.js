SL("editor.controllers").History = {
    MAX_SIZE: 100,
    MAX_FREQUENCY: 1500,
    MODE_RESTING: 1,
    MODE_UNDOING: 2,
    MODE_REDOING: 3,
    init: function () {
        this.past = [], this.future = [], this.mode = SL.editor.controllers.History.MODE_RESTING, this.lastPushTime = -1, this.changed = new signals.Signal, this.undid = new signals.Signal, this.redid = new signals.Signal
    },
    push: function (e, t) {
        t = t || {};
        var i = Date.now();
        if (i - this.lastPushTime > SL.editor.controllers.History.MAX_FREQUENCY || t.skipTimeLimit) {
            this.lastPushTime = Date.now();
            var n = {data: e, indices: Reveal.getIndices()};
            n.focusedBlocks = SL.editor.controllers.Blocks.getFocusedBlocks().map(function (e) {
                return e.getID()
            });
            var r = SL.editor.controllers.Mode.get();
            r && (n.mode = r.id);
            var o = this.past[this.past.length - 1], s = this.future[this.future.length - 1];
            for (o && n.data === o.data || s && n.data === s.data || (this.future.length && this.past.push(this.future.pop()), this.future.length = 0, this.past.push(n), this.mode = SL.editor.controllers.History.MODE_RESTING, this.changed.dispatch()); this.past.length > SL.editor.controllers.History.MAX_SIZE;)this.past.shift()
        }
    },
    undo: function (e) {
        e = e || {};
        var t = this.past.pop();
        return t && this.mode !== SL.editor.controllers.History.MODE_UNDOING && (this.future.push(t), t = this.past.pop()), t && (this.mode = SL.editor.controllers.History.MODE_UNDOING, this.future.push(t), this.lastPushTime = Date.now(), e.ignoreMode && (t = JSON.parse(JSON.stringify(t)), t.mode = null), this.undid.dispatch(t), this.changed.dispatch()), t
    },
    redo: function (e) {
        e = e || {};
        var t = this.future.pop();
        return t && this.mode !== SL.editor.controllers.History.MODE_REDOING && (this.past.push(t), t = this.future.pop()), t && (this.mode = SL.editor.controllers.History.MODE_REDOING, this.past.push(t), this.lastPushTime = Date.now(), e.ignoreMode && (t = JSON.parse(JSON.stringify(t)), t.mode = null), this.redid.dispatch(t), this.changed.dispatch()), t
    },
    canUndo: function () {
        return this.past.length > 1 || 1 === this.past.length && this.deckHasChanged()
    },
    canRedo: function () {
        return this.future.length > 0
    },
    deckHasChanged: function () {
        return this.past[this.past.length - 1].data !== SL.editor.controllers.Serialize.getDeckAsString()
    }
};