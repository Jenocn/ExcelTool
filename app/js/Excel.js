"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx_1 = __importDefault(require("xlsx"));
var Excel = /** @class */ (function () {
    function Excel() {
        this._data = {};
        this._xmlString = "";
    }
    Excel.prototype.Open = function (file) {
        this._data = {};
        this._xmlString = "";
        var workbook = xlsx_1.default.readFile(file);
        this._data = (function (workbook) {
            if (workbook.SheetNames.length == 0) {
                return {};
            }
            var ret = {};
            var sheetName = workbook.SheetNames[0];
            var roa = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
            if (roa.length) {
                ret = roa;
            }
            return ret;
        })(workbook);
    };
    Excel.prototype.ToJsonString = function () {
        return JSON.stringify(this._data);
    };
    Excel.prototype.ToXmlString = function () {
        if (this._xmlString != "") {
            return this._xmlString;
        }
        if (!this._data || this._data.length == 0) {
            return "";
        }
        var ret = "<root>\n";
        for (var i = 0; i < this._data.length; ++i) {
            var child = this._data[i];
            if (!child || child.length == 0) {
                continue;
            }
            var lineStr = (function (obj) {
                var r = "<item ";
                for (var key in obj) {
                    var value = obj[key];
                    r += "\"" + key + "\"=" + "\"" + value + "\" ";
                }
                r += "/>";
                return r;
            })(child);
            ret += "\t";
            ret += lineStr;
            ret += "\n";
        }
        ret += "</root>";
        this._xmlString = ret;
        return ret;
    };
    return Excel;
}());
exports.default = Excel;
