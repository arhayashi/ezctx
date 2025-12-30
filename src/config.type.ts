// loadConfig.ts
export type Config = {
    chunkSize: number;
    ignores: string[];
    outDir: string;
    outDirSingleEmit: boolean;
    defaultIgnores: boolean;
    outFile: string;
};
