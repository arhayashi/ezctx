import * as fs from "node:fs/promises";
import path from "node:path";
import type { FileNode } from "./utils.type.js";

/**
 * Recursively constructs a graph of the project starting from the path
 * given by dirPath.
 *
 * @param dirPath Path where the graph should start
 * @param ignores Directories/filters to ignore
 * @param maxDepth Max depth to recurse to prevent infinite recursion
 * @param depth Current depth
 * @returns FileNode object
 */
export default async function buildGraph(
    dirPath: string,
    ignores: string[] = [],
    maxDepth: number = 1000,
    depth: number = 0
): Promise<FileNode> {
    // gets name of directory/file
    const name: string = path.basename(dirPath);

    // get stats about directory/file
    const stats = await fs.stat(dirPath);

    // creates a new node
    const fileNode: FileNode = {
        name,
        path: dirPath,
        type: stats.isDirectory() ? "directory" : "file",
        depth,
        size: stats.size,
    };

    // recursively adds children nodes
    if (stats.isDirectory() && depth < maxDepth) {
        // gets all the files/directories within the current one
        const entries: string[] = await fs.readdir(dirPath);

        // filter out ignores files/directories
        let filteredEntries: string[] = entries.filter(
            (entry) => !ignores.includes(entry)
        );

        // add sub-directories and their files
        // as a children property to the parent node
        fileNode.children = await Promise.all(
            filteredEntries.map((entry) =>
                buildGraph(
                    path.join(dirPath, entry),
                    ignores,
                    maxDepth,
                    depth + 1
                )
            )
        );
    }

    return fileNode;
}
