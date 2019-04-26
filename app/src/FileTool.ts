import fs from 'fs';
import path from 'path';

export default class FileTool {
    public static GetFilesFromDirectory(dir: string, filter?: string[]): string[] {
        let tempFiles = fs.readdirSync(dir);
        if (!filter || filter.length == 0) {
            return tempFiles;
        }
        let files: string[] = [];
        for (const item of tempFiles) {
            let extName = path.extname(item);
            if (filter.includes(extName)) {
                files.push(item);
            }
        }
        return files;
    }

    public static GetPureFilename(absolution: string): string {
        let ext = path.extname(absolution);
        let ret = absolution.replace(ext, "").replace(/[\\]/g, "/");
        let index = ret.lastIndexOf("/") + 1;
        ret = ret.substr(index, ret.length - index);
        return ret;
    }

    public static WriteToFile(path: string, str: string) {
        fs.writeFile(path, str, {}, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}