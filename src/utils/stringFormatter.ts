/**
 * Formats a given resource by adding spacing and lines
 * to ensure that it is properly placed when creating a
 * visualization of the project's structure
 *
 * @param depth Current depth within the graph
 * @param name Name of the file/directory
 * @param type Type of the given resource
 * @returns A formatted string of the resource
 */

export default function stringFormatter(
    depth: number,
    name: string,
    type: "directory" | "file"
): string {
    return depth == 0
        ? `\\${name}\n`
        : `   `.repeat(depth - 1) +
              `|__${name}${type === "directory" ? "/" : ""}\n`;
}
