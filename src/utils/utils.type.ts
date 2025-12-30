// buildGraph.ts, visualizeGraph.ts
export type FileNode = {
    name: string;
    path: string;
    type: "directory" | "file";
    size: number;
    depth: number;
    children?: undefined | FileNode[];
};
