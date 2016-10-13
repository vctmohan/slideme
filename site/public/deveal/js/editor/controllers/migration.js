SL("editor.controllers").Migration = {
    init: function () {
        this.migrateEditorSettings()
    }, migrateEditorSettings: function () {
        var e = "editorSnap", t = "editorGrid", i = SL.settings.getValue(t), n = SL.settings.getValue(e);
        ("boolean" == typeof i || "boolean" == typeof n) && (SL.settings.removeValue([t, e]), SL.current_user.settings.set("editor_grid", i), SL.current_user.settings.set("editor_snap", n), SL.current_user.settings.save(["editor_grid", "editor_snap"]))
    }
};