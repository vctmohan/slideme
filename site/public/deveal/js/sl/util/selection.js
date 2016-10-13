SL.util.selection = {
    clear: function () {
        window.getSelection && (window.getSelection().empty ? window.getSelection().empty() : window.getSelection().removeAllRanges && window.getSelection().removeAllRanges())
    }, moveCursorToEnd: function (t) {
        if (t) {
            t.focus();
            var e = document.createRange();
            e.selectNodeContents(t), e.collapse(false), selection = window.getSelection(), selection.removeAllRanges(), selection.addRange(e)
        }
    }, selectText: function (t) {
        var e, i;
        document.body.createTextRange ? (e = document.body.createTextRange(), e.moveToElementText(t), e.select()) : window.getSelection && (i = window.getSelection(), e = document.createRange(), e.selectNodeContents(t), i.removeAllRanges(), i.addRange(e))
    }, getSelectedElement: function () {
        var t = window.getSelection();
        return t && t.anchorNode ? t.anchorNode.parentNode : null
    }, getSelectedTags: function () {
        var t = SL.util.selection.getSelectedElement(), e = [];
        if (t)for (; t;)e.push(t.nodeName.toLowerCase()), t = t.parentNode;
        return e
    }, getSelectedHTML: function () {
        var t;
        if (document.selection && document.selection.createRange)return t = document.selection.createRange(), t.htmlText;
        if (window.getSelection) {
            var e = window.getSelection();
            if (e.rangeCount > 0) {
                t = e.getRangeAt(0);
                var i = t.cloneContents(), n = document.createElement("div");
                return n.appendChild(i), n.innerHTML
            }
        }
        return ""
    }
};