"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFunction = (fun) => {
    //console.log(fun);
    let params = fun.params
        .map(param => {
        return `\tstate "${param.id || param.ofType}" as ${fun.id}_${param.id || param.ofType}`;
    })
        .join("\n");
    let operation = `state "Operation" as o${fun.id}`;
    let result = `\tstate "${fun.ofType}" as r${fun.id}_${fun.ofType} <<Result>>`;
    let nodes = fun.params
        .map(param => {
        return `\t${fun.id}_${param.id || param.type} --> o${fun.id} : param`;
    })
        .join("\n");
    return {
        template: `

state ${fun.id} {
${params}
${nodes}
${operation}
${result}
\to${fun.id} --> r${fun.id}_${fun.ofType} : return
}

        `
    };
};
//# sourceMappingURL=function.js.map