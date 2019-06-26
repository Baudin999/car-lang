import * as program from "commander";
import { resolve, join } from "path";

import * as opn from "open";
import { Project } from "./Project";
import { initProject } from "./ckc.init";

import * as promptly from "promptly";
const packageJSON = require("./../package.json");

program.version(packageJSON.version, "-v, --version");

/**
 * INITIALIZE THE PROJECT
 */
program
  .command("init")
  .alias("i")
  .description("Initialize the project")
  .option(
    "-p, --path",
    "Optionally the path to the Project, is not specified the current directory will be used."
  )
  .action(async (...args) => {
    let path = args.reverse()[1] || ".";
    let projectPath = resolve(path);

    const name = await promptly.prompt("Name: ");
    const description = await promptly.prompt("Description: ", { default: "" });
    const xsdNamespace = await promptly.prompt("XSD namespace: ", { default: "no.namesapce.org/" });
    const jsonNamespace = await promptly.prompt("JSON Schema namespace: ", {
      default: "https://no.namespace.org/"
    });

    const config = {
      name,
      description,
      xsd: { namespace: xsdNamespace },
      json: { namespace: jsonNamespace }
    };

    let project = await initProject(projectPath, config);
  });

/**
 * Verify the current project
 */
program
  .command("verify")
  .option("-p, --path <path>", "The path to build")
  .description("Verify the current project")
  .action(async (...args) => {
    try {
      let { path = ".", ts = false, xsd = false, all = false, module } = args.reverse()[0];
      let fullPath = resolve(path);
      let result = await new Project(fullPath).verify();
      console.log(`Project at ${fullPath} has successfully been verified.`);
    } catch (error) {
      console.log(error);
    }
  });

program
  .command("clean")
  .option("-p, --path <path>", "path to be cleaned")
  .description("Clean the current builds and reset the output directory.")
  .action(async (...args) => {
    try {
      let { path = ".", ts = false, xsd = false, all = false, module } = args.reverse()[0];
      let fullPath = resolve(path);
      let result = await new Project(fullPath).clean();
      console.log(`Project at ${result.versionPath} has successfully cleaned.`);
    } catch (error) {
      console.log(error);
    }
  });

/**
 * Build the Project and return the result; including the errors.
 */
program
  .command("build")
  .alias("b")
  .description("Build the project")
  .option("-p, --path <path>", "The path to build")
  .option("-m, --module <module>", "The module which needs parsing")
  .option("--xsd", "Build the XSD output")
  .option("-t, --ts", "Build the TypeScript output")
  .option("-a, --all", "Generate all the output")
  .action(async (...args) => {
    try {
      let { path = ".", ts = false, xsd = false, all = false, module } = args.reverse()[0];
      let fullPath = resolve(path);
      let project = await new Project(fullPath).compile();
    } catch (err) {
      console.log(err);
    }
  });

program
  .command("watch")
  .alias("w")
  .option("-p, --path <path>", "The path to build")
  .description("Watch the project")
  .action(async (...args) => {
    try {
      let { path = ".", ts = false, xsd = false, all = false, module } = args.reverse()[0];
      let fullPath = resolve(path);
      let project = await new Project(fullPath).verify();
      project.watch();
    } catch (err) {
      console.log(err);
    }
  });

program
  .command("open")
  .alias("o")
  .option("-p, --path <path>", "The path to the project")
  .option("-m, --module <module>", "The name of the module")
  .description("Open the module")
  .action(async (...args) => {
    try {
      let { path = ".", ts = false, xsd = false, all = false, module } = args.reverse()[0];
      let fullPath = resolve(path);
      let project = await new Project(fullPath).verify();
      if (module) {
        let fileName = join(project.versionPath, module, module + ".html");
        console.log("Opening: " + fileName);
        opn(fileName);
      } else {
        let fileName = join(project.versionPath, "index.html");
        console.log("Opening: " + fileName);
        opn(fileName);
      }
    } catch (err) {
      console.log(err);
    }
  });

program.parse(process.argv);
