import * as fs from "node:fs/promises";
import type { FileNode } from "./utils.type.js";
import outputFormatter from "./outputFormatter.js";

/**
 * Recursively adds content to the output files while ensuring
 * that the size of each output file is less than the given chunkSize.
 * If it is, it starts a new output file with the file namen given in
 * outputPath. Stores the count as an object to have it persist.
 *
 * @param graph Project's graph
 * @param outputPath The path to write output to
 * @param chunkSize The max size of each output file
 * @param count The count of the current output file
 */

export default async function writeOutput(
    graph: FileNode | FileNode[] | undefined,
    outputPath: string,
    chunkSize: number,
    count: { count: number }
): Promise<void> {
    // if graph is null/undefined, reach tip
    if (!graph) return;

    // turn current node into array to handle empty directories
    const nodes = Array.isArray(graph) ? graph : [graph];

    // recursively adds each nodes' file content to the output
    for (const node of nodes) {
        if (node.type === "directory") {
            await writeOutput(node.children, outputPath, chunkSize, count);
        } else if (node.type === "file") {
            // get file's content and add formatting
            const content =
                "*** " +
                node.name +
                " ***" +
                "\n\n" +
                (await fs.readFile(node.path)) +
                "\n";
            // get the correct output path 
            let currentOutputPath = outputFormatter(outputPath, count.count);
            // get the size of the current content
            const contentSize = Buffer.byteLength(content, "utf-8");
            // try-catch block because the currentOutputPath may not exist on disk
            // ie. first time writing to this output file
            try {
                // get size of current output file
                const { size } = await fs.stat(currentOutputPath);

                // if the size of the current content is bigger
                // than chunk size, skip file
                if (contentSize > chunkSize) return;

                // ensures that the chunkSize condition is respected
                if (size > 0 && contentSize + size > chunkSize) {
                    currentOutputPath = outputFormatter(outputPath, ++count.count);
                }
            } catch (error) {}

            await fs.writeFile(currentOutputPath, content, { flag: "a" });
        }
    }
}
