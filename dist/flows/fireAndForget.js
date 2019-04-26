"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFireAndForget = (fun, i) => {
    let index = i * 2;
    console.log(fun);
    let fromName = fun.from.replace(" ", "_");
    let toName = fun.to.replace(" ", "_");
    let params = fun.params
        .map(m => {
        if (m.id && m.id !== m.ofType) {
            return `(${m.id}:${m.ofType})`;
        }
        else {
            return m.ofType;
        }
    })
        .join(" -> ");
    return {
        template: `
participant "${fun.from}" as ${fromName} order ${index}
participant "${fun.to}" as ${toName} order ${index + 1}

${fromName} o-> ${toName} : ${params}
        `
    };
};
//# sourceMappingURL=fireAndForget.js.map