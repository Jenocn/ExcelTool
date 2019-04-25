import Electron, { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import Excel from './Excel'
import fs from 'fs'

let win = null;
let winOption = {
    width: 800,
    height: 600
};

let _files:string[] = [];
let _outDir = "";

function CreateWindow(): void {
    win = new BrowserWindow(winOption);
    const dir = path.join(__dirname, "../");
    win.loadFile(dir + "index.html");
    win.webContents.openDevTools();
}

app.on("ready", CreateWindow);
app.on("quit", ()=>{
    win = null;
})

ipcMain.on("open-file-dialog-select", (event: Electron.Event)=>{
    dialog.showOpenDialog({
        properties:["openFile", "multiSelections"]
    }, (files)=>{
        if (files) {
            event.sender.send("selected-directory", files);
            _files = files;
        }
    });
});

ipcMain.on("open-file-dialog-out", (event: Electron.Event)=>{
    dialog.showOpenDialog({
        properties:["openFile", "openDirectory"]
    }, (dir)=>{
        if (dir) {
            event.sender.send("out-directory", dir);
            _outDir = dir[0];
        }
    });
});

ipcMain.on("export", (event: Electron.Event)=>{
    if (_outDir == "" || _files.length == 0) { return; }
    let excel = new Excel();
    for (let i=0; i<_files.length; ++i) {
        excel.Open(_files[i]);
        const xmlStr = excel.ToXmlString();
        if (xmlStr != "") {
            fs.writeFile(_outDir + "/" + i + ".xml", xmlStr, (err)=>{
                console.log(err);
            });
        }
    }
});