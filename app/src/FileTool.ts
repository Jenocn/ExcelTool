import fs from 'fs';
import path from 'path';

export default class FileTool {
    public static GetFilesFromDirectory(dir: string, bRecursion: boolean, filter?: string[]): string[] {
        if (!fs.existsSync(dir)) {
            return [];
        }
        // search dir
        let tempFiles = fs.readdirSync(dir);
        if (!filter || filter.length == 0) {
            return [];
        }
        let files: string[] = [];
        for (const item of tempFiles) {
            let extName = path.extname(item);
            if (bRecursion && extName == "") {
                files = files.concat(this.GetFilesFromDirectory(dir + "/" + item, true, filter));
            }
            if (filter.includes(extName)) {
                files.push(dir + "/" + item);
            }
        }
        return files;
    }

    public static WriteToFile(file: string, str: string) {
        let dir = path.dirname(file);
        this.CreateDir(dir);
        fs.writeFile(file, str, {}, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }

    public static CreateDir(dir: string) {
        if (fs.existsSync(dir)) {
            return;
        }
        let lastDir = path.dirname(dir);
        if (fs.existsSync(lastDir)) {
            fs.mkdirSync(dir);
        } else {
            this.CreateDir(lastDir);
        }
    }
}