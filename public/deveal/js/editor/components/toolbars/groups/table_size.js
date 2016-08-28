SL("editor.components.toolbars.groups").TableSize = SL.editor.components.toolbars.groups.Base.extend({
    init: function (e, t) {
        this._super(e, $.extend({
            type: "table-size",
            expandable: false,
            items: [SL.editor.components.toolbars.options.TableCols, SL.editor.components.toolbars.options.TableRows]
        }, t)), this.options[0].domElement.after('<div class="cross">x</div>'), this.setupBackfill(), this.setupPreview()
    }, sync: function () {
        this._super(), this.refreshPreview()
    }, setupBackfill: function () {
        this.options.forEach(function (e) {
            e.changeStarted.add(this.refreshBackfill.bind(this)), e.changeEnded.add(this.refreshBackfill.bind(this))
        }.bind(this))
    }, refreshBackfill: function () {
        var e = this.options.some(function (e) {
            return e.isChanging()
        }.bind(this));
        e ? this.block.enableBackfill() : this.block.disableBackfill()
    }, setupPreview: function () {
        this.canvasElement = $('<canvas class="table-preview"></canvas>').appendTo(this.domElement), this.canvas = this.canvasElement.get(0), this.canvasContext = this.canvas.getContext("2d"), this.refreshPreview = this.refreshPreview.bind(this), this.block.tableSizeChanged.add(this.refreshPreview), this.block.tableHeaderChanged.add(this.refreshPreview), this.options.forEach(function (e) {
            e.changed.add(this.refreshPreview)
        }.bind(this))
    }, refreshPreview: function () {
        var e = Math.round(this.domElement.width()), t = Math.round(.8 * e);
        this.canvas.style.width = e + "px", this.canvas.style.height = t + "px", e *= 2, t *= 2, this.canvas.width = e, this.canvas.height = t, this.canvasContext.clearRect(0, 0, e, t);
        for (var i = this.block.get("attribute.data-table-cols"), n = this.block.get("attribute.data-table-rows"), r = this.block.get("attribute.data-table-has-header"), o = 4, s = e / i, a = t / n, l = 0; i > l; l++)for (var c = 0; n > c; c++)this.canvasContext.fillStyle = r && 0 === c ? "#555" : "#444", this.canvasContext.fillRect(l * s + o / 2, c * a + o / 2, s - o, a - o)
    }, destroy: function () {
        this.block.tableSizeChanged && this.block.tableSizeChanged.remove(this.refreshPreview), this.options.forEach(function (e) {
            e.changed.remove(this.refreshPreview)
        }.bind(this)), this._super()
    }
});