import fs from 'fs';
import path from 'path';

export default class FileTool {
    public static GetFilesFromDirectory(dir: string, filter?: string[]): string[] {
        if (!fs.existsSync(dir)) {
            return [];
        }
        let tempFiles = fs.readdirSync(dir);
        if (!filter || filter.length == 0) {
            return [];
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

    public static GetDirectoryFromAbsolutionPath(absolution: string): string {
        return path.dirname(absolution);
    }

    public static GetFilenameFromAbsolutionPath(absolution: string): string {
        return path.basename(absolution);
    }

    public static GetPureFilenameFromAbsolutionPath(absolution: string): string {
        return path.basename(absolution, path.extname(absolution));
    }


    public static WriteToFile(path: string, str: string) {
        fs.writeFile(path, str, {}, (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
}