# ezctx

**ezctx** (short for _easy context_) puts all of your source code into one or several `.txt` file(s), allowing you to easily paste it into an external AI platform instead of having to tediously upload each individual file.

In addition, this program adds a graph/visualization of your project's files/directories to the first output `.txt` file, helping the AI map your project.

This program's "bundling" behavior can be modied by adding a configuration file. See below for usage, description, and configuration options.

## Usage

```
npx ezctx
```

-   Node.js version must support the promised-based `fs` API.
-   The program outputs the `.txt` file(s) wherever the command was executed.

## Description

_To view an example of this program's output, see [ezctx_1.txt](https://github.com/arhayashi/ezctx/blob/main/ezctx_1.txt)_.

When running this program, please ensure that your project has read and write permissions enabled or an error will be thrown.

### Default Behavior

This section will describe the program's **default** behavior and some of the ways it can be modified using the [configuration](#configuration) file.

This program recursively writes your projects's source code into a singular `.txt` file so that you can easily access all your source code in a central location. Because this program does not require an npm installation, you can use it with projects that use different languages outside of the Node.js/npm ecosystem.

For instance, if you `cd` into a directory, `my_project`, executing `npx ezctx` will produce `my_project/ezctx_1.txt` containing all of your project's source code. If you need the outputted `.txt` file to be smaller, you can change the configuration's `chunkSize` which will ensure that each output file is no larger than `chunkSize`. This may result in serveral output `.txt` files in the format `ezctx_{i}.txt` where `i` corresponds to the `nth` output file. Note that if there are multiple output `.txt` files, they will live under the `ezctx` directory. Otherwise, the singular output `.txt` file will live wherever the `npx ezctx` commands was executed. These default behaviors can be modified in the program's [configuration](#configuration).

This program runs on a _file-by-file_ basis to ensure that the size of the content in the current source code file plus the content in the current output `.txt` file is less than `chunkSize`. Effectively, this means that if one of your source code files is greater than `chunkSize`, it will not be added to an output `.txt` file.

### Output File

Before writing your project's source code to the output `.txt` file(s), this program creates a visualization of your project's files/directories from a recursively created graph. This visualization is added only to the first outputted `.txt` file. For example, the visualization of _this program_ looks like the below and is the first item written to the `ezctx_1.txt` output.

```
*** project structure ***

\ezctx
|__.ezctxrc.json
|__README.md
|__src/
   |__config.type.ts
   |__index.ts
   |__utils/
      |__buildGraph.ts
      |__loadConfig.ts
      |__outputFormatter.ts
      |__stringFormatter.ts
      |__utils.type.ts
      |__visualizeGraph.ts
      |__writeOutput.ts
|__tsconfig.json

```

Additionally, when writing each of your project's files to the output `.txt` file(s), they will be in the format defined below and will go under your project's visualization.

```
*** {file_name_1} ***

// ...

*** {file_name_2} ***

// ...

```

## Configuration

To modify this program's default "bundling" behavior, add a `JSON` file in the same directory where the `npx ezctx` command will be executed. This configuration file must contain the substring "ezctx" within its name, like `ezctx.config.json`, `.ezctxrc.json`, or `ezctx.json`. The modifiable configuration fields are defined below.

### Configuration Options

| Field              | Type       | Description                                                                                                                                                                                                                                                                     |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `chunkSize`        | `number`   | The maximum size (in bytes) of each output `.txt` file. This program's recursive process occurs on a file-by-file basis, so if a file's size is larger than `chunkSize`, it will not be included in the output `.txt` file(s).                                                  |
| `defaultIgnores`   | `boolean`  | Wether to use the program's default ignores. If `true`, the user defined `ignores` will be merged with the program's default `ignores` (see the default config below). If `false`, only the user defined `ignores` will be used.                                                |
| `ignores`          | `string[]` | The files/directories that will not be included in the output `.txt` file(s).                                                                                                                                                                                                   |
| `outDir`           | `string`   | The name of the directory where the output `.txt` file(s) will live under.                                                                                                                                                                                                      |
| `outDirSingleEmit` | `boolean`  | Applies when there is only a single output `.txt` file. If `true`, the outputted `.txt` file will live under `outDir`. If `false`, it will be placed wherever the `npx ezctx` command was executed.                                                                             |
| `outFile`          | `string`   | The name of each output `.txt` file. Add `{i}` to denote where the file's numbering should go within its name. If `{i}` is not included, the file's numbering (along with an underscore) will be added to the end of the file's name by default (see the default config below). |

### Default Configuration

If no configuration file is defined, or a field is omitted, the default configuration/corresponding field (defined below) will be used instead.

```
{
    chunkSize: Infinity,
    defaultIgnores: true,
    ignores: [
        "node_modules",
        "package-lock.json",
        "package.json",
        ".git",
        ".gitignore",
        ".DS_Store",
        ".vscode",
    ],
    outDir: "ezctx",
    outDirSingleEmit: false,
    outFile: "ezctx_{i}.txt"
}
```
