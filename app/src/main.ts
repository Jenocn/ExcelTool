import Electron, { app, BrowserWindow, ipcMain, dialog, MessageBoxOptions } from 'electron';
import FileTool from './FileTool'
import path from 'path';
import Excel from './Excel'
import UserData from './UserData';

let win = null;
let winOption = {
    width: 800,
    height: 600
};

function CreateWindow(): void {
    win = new BrowserWindow(winOption);
    const dir = path.join(__dirname, "../");
    win.loadFile(dir + "index.html");
    // win.webContents.openDevTools();
}

function _OnReady(): void {
    let userDataPath = app.getPath("userData");
    UserData.Open(userDataPath + "/userdata.json");
    CreateWindow();
}

function _OnQuit(): void {
    win = null;
    UserData.SaveToFile();
}

app.on("ready", _OnReady);
app.on("quit", _OnQuit);

ipcMain.on("request-init", (event: Electron.Event)=>{

    let outDir = UserData.GetValue("outDir", "./out");
    let srcDir = UserData.GetValue("srcDir", "./src");
    let files = FileTool.GetFilesFromDirectory(srcDir, [".xls", ".xlsx"]);
    event.sender.send("index-init", srcDir, outDir, files);
});

ipcMain.on("open-file-dialog-select", (event: Electron.Event) => {
    dialog.showOpenDialog({
        properties: ["openDirectory"],
    }, (dir: string[]) => {
        if (!dir || dir.length == 0) {
            return;
        }
        UserData.SetValue("srcDir", dir[0]);
        let srcFiles = FileTool.GetFilesFromDirectory(dir[0], [".xls", ".xlsx"]);
        event.sender.send("selected-directory", dir[0], srcFiles);
    });
});

ipcMain.on("open-file-dialog-out", (event: Electron.Event) => {
    dialog.showOpenDialog({
        properties: ["openFile", "openDirectory"]
    }, (dir: string[]) => {
        if (dir && dir.length > 0) {
            UserData.SetValue("outDir", dir[0]);
            event.sender.send("out-directory", dir[0]);
        }
    });
});

ipcMain.on("export", (event: Electron.Event, exportType: string, srcDir: string, outDir: string, files: string[]) => {
    if (srcDir == "" || outDir == "" || files.length == 0) {
        return;
    }
    if (srcDir[srcDir.length - 1] == '/') {
        srcDir = srcDir.substr(0, srcDir.length - 1);
    }
    if (outDir[outDir.length - 1] == '/') {
        outDir = outDir.substr(0, outDir.length - 1);
    }
    if (exportType == "XML") {
        let excel = new Excel();
        for (let i = 0; i < files.length; ++i) {
            excel.Open(srcDir + "/" + files[i]);
            const xmlStr = excel.ToXmlString();
            if (xmlStr == "") {
                continue;
            }
            let filename = FileTool.GetPureFilenameFromAbsolutionPath(files[i]);
            FileTool.WriteToFile(outDir + "/" + filename + ".xml", xmlStr);
        }
    } else if (exportType == "JSON") {
        let excel = new Excel();
        for (let i = 0; i < files.length; ++i) {
            excel.Open(srcDir + "/" + files[i]);
            const jsonStr = excel.ToJsonString();
            if (jsonStr == "") {
                continue;
            }
            let filename = FileTool.GetPureFilenameFromAbsolutionPath(files[i]);
            FileTool.WriteToFile(outDir + "/" + filename + ".json", jsonStr);
        }
    }
});
