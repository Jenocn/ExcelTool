import Electron, { app, BrowserWindow } from 'electron';
import path from 'path';
import Excel from './Excel'

let win = null;
let winOption = {
    width: 800,
    height: 600
};

function CreateWindow(): void {
    win = new BrowserWindow(winOption);
    const dir = path.join(__dirname, "../");
    win.loadFile(dir + "index.html");

    let excel = new Excel();
    excel.Open(dir + "res/test.xlsx");
    
    win.webContents.insertText(excel.ToJsonString());
    win.webContents.insertText(excel.ToXmlString());
}

app.on("ready", CreateWindow);
app.on("quit", ()=>{
    win = null;
})