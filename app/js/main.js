"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path_1 = __importDefault(require("path"));
var Excel_1 = __importDefault(require("./Excel"));
var win = null;
var winOption = {
    width: 800,
    height: 600
};
function CreateWindow() {
    win = new electron_1.BrowserWindow(winOption);
    var dir = path_1.default.join(__dirname, "../");
    win.loadFile(dir + "index.html");
    var excel = new Excel_1.default();
    excel.Open(dir + "res/test.xlsx");
    win.webContents.insertText(excel.ToJsonString());
    win.webContents.insertText(excel.ToXmlString());
}
electron_1.app.on("ready", CreateWindow);
electron_1.app.on("quit", function () {
    win = null;
});
