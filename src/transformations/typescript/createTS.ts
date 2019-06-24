import { IExpression, IType, NodeType, IChoice, IAlias, IData } from "./../../outline";
import { baseTypeToTypeScriptType, purge, foldText } from "../../helpers";

export const createTS = (ast: IExpression[]) => {
  let choiceIds = ast
    .filter(n => n.type === NodeType.CHOICE || n.type === NodeType.ALIAS)
    .map((n: any) => n.id);

  const interfaces = purge(
    ast
      .filter(n => !(n as any).ignore)
      .map(n => {
        if (n.type === NodeType.TYPE) {
          return createTSType(n as IType, choiceIds);
        } else if (n.type === NodeType.CHOICE) {
          return createTSChoice(n as IChoice);
        } else if (n.type === NodeType.ALIAS) {
          return createTSAlias(n as IAlias, choiceIds);
        } else if (n.type === NodeType.DATA) {
          return createTSData(n as IData);
        } else {
          return null;
        }
      })
  );

  return `
/*
GENERATED ON: ${Date.now()}
*/ 


// The Maybe Monad implemented in TypeScript
type Maybe<T> = Nothing<T> | Just<T>

class Just<T> {
  a: T;
  constructor(a) {
    if (a !== null && a !== undefined) this.a = a;
    // @ts-ignore
    else return new Nothing();
  }
}

class Nothing<T> {}

// IMPLEMENTATION

${interfaces.join("\n").replace(/\n\n+/, "\n")}
    `;
};

const createTSType = (node: IType, choices: string[]) => {
  const description = node.annotations.find(a => a.key === "description");
  const fields = node.fields.map((field: any) => {
    let _ofType = field.ofType_params[0] ? field.ofType_params[0] : field.ofType;
    let isEnum = choices.indexOf(_ofType) > -1;
    let _type = isEnum ? _ofType : baseTypeToTypeScriptType(_ofType);

    if (field.ofType === "Maybe") {
      return `    ${field.id}: Maybe<${_type}>;`;
    } else if (field.ofType === "List") {
      return `    ${field.id}: ${_type}[];`;
    } else {
      return `    ${field.id}: ${_type};`;
    }
  });

  return `
${
  description
    ? `/**
${foldText(description.value, 80)}
 */`
    : ""
}
interface I${node.id} {
${fields.join("\n")}
}
  `;
};

const createTSChoice = (node: IChoice) => {
  return `enum ${node.id} {
${node.options.map(o => `    ${o.id.toString().replace(/ /, "_")} = "${o.id}"`).join(",\n")}
}`;
};

const createTSAlias = (node: IAlias, choices) => {
  let _ofType = node.ofType_params[0] ? node.ofType_params[0] : node.ofType;
  let isEnum = choices.indexOf(_ofType) > -1;
  let _type = isEnum ? _ofType : baseTypeToTypeScriptType(_ofType);

  if (node.ofType === "Maybe") {
    return `type ${node.id} = Maybe<${_type}>;`;
  } else if (node.ofType === "List") {
    return `type ${node.id} = ${_type}[];`;
  } else {
    return `type ${node.id} = ${_type};`;
  }
};

const createTSData = (node: IData) => {
  return `type I${node.id} = ${node.options.map(o => o.id).join(" | ")};`;
};
