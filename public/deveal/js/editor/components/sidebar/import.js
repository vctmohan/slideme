SL("editor.components.sidebar").Import = SL.editor.components.sidebar.Base.extend({
    init: function () {
        this.domElement = $(".sidebar-panel .import"), this._super()
    }, setupFileImport: function () {
        this.importFile ? this.importFile.reset() : (this.importFile = new SL.editor.components.sidebar.ImportFile(this), this.importFile.importCompleted.add(this.onImportCompleted.bind(this)))
    }, setupRevealImport: function () {
        this.importReveal ? this.importReveal.reset() : (this.importReveal = new SL.editor.components.sidebar.ImportReveal(this), this.importReveal.importCompleted.add(this.onImportCompleted.bind(this)))
    }, open: function () {
        SL.view.isNewDeck() ? SL.view.save(function () {
            this.setupFileImport()
        }.bind(this)) : this.setupFileImport(), this.setupRevealImport(), this._super()
    }, close: function () {
        this._super()
    }, onImportCompleted: function () {
        this.close(), this.onclose.dispatch()
    }
});
