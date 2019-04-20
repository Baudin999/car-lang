"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMap = (node) => {
    const titleDirective = node.directives.find(d => d.key === "title");
    const title = titleDirective ? "title " + titleDirective.value : "";
    let maps = node.flows
        .map((flow) => {
        let result = "";
        for (let i = 0; i < flow.nodes.length - 1; ++i) {
            result += `(${flow.nodes[i]}) -> (${flow.nodes[i + 1]})\n`;
        }
        return result;
    })
        .join("\n\n");
    let rows = "";
    for (let i = 0; i < node.flows.length - 1; ++i) {
        rows += `(${node.flows[i].nodes[0]}) -[hidden]-> (${node.flows[i + 1].nodes[0]})\n`;
    }
    return `
@startuml
${title}
${maps}
${rows}
@enduml    
    `.trim();
};
//# sourceMappingURL=createMap.js.map