#!/usr/bin/env node

import * as fs from "node:fs/promises";
import path from "node:path";
import buildGraph from "./utils/buildGraph.js";
import visualizeGraph from "./utils/visualizeGraph.js";
import writeOutput from "./utils/writeOutput.js";
import loadConfig from "./utils/loadConfig.js";
import outputFormatter from "./utils/outputFormatter.js";
import type { Config } from "./config.type.js";
import type { FileNode } from "./utils/utils.type.js";

try {
    // loads in the configs
    const config: Config = await loadConfig();
    const ignores: string[] = config["ignores"];
    const outDir: string = config["outDir"];
    const outDirSingleEmit: boolean = config["outDirSingleEmit"];
    const outFile: string = config["outFile"];
    const chunkSize: number = config["chunkSize"];

    // builds graph
    let graph: FileNode = await buildGraph(process.cwd(), ignores);

    // creates visualization from the graph
    const visualization: string =
        "*** project structure ***\n\n" + visualizeGraph(graph) + "\n";
    console.log(visualization);

    // prints graph
    console.log(JSON.stringify(graph, null, 2));

    // creates output directory; removes previous ones
    const finalOutDir: string = path.join(process.cwd(), outDir);
    await fs.rm(finalOutDir, { recursive: true, force: true });
    await fs.mkdir(finalOutDir, { recursive: true });

    // creates output path;
    const finalOutPath: string = path.join(finalOutDir, outFile);
    // creates path of the first output file
    const firstFinalOutPath: string = outputFormatter(finalOutPath, 1);

    // writes the visualization to the first output file
    await fs.writeFile(firstFinalOutPath, visualization, {
        flag: "w+",
    });

    // count object to access number of output files
    // from outside the writeOutput function
    const count: { count: number } = { count: 1 };
    // adds file contents to output
    await writeOutput(graph, finalOutPath, chunkSize, count);

    // creates path for single emits
    const singleEmitOutPath: string = path.join(
        process.cwd(),
        path.basename(firstFinalOutPath)
    );
    // detects if only a single output file and emits it
    // in the working directory instead of the outDir
    if (count.count === 1 && !outDirSingleEmit) {
        // creates path of the first output file for single emits
        await fs.rename(firstFinalOutPath, singleEmitOutPath);
        await fs.rm(finalOutDir, { recursive: true, force: true });
    } else {
        await fs.rm(singleEmitOutPath, { force: true });
    }
} catch (error) {
    if (error instanceof Error) {
        console.log(error.message);
    } else {
        console.log(error);
    }
    process.exit(1);
}
