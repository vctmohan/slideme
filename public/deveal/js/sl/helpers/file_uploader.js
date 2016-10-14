SL("helpers").FileUploader = Class.extend({
    init: function (t) {
        this.options = $.extend({
            formdata: true,
            contentType: false,
            external: false,
            method: "POST"
        }, t);
        if ("undefined" == typeof this.options.file || "undefined" == typeof this.options.service) {
            throw"File and service must be defined for FileUploader task.";
        }

        this.timeout = -1;
        this.uploading = false;
        this.onUploadSuccess = this.onUploadSuccess.bind(this);
        this.onUploadProgress = this.onUploadProgress.bind(this);
        this.onUploadError = this.onUploadError.bind(this);
        this.failed = new signals.Signal;
        this.succeeded = new signals.Signal;
        this.progressed = new signals.Signal;
    },
    upload: function () {
        this.uploading = true;
        clearTimeout(this.timeout);
        if ("number" == typeof this.options.timeout) {
            this.timeout = setTimeout(this.onUploadError, this.options.timeout);
            this.xhr = new XMLHttpRequest;
            this.xhr.onload = function () {
                if (this.options.external === true)this.onUploadSuccess(); else if (422 === this.xhr.status || 500 === this.xhr.status)this.onUploadError(); else {
                    try {
                        var t = JSON.parse(this.xhr.responseText)
                    } catch (e) {
                        return this.onUploadError()
                    }
                    this.onUploadSuccess(t)
                }
            }.bind(this);
            this.xhr.onerror = this.onUploadError;
            this.xhr.upload.onprogress = this.onUploadProgress;
            this.xhr.open(this.options.method, this.options.service, true);
            if (this.options.contentType) {
                var t = "string" == typeof this.options.contentType ? this.options.contentType : this.options.file.type;
                t && this.xhr.setRequestHeader("Content-Type", t)
            }
        }
        /* if ("number" == typeof this.options.timeout && (this.timeout = setTimeout(this.onUploadError, this.options.timeout)), this.xhr = new XMLHttpRequest, this.xhr.onload = function () {
         if (this.options.external === true)this.onUploadSuccess(); else if (422 === this.xhr.status || 500 === this.xhr.status)this.onUploadError(); else {
         try {
         var t = JSON.parse(this.xhr.responseText)
         } catch (e) {
         return this.onUploadError()
         }
         this.onUploadSuccess(t)
         }
         }.bind(this), this.xhr.onerror = this.onUploadError, this.xhr.upload.onprogress = this.onUploadProgress, this.xhr.open(this.options.method, this.options.service, true), this.options.contentType) {
         var t = "string" == typeof this.options.contentType ? this.options.contentType : this.options.file.type;
         t && this.xhr.setRequestHeader("Content-Type", t)
         }*/
        if (this.options.formdata) {
            var e = new FormData;
            this.options.filename ? e.append("file", this.options.file, this.options.filename) : e.append("file", this.options.file);
            var i = this.options.csrf || document.querySelector('meta[name="csrf-token"]');
            i && !this.options.external && e.append("authenticity_token", i.getAttribute("content"));
            this.xhr.send(e);
        } else {
            this.xhr.send(this.options.file)
        }
    },
    isUploading: function () {
        return this.uploading
    },
    onUploadSuccess: function (t) {
        console.log(t);
        clearTimeout(this.timeout);
        this.uploading = false;
        this.succeeded.dispatch(t);
    },
    onUploadProgress: function (t) {
        t.lengthComputable && this.progressed.dispatch(t.loaded / t.total)
    },
    onUploadError: function () {
        clearTimeout(this.timeout), this.uploading = false, this.failed.dispatch()
    },
    destroy: function () {
        if (clearTimeout(this.timeout), this.xhr) {
            var t = function () {
            };
            this.xhr.onload = t, this.xhr.onerror = t, this.xhr.upload.onprogress = t, this.xhr.abort()
        }
        this.succeeded.dispose(), this.progressed.dispose(), this.failed.dispose()
    }
})