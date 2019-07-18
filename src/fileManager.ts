import { ITranspilationResult } from "./transpiler";
import { readFile } from "fs";
import { normalize, join } from "path";
import { path } from "app-root-path";
import { IOpen } from "./outline";

/**
 * A Module Name is a "dot" separated notation for
 * your file system.
 *
 * Example:
 * open Foo.Bar importing (Something)
 *
 * This module will be located at:
 * join(__dirname, "./..", "Foo/Bar.car");
 */
export const getFileFromModuleName = (module: IOpen, root?: string) => {
  const fileName = join(root || path, module.module.replace(/\./g, "/") + ".car");
  return fileName;
};

export const module = (fileName: string): Promise<ITranspilationResult> => {
  return new Promise((resolve, reject) => {
    readFile(normalize(fileName), "utf8", (err, source) => {
      //resolve(transpile(source));
    });
  });
};
