// import { resolve, join } from "path";
// import { writeFile } from "fs";
// import { maybeRaiseError } from "./ckc";
import { Project } from "./Project";

export const initProject = (projectPath: string, config: any) => {
  new Project(projectPath)
    .init(config)
    .then(success => {
      if (success) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(e => {
      console.error("Failed to initialize the project");
      console.error(e);
      process.exit(1);
    });
};
