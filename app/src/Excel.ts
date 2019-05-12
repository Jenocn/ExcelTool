import XLSX, { WorkBook } from 'xlsx';

export default class Excel {
    private _data: any = {};
    private _xmlString: string = "";
    private _jsonString: string = "";

    public Open(file: string) {
        this._data = {};
        this._xmlString = "";
        this._jsonString = "";
        const workbook = XLSX.readFile(file);
        this._data = ((workbook: WorkBook): any => {
            if (workbook.SheetNames.length == 0) {
                return {};
            }
            let ret: any = {};
            let sheetName = workbook.SheetNames[0];
            let roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            if (roa.length) {
                ret = roa;
            }
            return ret;
        })(workbook);
    }

    public ToJsonString(format: boolean = false): string {
        if (this._jsonString != "") {
            return this._jsonString;
        }
        if (!this._data || !this._data.length) {
            return "";
        }

        if (!format) {
            this._jsonString = JSON.stringify(this._data);
            return this._jsonString;
        }

        let ret = "[\n";
        for (let i = 0; i < this._data.length; ++i) {
            const child = this._data[i];
            if (!child || child.length == 0) {
                continue;
            }
            let lineStr = ((obj: any) => {
                let r = "{";
                let tail = "";
                for (const key in obj) {
                    const value = obj[key];
                    let isString = typeof(value) == "string";
                    let refSign = isString ? "\"" : "";
                    r += tail + "\"" + key + "\"" + ":" + refSign + value + refSign;
                    tail = ",";
                }
                r += "}";
                return r;
            })(child);
            
            ret += "\t";
            ret += lineStr;
            if (i < this._data.length - 1) {
                ret += ",";
            }
            ret += "\n";
        }

        ret += "]";
        this._jsonString = ret;

        return ret;
    }

    public ToXmlString(format: boolean = false): string {
        if (this._xmlString != "") {
            return this._xmlString;
        }
        if (!this._data || !this._data.length) {
            return "";
        }

        let newLineSign = format ? "\n" : "";
        let tabSign = format ? "\t" : "";

        let ret = "<root>";
        ret += newLineSign;

        for (let i = 0; i < this._data.length; ++i) {
            const child = this._data[i];
            if (!child || child.length == 0) {
                continue;
            }
            let lineStr = ((obj: any) => {
                let r = "<item ";
                for (const key in obj) {
                    const value = obj[key];
                    r += key + "=" + "\"" + value + "\" ";
                }
                r += "/>";
                return r;
            })(child);

            ret += tabSign;
            ret += lineStr;
            ret += newLineSign;
        }

        ret += "</root>";
        this._xmlString = ret;

        return ret;
    }
}