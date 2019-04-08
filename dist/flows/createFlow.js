"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
exports.createFlow = (flow) => {
    const sequence = [];
    const sequenceEnd = [];
    const useCase = [];
    //console.log(JSON.stringify(flow, null, 4));
    const titleDirective = flow.directives.find(d => d.key === "title");
    const title = titleDirective ? "title " + titleDirective.value : "";
    const operations = flow.operations.forEach((operation, i) => {
        let from = operation.annotations.find(a => a.key === "from");
        let to = operation.annotations.find(a => a.key === "to");
        if (from && to) {
            let descriptionAnnotation = operation.annotations.find(a => a.key === "description");
            let description = descriptionAnnotation
                ? "\n" + helpers_1.foldText(descriptionAnnotation.value)
                : "";
            let $from = from.value.replace(/ /g, "_");
            let $to = to.value.replace(/ /g, "_");
            let base = `"${from.value}" as ${$from} -> "${to.value}" as ${$to}`;
            let reversed = `"${to.value}" as ${$to} --> "${from.value}" as ${$from}`;
            let params = operation.params
                .map((p, i) => {
                let params = p.ofType_params.length > 0 ? " " + p.ofType_params.join(" ") : "";
                if (p.id) {
                    return `(${p.id}: ${p.ofType}${params})`;
                }
                else {
                    return `${p.ofType}${params}`;
                }
            })
                .join(" ->\\n\\t")
                .trim();
            if ($from !== $to) {
                sequence.push(`
${base}: ${params}
note over ${$to}
<i><b>${operation.id}</b></i>
${description}
end note
`);
                sequenceEnd.unshift(`${reversed}: ${operation.result} ${operation.result_params.join(" ")}`);
            }
            else {
                const arrowDescription = params.length > 0
                    ? `${params} ->\\n\\t${operation.result} ${operation.result_params.join(" ")}`
                    : `${operation.result} ${operation.result_params.join(" ")}`;
                sequence.push(`
${base}: ${arrowDescription}
note right ${$to}
<i><b>${operation.id}</b></i>
${description}
end note

`);
            }
        }
        else {
            const defs = operation.params
                .map(param => `(${param.id ? param.id + ": " : ""}${param.ofType}) as ${operation.id}_${param.ofType}_${i}`)
                .join("\n");
            const froms = operation.params
                .map(param => `${operation.id}_${param.ofType}_${i} --> (${operation.id})`)
                .join("\n");
            const to = `(${operation.id}) --> (${operation.result})`;
            useCase.push("\n" + defs + "\n" + froms + "\n" + to + "\n");
        }
    });
    return {
        sequence: sequence.length > 0
            ? `
@startuml
${title}
autonumber "<b>[000]"
${helpers_1.purge(sequence).join("\n")}
${helpers_1.purge(sequenceEnd).join("\n")}
@enduml
            `.trim()
            : null,
        useCase: useCase.length > 0
            ? `
@startuml
${helpers_1.purge(useCase).join("\n")}
@enduml
            `.trim()
            : null
    };
};
//# sourceMappingURL=createFlow.js.map