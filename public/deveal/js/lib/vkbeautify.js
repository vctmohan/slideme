!function () {
    function t(t) {
        var e = "    ";
        if (isNaN(parseInt(t)))e = t; else switch (t) {
            case 1:
                e = " ";
                break;
            case 2:
                e = "  ";
                break;
            case 3:
                e = "   ";
                break;
            case 4:
                e = "    ";
                break;
            case 5:
                e = "     ";
                break;
            case 6:
                e = "      ";
                break;
            case 7:
                e = "       ";
                break;
            case 8:
                e = "        ";
                break;
            case 9:
                e = "         ";
                break;
            case 10:
                e = "          ";
                break;
            case 11:
                e = "           ";
                break;
            case 12:
                e = "            "
        }
        var i = ["\n"];
        for (ix = 0; 100 > ix; ix++)i.push(i[ix] + e);
        return i
    }

    function e() {
        this.step = "    ", this.shift = t(this.step)
    }

    function i(t, e) {
        return e - (t.replace(/\(/g, "").length - t.replace(/\)/g, "").length)
    }

    function n(t, e) {
        return t.replace(/\s{1,}/g, " ").replace(/ AND /gi, "~::~" + e + e + "AND ").replace(/ BETWEEN /gi, "~::~" + e + "BETWEEN ").replace(/ CASE /gi, "~::~" + e + "CASE ").replace(/ ELSE /gi, "~::~" + e + "ELSE ").replace(/ END /gi, "~::~" + e + "END ").replace(/ FROM /gi, "~::~FROM ").replace(/ GROUP\s{1,}BY/gi, "~::~GROUP BY ").replace(/ HAVING /gi, "~::~HAVING ").replace(/ IN /gi, " IN ").replace(/ JOIN /gi, "~::~JOIN ").replace(/ CROSS~::~{1,}JOIN /gi, "~::~CROSS JOIN ").replace(/ INNER~::~{1,}JOIN /gi, "~::~INNER JOIN ").replace(/ LEFT~::~{1,}JOIN /gi, "~::~LEFT JOIN ").replace(/ RIGHT~::~{1,}JOIN /gi, "~::~RIGHT JOIN ").replace(/ ON /gi, "~::~" + e + "ON ").replace(/ OR /gi, "~::~" + e + e + "OR ").replace(/ ORDER\s{1,}BY/gi, "~::~ORDER BY ").replace(/ OVER /gi, "~::~" + e + "OVER ").replace(/\(\s{0,}SELECT /gi, "~::~(SELECT ").replace(/\)\s{0,}SELECT /gi, ")~::~SELECT ").replace(/ THEN /gi, " THEN~::~" + e).replace(/ UNION /gi, "~::~UNION~::~").replace(/ USING /gi, "~::~USING ").replace(/ WHEN /gi, "~::~" + e + "WHEN ").replace(/ WHERE /gi, "~::~WHERE ").replace(/ WITH /gi, "~::~WITH ").replace(/ ALL /gi, " ALL ").replace(/ AS /gi, " AS ").replace(/ ASC /gi, " ASC ").replace(/ DESC /gi, " DESC ").replace(/ DISTINCT /gi, " DISTINCT ").replace(/ EXISTS /gi, " EXISTS ").replace(/ NOT /gi, " NOT ").replace(/ NULL /gi, " NULL ").replace(/ LIKE /gi, " LIKE ").replace(/\s{0,}SELECT /gi, "SELECT ").replace(/\s{0,}UPDATE /gi, "UPDATE ").replace(/ SET /gi, " SET ").replace(/~::~{1,}/g, "~::~").split("~::~")
    }

    e.prototype.xml = function (e, i) {
        var n = e.replace(/>\s{0,}</g, "><").replace(/</g, "~::~<").replace(/\s*xmlns\:/g, "~::~xmlns:").replace(/\s*xmlns\=/g, "~::~xmlns=").split("~::~"), s = n.length, o = !1, a = 0, r = "", l = 0, c = i ? t(i) : this.shift;
        for (l = 0; s > l; l++)n[l].search(/<!/) > -1 ? (r += c[a] + n[l], o = !0, (n[l].search(/-->/) > -1 || n[l].search(/\]>/) > -1 || n[l].search(/!DOCTYPE/) > -1) && (o = !1)) : n[l].search(/-->/) > -1 || n[l].search(/\]>/) > -1 ? (r += n[l], o = !1) : /^<\w/.exec(n[l - 1]) && /^<\/\w/.exec(n[l]) && /^<[\w:\-\.\,]+/.exec(n[l - 1]) == /^<\/[\w:\-\.\,]+/.exec(n[l])[0].replace("/", "") ? (r += n[l], o || a--) : n[l].search(/<\w/) > -1 && -1 == n[l].search(/<\//) && -1 == n[l].search(/\/>/) ? r = r += o ? n[l] : c[a++] + n[l] : n[l].search(/<\w/) > -1 && n[l].search(/<\//) > -1 ? r = r += o ? n[l] : c[a] + n[l] : n[l].search(/<\//) > -1 ? r = r += o ? n[l] : c[--a] + n[l] : n[l].search(/\/>/) > -1 ? r = r += o ? n[l] : c[a] + n[l] : r += n[l].search(/<\?/) > -1 ? c[a] + n[l] : n[l].search(/xmlns\:/) > -1 || n[l].search(/xmlns\=/) > -1 ? c[a] + n[l] : n[l];
        return "\n" == r[0] ? r.slice(1) : r
    }, e.prototype.json = function (t, e) {
        var e = e ? e : this.step;
        return "undefined" == typeof JSON ? t : "string" == typeof t ? JSON.stringify(JSON.parse(t), null, e) : "object" == typeof t ? JSON.stringify(t, null, e) : t
    }, e.prototype.css = function (e, i) {
        var n = e.replace(/\s{1,}/g, " ").replace(/\{/g, "{~::~").replace(/\}/g, "~::~}~::~").replace(/\;/g, ";~::~").replace(/\/\*/g, "~::~/*").replace(/\*\//g, "*/~::~").replace(/~::~\s{0,}~::~/g, "~::~").split("~::~"), s = n.length, o = 0, a = "", r = 0, l = i ? t(i) : this.shift;
        for (r = 0; s > r; r++)a += /\{/.exec(n[r]) ? l[o++] + n[r] : /\}/.exec(n[r]) ? l[--o] + n[r] : /\*\\/.exec(n[r]) ? l[o] + n[r] : l[o] + n[r];
        return a.replace(/^\n{1,}/, "")
    }, e.prototype.sql = function (e, s) {
        var o = e.replace(/\s{1,}/g, " ").replace(/\'/gi, "~::~'").split("~::~"), a = o.length, r = [], l = 0, c = this.step, d = 0, h = "", u = 0, p = s ? t(s) : this.shift;
        for (u = 0; a > u; u++)r = r.concat(u % 2 ? o[u] : n(o[u], c));
        for (a = r.length, u = 0; a > u; u++) {
            d = i(r[u], d), /\s{0,}\s{0,}SELECT\s{0,}/.exec(r[u]) && (r[u] = r[u].replace(/\,/g, ",\n" + c + c)), /\s{0,}\s{0,}SET\s{0,}/.exec(r[u]) && (r[u] = r[u].replace(/\,/g, ",\n" + c + c)), /\s{0,}\(\s{0,}SELECT\s{0,}/.exec(r[u]) ? (l++, h += p[l] + r[u]) : /\'/.exec(r[u]) ? (1 > d && l && l--, h += r[u]) : (h += p[l] + r[u], 1 > d && l && l--)
        }
        return h = h.replace(/^\n{1,}/, "").replace(/\n{1,}/g, "\n")
    }, e.prototype.xmlmin = function (t, e) {
        var i = e ? t : t.replace(/\<![ \r\n\t]*(--([^\-]|[\r\n]|-[^\-])*--[ \r\n\t]*)\>/g, "").replace(/[ \r\n\t]{1,}xmlns/g, " xmlns");
        return i.replace(/>\s{0,}</g, "><")
    }, e.prototype.jsonmin = function (t) {
        return "undefined" == typeof JSON ? t : JSON.stringify(JSON.parse(t), null, 0)
    }, e.prototype.cssmin = function (t, e) {
        var i = e ? t : t.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g, "");
        return i.replace(/\s{1,}/g, " ").replace(/\{\s{1,}/g, "{").replace(/\}\s{1,}/g, "}").replace(/\;\s{1,}/g, ";").replace(/\/\*\s{1,}/g, "/*").replace(/\*\/\s{1,}/g, "*/")
    }, e.prototype.sqlmin = function (t) {
        return t.replace(/\s{1,}/g, " ").replace(/\s{1,}\(/, "(").replace(/\s{1,}\)/, ")")
    }, window.vkbeautify = new e
}();