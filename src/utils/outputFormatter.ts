import path from "node:path";

/**
 * Takes in a path or file and embeds the current file count
 * within the output file defined in the config. If the raw
 * output file does not define a place to embed the count, this
 * program defaulty adds "_{count}" before the file name.
 *
 * @param outFile The raw output file format defined in the config
 * @param count The nth output file that is being created
 * @returns A formatted path/file name with the count embedded
 */

export default function outputFormatter(
    outputPath: string,
    count: number
): string {
    // extracts the file name
    const fileName = path.basename(outputPath);
    // extracts the file dirname
    const dirName = path.dirname(outputPath);
    // gets index of the section to replace with the
    // current file count
    const index = fileName.indexOf("{i}");

    if (index == -1) {
        // if not defined, add default count
        const fileNameParts = fileName.split(".");
        const finalOutputFile =
            fileNameParts[0] + `_${count}.` + fileNameParts[1];
        return path.join(dirName, finalOutputFile);
    }

    // otherwise, replace the {i} with the current file count
    const finalOutputFile =
        fileName.substring(0, index) + count + fileName.substring(index + 3);
    return path.join(dirName, finalOutputFile);
}
