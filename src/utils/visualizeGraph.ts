import type { FileNode } from "./utils.type.js";
import stringFormatter from "./stringFormatter.js";

/**
 * Recursively creates a visualization of the project's graph.
 * Uses stringFormatter.ts to format each directory/file
 *
 * @param graph Project's graph
 * @param output Store's recursive output
 * @returns A visualization of the given graph
 */

export default function visualizeGraph(
    graph: FileNode | FileNode[] | undefined,
    output: string = ""
): string {
    // if graph is undefined, reach end/tip
    if (!graph) return output;

    // if not array, it's the root or a child within an array
    if (!Array.isArray(graph)) {
        output += stringFormatter(graph.depth, graph.name, graph.type);
        output = visualizeGraph(graph.children, output);
    } else {
        graph.forEach((child) => {
            output += stringFormatter(child.depth, child.name, child.type);
            output = visualizeGraph(child.children, output);
        });
    }

    return output;
}
