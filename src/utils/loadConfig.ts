import fs from "node:fs/promises";
import path from "node:path";
import type { Config } from "../config.type.js";
import outputFormatter from "./outputFormatter.js";

// default ignores
const _defaultIgnores: string[] = [
    "node_modules",
    "package-lock.json",
    "package.json",
    ".git",
    ".gitignore",
    ".DS_Store",
    ".vscode",
];

// default config
const defaultConfig: Config = {
    chunkSize: Infinity,
    defaultIgnores: true,
    ignores: _defaultIgnores,
    outDir: "ezctx",
    outDirSingleEmit: false,
    outFile: "ezctx_{i}.txt",
};

/**
 * Loads in the user's config and merges it with default config
 * to fill undefined fields. Assumes the user's config is in the
 * same directory as process.cwd(), contains "ezctx", and is a JSON file.
 *
 * @returns Config
 */
export default async function loadConfig(): Promise<Config> {
    // searches for a user-defined config
    let userConfig: Partial<Config>;
    const userConfigName: string | undefined = (
        await fs.readdir(process.cwd())
    ).find((file) => /.*ezctx.*\.json$/i.test(file));
    if (userConfigName) {
        userConfig = JSON.parse(await fs.readFile(userConfigName, "utf-8"));
    } else {
        userConfig = defaultConfig;
    }

    // merges the program's default ignores with
    // the user-defined ignores

    // stores the merged ignores
    let mergedIgnores: string[];

    if (userConfig.defaultIgnores === undefined || userConfig.defaultIgnores) {
        mergedIgnores = [..._defaultIgnores, ...(userConfig.ignores || [])];
    } else {
        mergedIgnores = [...(userConfig.ignores || [])];
    }

    // add program's output directory and output file to ignores
    // to prevent duplicate writes
    mergedIgnores.push(userConfig.outDir || defaultConfig.outDir);
    mergedIgnores.push(
        userConfig.outFile
            ? outputFormatter(userConfig.outFile, 1)
            : outputFormatter(defaultConfig.outFile, 1)
    );

    // creates merged config
    const mergedConfig: Config = {
        ...defaultConfig,
        ...Object.fromEntries(
            Object.entries(userConfig).filter(
                ([_, value]) => value !== undefined
            )
        ),
        ignores: mergedIgnores,
    };

    return mergedConfig;
}
