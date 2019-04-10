import { IAggregate, IExpression } from "./../outline";

export const createAggregate = (aggregate: IAggregate, ast: IExpression[]) => {
    return `
namespace ${aggregate.root} {
    class ${aggregate.root}
    ${aggregate.valueObjects.map(vo => `class ${vo}`).join("\n")}
}
    `.trim();
};
