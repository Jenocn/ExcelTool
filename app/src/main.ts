import Electron, { app, BrowserWindow, ipcMain, dialog, MessageBoxOptions } from 'electron';
import path from 'path';
import Excel from './Excel'
import fs from 'fs'

let win = null;
let winOption = {
    width: 800,
    height: 600
};

let _srcDir: string = "";
let _srcFiles: string[] = [];
let _outDir = "";

function CreateWindow(): void {
    win = new BrowserWindow(winOption);
    const dir = path.join(__dirname, "../");
    win.loadFile(dir + "index.html");
    win.webContents.openDevTools();
}

app.on("ready", CreateWindow);
app.on("quit", () => {
    win = null;
})

ipcMain.on("open-file-dialog-select", (event: Electron.Event) => {
    dialog.showOpenDialog({
        properties: ["openDirectory"],
    }, (dir: string[]) => {
        if (dir && dir.length > 0) {
            _srcDir = dir[0];
            let allFiles = fs.readdirSync(_srcDir);
            for (const item of allFiles) {
                let extName = path.extname(item);
                if (extName == ".xlsx" || extName == ".xls") {
                    _srcFiles.push(item);
                }
            }
            event.sender.send("selected-directory", _srcDir, _srcFiles);
        }
    });
});

ipcMain.on("open-file-dialog-out", (event: Electron.Event) => {
    dialog.showOpenDialog({
        properties: ["openFile", "openDirectory"]
    }, (dir: string[]) => {
        if (dir && dir.length > 0) {
            _outDir = dir[0];
            event.sender.send("out-directory", _outDir);
        }
    });
});

ipcMain.on("export", (event: Electron.Event, exportType: string) => {
    if (_outDir == "" || _srcFiles.length == 0) {
        return;
    }
    if (exportType == "XML") {
        let excel = new Excel();
        for (let i = 0; i < _srcFiles.length; ++i) {
            excel.Open(_outDir + "/" + _srcFiles[i]);
            const xmlStr = excel.ToXmlString();
            if (xmlStr == "") {
                continue;
            }
            let filename = _srcFiles[i].replace(path.extname(_srcFiles[i]), "");
            fs.writeFile(_outDir + "/" + filename + ".xml", xmlStr, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    } else if (exportType == "JSON") {
        let excel = new Excel();
        for (let i = 0; i < _srcFiles.length; ++i) {
            excel.Open(_outDir + "/" + _srcFiles[i]);
            const jsonStr = excel.ToJsonString();
            if (jsonStr == "") {
                continue;
            }
            let filename = _srcFiles[i].replace(path.extname(_srcFiles[i]), "");
            fs.writeFile(_outDir + "/" + filename + ".json", jsonStr, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }
});