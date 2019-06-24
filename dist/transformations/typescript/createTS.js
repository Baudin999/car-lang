"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("./../../outline");
const helpers_1 = require("../../helpers");
exports.createTS = (ast) => {
    let choiceIds = ast
        .filter(n => n.type === outline_1.NodeType.CHOICE || n.type === outline_1.NodeType.ALIAS)
        .map((n) => n.id);
    const interfaces = helpers_1.purge(ast
        .filter(n => !n.ignore)
        .map(n => {
        if (n.type === outline_1.NodeType.TYPE) {
            return createTSType(n, choiceIds);
        }
        else if (n.type === outline_1.NodeType.CHOICE) {
            return createTSChoice(n);
        }
        else if (n.type === outline_1.NodeType.ALIAS) {
            return createTSAlias(n, choiceIds);
        }
        else if (n.type === outline_1.NodeType.DATA) {
            return createTSData(n);
        }
        else {
            return null;
        }
    }));
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
const createTSType = (node, choices) => {
    const description = node.annotations.find(a => a.key === "description");
    const fields = node.fields.map((field) => {
        let _ofType = field.ofType_params[0] ? field.ofType_params[0] : field.ofType;
        let isEnum = choices.indexOf(_ofType) > -1;
        let _type = isEnum ? _ofType : helpers_1.baseTypeToTypeScriptType(_ofType);
        if (field.ofType === "Maybe") {
            return `    ${field.id}: Maybe<${_type}>;`;
        }
        else if (field.ofType === "List") {
            return `    ${field.id}: ${_type}[];`;
        }
        else {
            return `    ${field.id}: ${_type};`;
        }
    });
    return `
${description
        ? `/**
${helpers_1.foldText(description.value, 80)}
 */`
        : ""}
interface I${node.id} {
${fields.join("\n")}
}
  `;
};
const createTSChoice = (node) => {
    return `enum ${node.id} {
${node.options.map(o => `    ${o.id.toString().replace(/ /, "_")} = "${o.id}"`).join(",\n")}
}`;
};
const createTSAlias = (node, choices) => {
    let _ofType = node.ofType_params[0] ? node.ofType_params[0] : node.ofType;
    let isEnum = choices.indexOf(_ofType) > -1;
    let _type = isEnum ? _ofType : helpers_1.baseTypeToTypeScriptType(_ofType);
    if (node.ofType === "Maybe") {
        return `type ${node.id} = Maybe<${_type}>;`;
    }
    else if (node.ofType === "List") {
        return `type ${node.id} = ${_type}[];`;
    }
    else {
        return `type ${node.id} = ${_type};`;
    }
};
const createTSData = (node) => {
    return `type I${node.id} = ${node.options.map(o => o.id).join(" | ")};`;
};
//# sourceMappingURL=createTS.js.map