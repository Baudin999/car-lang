import { IModule } from "./helpers";
import chalk from "chalk";

export const cliErrorMessageForModule = (module: IModule): string => {
  let errors = module.errors.map(error => {
    let indicator = chalk.yellow(
      `[${module.name}: line ${error.startLineNumber} column ${error.startColumn}]`
    );
    return `${indicator} ${error.message}`;
  });

  return errors.join("\n") + "\n";
};
