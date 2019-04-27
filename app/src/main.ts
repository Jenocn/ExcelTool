import Electron, { app, BrowserWindow, ipcMain, dialog, MessageBoxOptions, Menu } from 'electron';
import FileTool from './FileTool'
import path from 'path';
import Excel from './Excel'
import UserData from './UserData';

let win: BrowserWindow | null = null;
const winOption = {
    width: 800,
    height: 600
};

const menuTemplate = [
    {
        label: "File",
        submenu: [
            {
                label: "Exit",
                click: ()=>{
                    app.quit();
                }
            }
        ]
    }
];

function CreateWindow(): void {
    win = new BrowserWindow(winOption);
    win.on("closed", ()=>{
        win = null;
        UserData.SaveToFile();
        app.exit(0);
    });
    const dir = path.join(__dirname, "../");
    win.setMenu(Menu.buildFromTemplate(menuTemplate));
    win.loadFile(dir + "index.html");
    // win.webContents.openDevTools();
}

function _OnReady(): void {
    let userDataPath = app.getPath("userData");
    UserData.Open(userDataPath + "/userdata.json");
    CreateWindow();
}

app.on("ready", _OnReady);

ipcMain.on("request-init", (event: Electron.Event) => {

    let outDir = UserData.GetValue("outDir", "./out");
    let srcDir = UserData.GetValue("srcDir", "./src");
    let files = FileTool.GetFilesFromDirectory(srcDir, true, [".xls", ".xlsx"]);
    for (let i =0; i<files.length; ++i) {
        files[i] = path.relative(srcDir, files[i]);
    }
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
        let srcFiles = FileTool.GetFilesFromDirectory(dir[0], true, [".xls", ".xlsx"]);
        for (let i =0; i<srcFiles.length; ++i) {
            srcFiles[i] = path.relative(dir[0], srcFiles[i]);
        }
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
            let baseName = files[i].replace(path.extname(files[i]), "");
            FileTool.WriteToFile(outDir + "/" + baseName + ".xml", xmlStr);
        }
    } else if (exportType == "JSON") {
        let excel = new Excel();
        for (let i = 0; i < files.length; ++i) {
            excel.Open(srcDir + "/" + files[i]);
            const jsonStr = excel.ToJsonString();
            if (jsonStr == "") {
                continue;
            }
            let baseName = files[i].replace(path.extname(files[i]), "");
            FileTool.WriteToFile(outDir + "/" + baseName + ".json", jsonStr);
        }
    }
});
