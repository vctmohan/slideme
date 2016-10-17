SL("models").Media = SL.models.Model.extend({
    uploadStatus: "",
    uploadFile: null,
    init: function (t, e, i, n) {
        this._super(t);
        this.crud = $.extend({
            create: SL.config.AJAX_MEDIA_CREATE,
            update: SL.config.AJAX_MEDIA_UPDATE,
            "delete": SL.config.AJAX_MEDIA_DELETE
        }, e);
        if (i) {
            this.uploadStatus = SL.models.Media.STATUS_UPLOAD_WAITING;
            this.uploadFile = i;
            this.uploadFilename = n;
        } else {
            this.uploadStatus = SL.models.Media.STATUS_UPLOADED;
        }
        this.uploadStarted = new signals.Signal;
        this.uploadProgressed = new signals.Signal;
        this.uploadCompleted = new signals.Signal;
        this.uploadFailed = new signals.Signal;
    },
    upload: function () {
        if (/\.svg$/i.test(this.uploadFile.name) && window.FileReader) {
            this.reader = new window.FileReader;
            this.reader.addEventListener("abort", this.uploadValidated.bind(this));
            this.reader.addEventListener("error", this.uploadValidated.bind(this));
            this.reader.addEventListener("load", function (t) {
                var e = t.target.result;
                e && e.length && (e = e.replace(/\<(\?xml|(\!DOCTYPE[^\>\[]+(\[[^\]]+)?))+[^>]+\>/g, ""));
                var i = $("<div>" + e + "</div>").find("svg").get(0);
                if (i) {
                    $(i).parent().find("*").contents().each(function () {
                        8 === this.nodeType && $(this).remove()
                    }), $(i).find("style, script").remove(), $(i).removeAttr("content"), $(i).find("[unicode]").each(function () {
                        this.setAttribute("unicode", SL.util.escapeHTMLEntities(this.getAttribute("unicode")))
                    });
                    var n = i.getAttribute("width"), s = i.getAttribute("height"), o = i.hasAttribute("xmlns"), a = i.hasAttribute("viewBox");
                    if (hasWidthAndHeight = n && s, o || i.setAttribute("xmlns", "http://www.w3.org/2000/svg"), hasWidthAndHeight && (/[^\d]/g.test(n) || /[^\d]/g.test(s)) && (i.setAttribute("width", parseFloat(n)), i.setAttribute("height", parseFloat(s))), !a && hasWidthAndHeight && (i.setAttribute("viewBox", [0, 0, i.getAttribute("width"), i.getAttribute("height")].join(" ")), a = !0), !hasWidthAndHeight && a) {
                        var r = i.getAttribute("viewBox").split(" ");
                        4 === r.length && (i.setAttribute("width", r[2]), i.setAttribute("height", r[3]), hasWidthAndHeight = !0)
                    }
                    if (a && hasWidthAndHeight) {
                        var l = '<?xml version="1.0"?>\n' + i.parentNode.innerHTML;
                        this.uploadFilename = this.uploadFile.name || "image.svg", this.uploadFile = new Blob([l], {type: "image/svg+xml"}), this.uploadValidated()
                    } else this.uploadStatus = SL.models.Media.STATUS_UPLOAD_FAILED, this.uploadFailed.dispatch("SVG error: missing viewBox or width/height")
                } else this.uploadStatus = SL.models.Media.STATUS_UPLOAD_FAILED, this.uploadFailed.dispatch("Invalid SVG: missing &lt;svg&gt; element");
                this.reader = null
            }.bind(this));
            this.reader.readAsText(this.uploadFile, "UTF-8");
        } else {
            this.uploadValidated();
        }
    },
    uploadValidated: function () {
        if(this.uploader){
            return false;
        }
        
        this.uploader = new SL.helpers.FileUploader({
            file: this.uploadFile,
            filename: this.uploadFilename,
            service: this.crud.create,
            timeout: 6e4
        });
        this.uploader.progressed.add(this.onUploadProgress.bind(this));
        this.uploader.succeeded.add(this.onUploadSuccess.bind(this));
        this.uploader.failed.add(this.onUploadError.bind(this));
        this.uploader.upload();
        this.uploadStatus = SL.models.Media.STATUS_UPLOADING;
        this.uploadStarted.dispatch();
    },
    onUploadProgress: function (t) {
        this.uploadProgressed.dispatch(t)
    },
    onUploadSuccess: function (t) {
        this.uploader.destroy();
        this.uploader = null;
        for (var e in t){
            this.set(e, t[e]);
        }
        this.uploadStatus = SL.models.Media.STATUS_UPLOADED;
        this.uploadCompleted.dispatch();
    },
    onUploadError: function () {
        this.uploader.destroy();
        this.uploader = null;
        this.uploadStatus = SL.models.Media.STATUS_UPLOAD_FAILED;
        this.uploadFailed.dispatch();
    },
    isWaitingToUpload: function () {
        return this.uploadStatus === SL.models.Media.STATUS_UPLOAD_WAITING
    },
    isUploading: function () {
        return this.uploadStatus === SL.models.Media.STATUS_UPLOADING
    },
    isUploaded: function () {
        return this.uploadStatus === SL.models.Media.STATUS_UPLOADED
    },
    isUploadFailed: function () {
        return this.uploadStatus === SL.models.Media.STATUS_UPLOAD_FAILED
    },
    isImage: function () {
        return /^image\//.test(this.get("content_type"))
    },
    isSVG: function () {
        return /^image\/svg/.test(this.get("content_type"))
    },
    isVideo: function () {
        return /^video\//.test(this.get("content_type"))
    },
    clone: function () {
        return new SL.models.Media(JSON.parse(JSON.stringify(this.data)))
    },
    save: function (t) {
        var e = {media: {}};
        return t ? t.forEach(function (t) {
            e.media[t] = this.get(t)
        }.bind(this)) : e.media = this.toJSON(), $.ajax({
            url: this.crud.update(this.get("id")),
            type: "PUT",
            data: e
        })
    },
    destroy: function () {
        return this.uploadFile = null, this.uploadStarted && this.uploadStarted.dispose(), this.uploadProgressed && this.uploadProgressed.dispose(), this.uploadCompleted && this.uploadCompleted.dispose(), this.uploadFailed && this.uploadFailed.dispose(), this.uploader && (this.uploader.destroy(), this.uploader = null), $.ajax({
            url: this.crud["delete"](this.get("id")),
            type: "DELETE"
        })
    }
});
SL.models.Media.STATUS_UPLOAD_WAITING = "waiting";
SL.models.Media.STATUS_UPLOADING = "uploading";
SL.models.Media.STATUS_UPLOADED = "uploaded";
SL.models.Media.STATUS_UPLOAD_FAILED = "upload-failed";
SL.models.Media.IMAGE = {
    id: "image",
    filter: function (t) {
        return t.isImage()
    }
};
SL.models.Media.SVG = {
    id: "svg", filter: function (t) {
        return t.isSVG()
    }
};
SL.models.Media.VIDEO = {
    id: "video", filter: function (t) {
        return t.isVideo()
    }
};