import { resolve, join } from "path";
import { writeFile } from "fs";
import { maybeRaiseError } from "./ckc";

export const init = (projectName: string) => {
  const p = resolve(projectName || ".");
  const carconfigFile = join(p, "carconfig.json");
  const body = {
    version: "0.0.1",
    title: "The title",
    description: "The description"
  };
  writeFile(carconfigFile, JSON.stringify(body, null, 4), "utf8", (error: any) => {
    maybeRaiseError(error);
    process.exit(0);
  });
};
