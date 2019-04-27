import fs from 'fs';

export default class UserData {

    private static _filename: string = "";
    private static _data: any = {};

    public static Open(file: string) {
        this._filename = file;
        if (!fs.existsSync(this._filename)) {
            fs.writeFileSync(this._filename, "{}");
            return;
        }
        let dataString = fs.readFileSync(this._filename);
        this._data = JSON.parse(dataString.toString());
    }

    public static SaveToFile() {
        fs.writeFileSync(this._filename, JSON.stringify(this._data));
    }

    public static SetValue(key: string, value: any) {
        this._data[key] = value;
    }

    public static GetValue(key: string, defaultValue: any): any {
        let value = this._data[key];
        if (!value) {
            return defaultValue;
        }
        return value;
    }

    public static RemoveValue(key: string) {
        if (this._data[key]) {
            delete this._data[key];
        }
    }
}