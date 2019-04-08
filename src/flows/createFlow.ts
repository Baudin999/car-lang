import { IExpression, NodeType, IFlow } from "../outline";
import { purge, foldText } from "../helpers";

export const createFlow = (flow: IFlow): { sequence: string | null; useCase: string | null } => {
    const sequence: string[] = [];
    const sequenceEnd: string[] = [];
    const useCase: string[] = [];

    const titleDirective = flow.directives.find(d => d.key === "title");
    const title = titleDirective ? "title " + titleDirective.value : "";

    const operations = flow.operations.forEach((operation, i) => {
        let from = operation.annotations.find(a => a.key === "from");
        let to = operation.annotations.find(a => a.key === "to");
        if (from && to) {
            let descriptionAnnotation = operation.annotations.find(a => a.key === "description");
            let description = descriptionAnnotation
                ? "\n" + foldText(descriptionAnnotation.value)
                : "";
            let $from = from.value.replace(/ /g, "_");
            let $to = to.value.replace(/ /g, "_");
            let base = `"${from.value}" as ${$from} -> "${to.value}" as ${$to}`;
            let reversed = `"${to.value}" as ${$to} --> "${from.value}" as ${$from}`;
            let params = operation.params
                .map((p, i) => {
                    if (p.id) {
                        return `(${p.id}: ${p.ofType})`;
                    } else {
                        return `${p.ofType}`;
                    }
                })
                .join(" ->\\n\\t")
                .trim();
            sequence.push(`
${base}: ${params}
note over ${$to}
<i><b>${operation.id}</b></i>
${description}
end note
`);
            sequenceEnd.unshift(`${reversed}: ${operation.result}`);
        } else {
            const defs = operation.params
                .map(
                    param =>
                        `(${param.id ? param.id + ": " : ""}${param.ofType}) as ${operation.id}_${
                            param.ofType
                        }_${i}`
                )
                .join("\n");
            const froms = operation.params
                .map(param => `${operation.id}_${param.ofType}_${i} --> (${operation.id})`)
                .join("\n");
            const to = `(${operation.id}) --> (${operation.result})`;
            useCase.push("\n" + defs + "\n" + froms + "\n" + to + "\n");
        }
    });

    return {
        sequence:
            sequence.length > 0
                ? `
@startuml
${title}
autonumber "<b>[000]"
${purge(sequence).join("\n")}
${purge(sequenceEnd).join("\n")}
@enduml
            `.trim()
                : null,
        useCase:
            useCase.length > 0
                ? `
@startuml
${purge(useCase).join("\n")}
@enduml
            `.trim()
                : null
    };
};
