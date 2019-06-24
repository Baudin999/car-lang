import { IPubSub, IOperation } from "../../outline";

export const createOperation = (fun: IOperation, i: number) => {
  let index = i * 2;

  let fromName = fun.from.replace(" ", "_");
  let toName = fun.to.replace(" ", "_");

  let params = fun.params
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
participant "${fun.from}" as ${fromName} order ${index}
participant "${fun.to}" as ${toName} order ${index + 1}

${fromName} -> ${toName} : ${params}
activate ${toName}
        `,
    results: `
${toName} --> ${fromName} : ${fun.result}
deactivate ${toName}
        `
  };
};
