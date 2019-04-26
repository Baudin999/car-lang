import { IPubSub } from "../outline";

export const createPub = (fun: IPubSub, i: number) => {
    let index = i * 2;
    let serviceName = fun.service.replace(" ", "_");
    let params = fun.message
        .map(m => {
            if (m.id && m.id !== m.ofType) {
                return `(${m.id}:${m.ofType})`;
            } else {
                return m.ofType;
            }
        })
        .join(" -> ");

    return {
        template: `
participant "${fun.service}" as ${serviceName} order ${index}
participant "${fun.event}" << (E,#ADD1B2) Event >> order ${index + 100}
${serviceName} ->o "${fun.event}" : ${params}
||25||
        `
    };
};
