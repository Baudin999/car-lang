import { IConfiguration, IModule } from "../src/helpers";
import { Module } from "./../src/Module";
import {
  substitutePluckedFields,
  substituteAliases,
  substituteExtensions
} from "../src/substitute";
import { typeChecker } from "../src/tchecker";

export const fakeConfig: IConfiguration = {
  version: "0",
  name: "test",
  json: {
    namespace: "test"
  },
  xsd: {
    namespace: "test"
  }
};

export const fakeModule = async (source: string): Promise<IModule> => {
  let module = await new Module("", fakeConfig).update(source);
  module = await module.parse();
  let r0 = substituteAliases(module.ast);
  let r1 = substituteExtensions(r0.ast);
  let r2 = substitutePluckedFields(r1.ast);
  let errors = typeChecker(r2.ast);

  module.ast = r2.ast;
  module.errors = [...module.errors, ...r0.errors, ...r1.errors, ...r2.errors, ...errors];
  return module;
};
