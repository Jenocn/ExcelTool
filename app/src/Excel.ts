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

    public ToJsonString(): string {
        if (!this._data || this._data.length == 0) {
            return "";
        }
        if (this._jsonString == "") {
            this._jsonString = JSON.stringify(this._data);
        }
        return this._jsonString;
    }

    public ToXmlString(): string {
        if (this._xmlString != "") {
            return this._xmlString;
        }
        if (!this._data || this._data.length == 0) {
            return "";
        }

        let ret = "<root>\n";

        for (let i = 0; i < this._data.length; ++i) {
            const child = this._data[i];
            if (!child || child.length == 0) {
                continue;
            }
            let lineStr = ((obj: any) => {
                let r = "<item ";
                for (const key in obj) {
                    const value = obj[key];
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
    }
}