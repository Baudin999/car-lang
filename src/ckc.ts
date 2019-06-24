import * as program from "commander";
import { resolve, join } from "path";
import chalk from "chalk";
import * as opn from "open";
import { Project } from "./Project";
import { initProject } from "./ckc.init";
import { cliErrorMessageForModule } from "./ckc.errors";
import { purge } from "./helpers";
import * as promptly from "promptly";
const packageJSON = require("./../package.json");

let projectPath: string = resolve("./");
let moduleName: string | null = null;

// function id(val) {
//   return val;
// }

// function setModuleName(m) {
//   console.log(m);
//   moduleName = m;
// }

/**
//  *
//  * @param {string} projectPath path to the project
//  */
// function setProject(p) {
//   projectPath = resolve(p);
//   console.log(`Opening project at: ${projectPath}`);
// }

program.version(packageJSON.version, "-v, --version");
// .option("-a", "Output the AST, default is true")
// .option("-c", "Output the CST, default is false")
// .option("-f, --file <s>", "The input file", id)
// .option("-o, --open <s>", "Open a module", setModuleName)
// .option(
//   "-p, --project <s>",
//   "Specify the project directory, the 'carconfig.json' location",
//   setProject
// )
// .option("-u, --uml", "Output the UML")
// .option(
//   "-w, --watch",
//   "Watch for file changes, can only be used together with the <project> flag."
// )
// .option("-d, --deflate", "Output the deflated uml url");

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

      if (module) {
        let $module = project.modules.find(m => m.name === module);
        if (!$module) {
          console.log(
            `${module} could not be found in the result-set. Please check your code and try again.`
          );
        } else {
          if ($module.errors && $module.errors.length > 0) {
            console.log(chalk.red("We've found a few errors for you!"));
            console.log(cliErrorMessageForModule($module));
          }
        }
      } else {
        project.modules.forEach(m => {
          if (m.errors && m.errors.length > 0) {
            console.log(chalk.red(`\nWe've found some errors in module "${m.name}"`));
            console.log(cliErrorMessageForModule(m));
          } else {
            console.log(`Perfectly parsed module ${m.name}`);
          }
        });
      }
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
      // for await (const path of project.watchCarFiles()) {
      //   console.log(path);
      // }
    } catch (err) {
      console.log(err);
    }

    // log the errors

    // console.log("Building TypeScript");
    // console.log(project);
  });

program.parse(process.argv);

// program.on("error", e => {
//   console.log(e);
// });
// try {
//   program.parse(process.argv);
// } catch (e) {
//   console.log(e);
// }

/*
if (program.project && program.watch && !program.open) {
  // we'll watch the file system on save...
  new Project(projectPath)
    .verify()
    .then(project => {
      project.watch();

      setTimeout(() => {
        opn(project.indexPath);
      }, 100);
    })
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
} else if (program.project && !program.open) {
  // if we look at a project we'll want to the parse every file, then
  // include all the imports and do the rest...
  //runProgram(program.project);
  new Project(projectPath)
    .verify()
    .then(project => {
      project.compile();
    })
    .catch(error => {
      console.log(error);
      process.exit(1);
    });
}

if (program.file) {
  readFile(program.file, "utf8", (err, sourceCode) => {
    maybeRaiseError(err);

    const { errors, ast, tokens, cst } = transpile(sourceCode);

    if (errors && errors.length > 0) {
      console.log(JSON.stringify(errors, null, 4));
    } else if (program.uml) {
      console.log(createERD(ast));
    } else {
      console.log(JSON.stringify(ast, null, 4));
    }
    process.exit(0);
  });
}

// if (program.init) {
//   initProject(projectPath);
// }

if (program.open) {
  new Project(projectPath)
    .verify()
    .then(project => {
      if (!!!moduleName) {
        //
      }
    })
    .catch(err => {
      console.log(err);
    });

  readFile(join(projectPath, "carconfig.json"), "utf8", (err, data) => {
    if (err) {
      console.log(err);
      process.exit(1);
    }
    const config = JSON.parse(data);
    let version = config.version;
    if (!version.startsWith("v")) {
      version = "v" + version;
    }
    let versionPath = join(projectPath, config.outPath || ".out", version);

    if (moduleName === null) {
      const indexPath = join(versionPath, "index.html");
      opn(indexPath);
    } else {
      const htmlPath = join(versionPath, moduleName as string, moduleName + ".html");
      console.log("Opening: file://" + htmlPath);
      opn(htmlPath);
    }
  });
}

export const maybeRaiseError = error => {
  if (error) {
    console.log(error);
    process.exit(1);
  }
};
*/
