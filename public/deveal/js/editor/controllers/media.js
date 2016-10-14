SL("editor.controllers").Media = {
    init: function () {
        this.setupDragAndDrop(), this.setupPasteFromClipboard()
    }, canDragAndDrop: function () {
        return !SL.popup.isOpen(SL.editor.components.medialibrary.MediaLibrary)
    }, setupDragAndDrop: function () {
        var e = $(['<div class="drag-and-drop-instructions">', '<div class="inner">', "Drop to insert media", "</div>", "</div>"].join(""));
        SL.draganddrop.subscribe({
            onDragOver: function () {
                e.appendTo(document.body)
            }.bind(this), onDragOut: function () {
                e.remove()
            }.bind(this), onDrop: function (t) {
                e.remove();
                var i = t.originalEvent.dataTransfer.files[0];
                if (i) {
                    var n = new SL.models.Media(null, null, i);
                    n.upload();
                    var r = SL.editor.controllers.Blocks.add({
                        type: "image",
                        slide: $(SL.editor.controllers.Markup.getCurrentSlide())
                    });
                    r.setImageModel(n)
                }
            }.bind(this)
        })
    }, setupPasteFromClipboard: function () {
        $(document).on("paste", function (e) {
            if (setTimeout(function () {
                    $("img[src^=webkit-fake-url]").remove()
                }, 1), !SL.util.isTyping()) {
                var t = e.clipboardData.getData("text/plain");
                if ("string" == typeof t && t.length) {
                    var i = t.split("\n"), n = 0;
                    i = i.map(function (e) {
                        var t = e.split("	");
                        return n = Math.max(t.length, n), t
                    }), i.length > 1 && n > 1 && this.insertTableFromClipboard(i)
                }
            }
        }.bind(this)), $(document).pasteImageReader(function (e) {
            SL.util.isTyping() || e && e.file && e.dataURL && this.uploadImageBlob(e.file, "pasted-from-clipboard.png")
        }.bind(this))
    }, insertTableFromClipboard: function (e) {
        var t = SL.editor.controllers.Blocks.getFocusedBlocks();
        if (1 === t.length && "table" === t[0].getType())t[0].setRows(e); else {
            SL.editor.controllers.Blocks.add({type: "table", blockOptions: {rows: e}})
        }
    }, uploadImageBlob: function (e, t) {
        if (e && t && e.type.match(/image.*/)) {
            var i = new SL.models.Media(null, null, e, t);
            i.upload();
            var n = SL.editor.controllers.Blocks.add({
                type: "image",
                slide: $(SL.editor.controllers.Markup.getCurrentSlide())
            });
            n.setImageModel(i)
        }
    }
};