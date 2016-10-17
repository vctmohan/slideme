SL.util = {
    noop: function () {
    }, getQuery: function () {
        var t = {};
        return location.search.replace(/[A-Z0-9\-]+?=([\w%\-]*)/gi, function (e) {
            t[e.split("=").shift()] = unescape(e.split("=").pop())
        }), t
    }, getMetaKeyName: function () {
        return SL.util.device.isMac() ? "&#8984" : "CTRL"
    }, escapeHTMLEntities: function (t) {
        return t = t || "", t = t.split("<").join("&lt;"), t = t.split(">").join("&gt;")
    }, unescapeHTMLEntities: function (t) {
        return (t || "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&cent;/g, "\xa2").replace(/&pound;/g, "\xa3").replace(/&yen;/g, "\xa5").replace(/&euro;/g, "\u20ac").replace(/&copy;/g, "\xa9").replace(/&reg;/g, "\xae").replace(/&nbsp;/g, " ")
    }, toArray: function (t) {
        for (var e = [], i = 0, n = t.length; n > i; i++)e.push(t[i]);
        return e
    }, skipCSSTransitions: function (t, e) {
        t = $(t ? t : "html");
        var i = typeof t.get(0);
        ("undefined" === i || "number" === i) && console.warn("Bad target for skipCSSTransitions."), t.addClass("no-transition"), setTimeout(function () {
            t.removeClass("no-transition")
        }, e || 1)
    }, setupReveal: function (t) {
        if ("undefined" != typeof Reveal) {
            var e = {
                controls: true,
                progress: true,
                history: false,
                mouseWheel: false,
                margin: .05,
                autoSlideStoppable: true,
                dependencies: [{
                    src: SL.config.ASSET_URLS["reveal-plugins/markdown/marked.js"],
                    condition: function () {
                        return !!document.querySelector(".reveal [data-markdown]")
                    }
                }, {
                    src: SL.config.ASSET_URLS["reveal-plugins/markdown/markdown.js"],
                    condition: function () {
                        return !!document.querySelector(".reveal [data-markdown]")
                    }
                }, {
                    src: SL.config.ASSET_URLS["reveal-plugins/highlight/highlight.js"],
                    async: true,
                    condition: function () {
                        return !!document.querySelector(".reveal pre code")
                    },
                    callback: function () {
                        hljs.initHighlighting(), hljs.initHighlightingOnLoad()
                    }
                }]
            };
            if (SLConfig && SLConfig.deck && (e.autoSlide = SLConfig.deck.auto_slide_interval || 0, e.rollingLinks = SLConfig.deck.rolling_links, e.center = SLConfig.deck.center, e.loop = SLConfig.deck.should_loop, e.rtl = SLConfig.deck.rtl, e.showNotes = SLConfig.deck.share_notes, e.slideNumber = SLConfig.deck.slide_number, e.transition = SLConfig.deck.transition || "default", e.backgroundTransition = SLConfig.deck.background_transition), $.extend(e, t), SL.util.deck.injectNotes(), Reveal.initialize(e), Reveal.addEventListener("ready", function () {
                    window.STATUS = window.STATUS || {}, window.STATUS.REVEAL_IS_READY = true, $("html").addClass("reveal-is-ready")
                }), t && t.openLinksInTabs && this.openLinksInTabs($(".reveal .slides")), t && t.trackEvents) {
                var i = [];
                Reveal.addEventListener("slidechanged", function () {
                    var t = Reveal.getProgress();
                    t >= .5 && !i[0] && (i[0] = true), t >= 1 && !i[1] && (i[1] = true)
                })
            }
        }
    }, openLinksInTabs: function (t) {
        t && t.find("a").each(function () {
            var t = $(this), e = t.attr("href");
            /^#/gi.test(e) === true || this.hasAttribute("download") ? t.removeAttr("target") : /http|www/gi.test(e) ? t.attr("target", "_blank") : t.attr("target", "_top")
        })
    }, openPopupWindow: function (t, e, i, n) {
        var s = window.innerWidth / 2 - i / 2, o = window.innerHeight / 2 - n / 2;
        "number" == typeof window.screenX && (s += window.screenX, o += window.screenY);
        var a = window.open(t, e, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + i + ", height=" + n + ", top=" + o + ", left=" + s);
        return a.moveTo(s, o), a
    }, prefixSelectorsInStyle: function (t, e) {
        var i = [];
        SL.util.toArray(t.sheet.cssRules).forEach(function (t) {
            if (1 === t.type && t.selectorText && t.cssText) {
                var n = t.cssText;
                n = n.replace(t.selectorText, ""), n = n.trim(), n = n.slice(1, n.length - 1), n = n.trim(), n = n.split(";").map(function (t) {
                    return t = t.trim(), "" === t ? "" : "\n	" + t
                }).join(";");
                var s = t.selectorText.split(",").map(function (t) {
                    return t = t.trim(), 0 === t.indexOf(e) ? t : e + t
                }).join(", ");
                i.push(s + " {" + n + "\n}")
            } else 7 === t.type && t.cssText && i.push(t.cssText)
        }), t.innerHTML = "\n" + i.join("\n\n") + "\n"
    }, layoutReveal: function (t, e) {
        if (clearInterval(this.revealLayoutInterval), clearTimeout(this.revealLayoutTimeout), 1 === arguments.length)this.revealLayoutTimeout = setTimeout(Reveal.layout, t); else {
            if (2 !== arguments.length)throw"Illegal arguments, expected (duration[, fps])";
            this.revealLayoutInterval = setInterval(Reveal.layout, e), this.revealLayoutTimeout = setTimeout(function () {
                clearInterval(this.revealLayoutInterval)
            }.bind(this), t)
        }
    },
    getRevealSlideBounds: function (t, e) {
        t = t || SL.editor.controllers.Markup.getCurrentSlide();
        var i = t.offset();
        n = Reveal.getScale();
        s = i.left * n;
        o = i.top * n;
        if (e) {
            var a = $(".projector").offset();
            a && (s -= a.left, o -= a.top)
        }
        return {x: s, y: o, width: t.outerWidth() * n, height: t.outerHeight() * n}
    }, getRevealSlidesBounds: function (t) {
        var e = $(".reveal .slides"), i = e.offset(), n = Reveal.getScale(), s = i.left * n, o = i.top * n;
        if (t) {
            var a = $(".projector").offset();
            a && (s -= a.left, o -= a.top)
        }
        return {x: s, y: o, width: e.outerWidth() * n, height: e.outerHeight() * n}
    }, getRevealElementOffset: function (t, e) {
        t = $(t);
        var i = {x: 0, y: 0};
        if (t.parents("section").length)for (; t.length && !t.is("section");)i.x += t.get(0).offsetLeft, i.y += t.get(0).offsetTop, e && (i.x -= parseInt(t.css("margin-left"), 10), i.y -= parseInt(t.css("margin-top"), 10)), t = $(t.get(0).offsetParent);
        return i
    }, getRevealElementGlobalOffset: function (t) {
        var e = $(t), i = e.closest(".reveal"), n = {x: 0, y: 0};
        if (e.length && i.length) {
            var s = Reveal.getConfig(), o = Reveal.getScale(), a = i.get(0).getBoundingClientRect(), r = {
                x: a.left + a.width / 2,
                y: a.top + a.height / 2
            }, l = s.width * o, c = s.height * o;
            n.x = r.x - l / 2, n.y = r.y - c / 2;
            var d = e.cloSL.util = {
                noop: function () {
                }, getQuery: function () {
                    var t = {};
                    return location.search.replace(/[A-Z0-9\-]+?=([\w%\-]*)/gi, function (e) {
                        t[e.split("=").shift()] = unescape(e.split("=").pop())
                    }), t
                }, getMetaKeyName: function () {
                    return SL.util.device.isMac() ? "&#8984" : "CTRL"
                }, escapeHTMLEntities: function (t) {
                    return t = t || "", t = t.split("<").join("&lt;"), t = t.split(">").join("&gt;")
                }, unescapeHTMLEntities: function (t) {
                    return (t || "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&cent;/g, "\xa2").replace(/&pound;/g, "\xa3").replace(/&yen;/g, "\xa5").replace(/&euro;/g, "\u20ac").replace(/&copy;/g, "\xa9").replace(/&reg;/g, "\xae").replace(/&nbsp;/g, " ")
                }, toArray: function (t) {
                    for (var e = [], i = 0, n = t.length; n > i; i++)e.push(t[i]);
                    return e
                }, skipCSSTransitions: function (t, e) {
                    t = $(t ? t : "html");
                    var i = typeof t.get(0);
                    ("undefined" === i || "number" === i) && console.warn("Bad target for skipCSSTransitions."), t.addClass("no-transition"), setTimeout(function () {
                        t.removeClass("no-transition")
                    }, e || 1)
                }, setupReveal: function (t) {
                    if ("undefined" != typeof Reveal) {
                        var e = {
                            controls: true,
                            progress: true,
                            history: false,
                            mouseWheel: false,
                            margin: .05,
                            autoSlideStoppable: true,
                            dependencies: [{
                                src: SL.config.ASSET_URLS["reveal-plugins/markdown/marked.js"],
                                condition: function () {
                                    return !!document.querySelector(".reveal [data-markdown]")
                                }
                            }, {
                                src: SL.config.ASSET_URLS["reveal-plugins/markdown/markdown.js"],
                                condition: function () {
                                    return !!document.querySelector(".reveal [data-markdown]")
                                }
                            }, {
                                src: SL.config.ASSET_URLS["reveal-plugins/highlight/highlight.js"],
                                async: true,
                                condition: function () {
                                    return !!document.querySelector(".reveal pre code")
                                },
                                callback: function () {
                                    hljs.initHighlighting(), hljs.initHighlightingOnLoad()
                                }
                            }]
                        };
                        if (SLConfig && SLConfig.deck && (e.autoSlide = SLConfig.deck.auto_slide_interval || 0, e.rollingLinks = SLConfig.deck.rolling_links, e.center = SLConfig.deck.center, e.loop = SLConfig.deck.should_loop, e.rtl = SLConfig.deck.rtl, e.showNotes = SLConfig.deck.share_notes, e.slideNumber = SLConfig.deck.slide_number, e.transition = SLConfig.deck.transition || "default", e.backgroundTransition = SLConfig.deck.background_transition), $.extend(e, t), SL.util.deck.injectNotes(), Reveal.initialize(e), Reveal.addEventListener("ready", function () {
                                window.STATUS = window.STATUS || {}, window.STATUS.REVEAL_IS_READY = true, $("html").addClass("reveal-is-ready")
                            }), t && t.openLinksInTabs && this.openLinksInTabs($(".reveal .slides")), t && t.trackEvents) {
                            var i = [];
                            Reveal.addEventListener("slidechanged", function () {
                                var t = Reveal.getProgress();
                                t >= .5 && !i[0] && (i[0] = true), t >= 1 && !i[1] && (i[1] = true)
                            })
                        }
                    }
                }, openLinksInTabs: function (t) {
                    t && t.find("a").each(function () {
                        var t = $(this), e = t.attr("href");
                        /^#/gi.test(e) === true || this.hasAttribute("download") ? t.removeAttr("target") : /http|www/gi.test(e) ? t.attr("target", "_blank") : t.attr("target", "_top")
                    })
                }, openPopupWindow: function (t, e, i, n) {
                    var s = window.innerWidth / 2 - i / 2, o = window.innerHeight / 2 - n / 2;
                    "number" == typeof window.screenX && (s += window.screenX, o += window.screenY);
                    var a = window.open(t, e, "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" + i + ", height=" + n + ", top=" + o + ", left=" + s);
                    return a.moveTo(s, o), a
                }, prefixSelectorsInStyle: function (t, e) {
                    var i = [];
                    SL.util.toArray(t.sheet.cssRules).forEach(function (t) {
                        if (1 === t.type && t.selectorText && t.cssText) {
                            var n = t.cssText;
                            n = n.replace(t.selectorText, ""), n = n.trim(), n = n.slice(1, n.length - 1), n = n.trim(), n = n.split(";").map(function (t) {
                                return t = t.trim(), "" === t ? "" : "\n	" + t
                            }).join(";");
                            var s = t.selectorText.split(",").map(function (t) {
                                return t = t.trim(), 0 === t.indexOf(e) ? t : e + t
                            }).join(", ");
                            i.push(s + " {" + n + "\n}")
                        } else 7 === t.type && t.cssText && i.push(t.cssText)
                    }), t.innerHTML = "\n" + i.join("\n\n") + "\n"
                }, layoutReveal: function (t, e) {
                    if (clearInterval(this.revealLayoutInterval), clearTimeout(this.revealLayoutTimeout), 1 === arguments.length)this.revealLayoutTimeout = setTimeout(Reveal.layout, t); else {
                        if (2 !== arguments.length)throw"Illegal arguments, expected (duration[, fps])";
                        this.revealLayoutInterval = setInterval(Reveal.layout, e), this.revealLayoutTimeout = setTimeout(function () {
                            clearInterval(this.revealLayoutInterval)
                        }.bind(this), t)
                    }
                }, getRevealSlideBounds: function (t, e) {
                    t = t || SL.editor.controllers.Markup.getCurrentSlide();
                    var i = t.offset(), n = Reveal.getScale(), s = i.left * n, o = i.top * n;
                    if (e) {
                        var a = $(".projector").offset();
                        a && (s -= a.left, o -= a.top)
                    }
                    return {x: s, y: o, width: t.outerWidth() * n, height: t.outerHeight() * n}
                }, getRevealSlidesBounds: function (t) {
                    var e = $(".reveal .slides"), i = e.offset(), n = Reveal.getScale(), s = i.left * n, o = i.top * n;
                    if (t) {
                        var a = $(".projector").offset();
                        a && (s -= a.left, o -= a.top)
                    }
                    return {x: s, y: o, width: e.outerWidth() * n, height: e.outerHeight() * n}
                }, getRevealElementOffset: function (t, e) {
                    t = $(t);
                    var i = {x: 0, y: 0};
                    if (t.parents("section").length)for (; t.length && !t.is("section");)i.x += t.get(0).offsetLeft, i.y += t.get(0).offsetTop, e && (i.x -= parseInt(t.css("margin-left"), 10), i.y -= parseInt(t.css("margin-top"), 10)), t = $(t.get(0).offsetParent);
                    return i
                }, getRevealElementGlobalOffset: function (t) {
                    var e = $(t), i = e.closest(".reveal"), n = {x: 0, y: 0};
                    if (e.length && i.length) {
                        var s = Reveal.getConfig(), o = Reveal.getScale(), a = i.get(0).getBoundingClientRect(), r = {
                            x: a.left + a.width / 2,
                            y: a.top + a.height / 2
                        }, l = s.width * o, c = s.height * o;
                        n.x = r.x - l / 2, n.y = r.y - c / 2;
                        var d = e.closest(".slides section");
                        d.length && (n.y -= d.scrollTop() * o);
                        var h = SL.util.getRevealElementOffset(e);
                        n.x += h.x * o, n.y += h.y * o
                    }
                    return n
                }, getRevealCounterScale: function () {
                    return window.Reveal ? 2 - Reveal.getScale() : 1
                }, globalToRevealCoordinate: function (t, e) {
                    var i = SL.util.getRevealSlideBounds(), n = SL.util.getRevealCounterScale();
                    return {x: (t - i.x) * n, y: (e - i.y) * n}
                }, globalToProjectorCoordinate: function (t, e) {
                    var i = {x: t, y: e}, n = $(".projector").offset();
                    return n && (i.x -= n.left, i.y -= n.top), i
                }, hideAddressBar: function () {
                    if (SL.util.device.IS_PHONE && !/crios/gi.test(navigator.userAgent)) {
                        var t = function () {
                            setTimeout(function () {
                                window.scrollTo(0, 1)
                            }, 10)
                        };
                        $(window).on("orientationchange", function () {
                            t()
                        }), t()
                    }
                }, callback: function () {
                    "function" == typeof arguments[0] && arguments[0].apply(null, [].slice.call(arguments, 1))
                }, getPlaceholderImage: function (t) {
                    var e = "";
                    return t && "function" == typeof window.btoa && (e = window.btoa(Math.random().toString()).replace(/=/g, "")), "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" + e
                }, isTypingEvent: function (t) {
                    return $(t.target).is('input:not([type="file"]), textarea, [contenteditable]')
                }, isTyping: function () {
                    var t = document.activeElement && "inherit" !== document.activeElement.contentEditable, e = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName);
                    return t || e
                }
            }, sest
            (".slides section");
            d.length && (n.y -= d.scrollTop() * o);
            var h = SL.util.getRevealElementOffset(e);
            n.x += h.x * o, n.y += h.y * o
        }
        return n
    }, getRevealCounterScale: function () {
        return window.Reveal ? 2 - Reveal.getScale() : 1
    }, globalToRevealCoordinate: function (t, e) {
        var i = SL.util.getRevealSlideBounds(), n = SL.util.getRevealCounterScale();
        return {x: (t - i.x) * n, y: (e - i.y) * n}
    }, globalToProjectorCoordinate: function (t, e) {
        var i = {x: t, y: e}, n = $(".projector").offset();
        return n && (i.x -= n.left, i.y -= n.top), i
    }, hideAddressBar: function () {
        if (SL.util.device.IS_PHONE && !/crios/gi.test(navigator.userAgent)) {
            var t = function () {
                setTimeout(function () {
                    window.scrollTo(0, 1)
                }, 10)
            };
            $(window).on("orientationchange", function () {
                t()
            }), t()
        }
    }, callback: function () {
        "function" == typeof arguments[0] && arguments[0].apply(null, [].slice.call(arguments, 1))
    }, getPlaceholderImage: function (t) {
        var e = "";
        return t && "function" == typeof window.btoa && (e = window.btoa(Math.random().toString()).replace(/=/g, "")), "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" + e
    }, isTypingEvent: function (t) {
        return $(t.target).is('input:not([type="file"]), textarea, [contenteditable]')
    }, isTyping: function () {
        var t = document.activeElement && "inherit" !== document.activeElement.contentEditable, e = document.activeElement && document.activeElement.tagName && /input|textarea/i.test(document.activeElement.tagName);
        return t || e
    }
}