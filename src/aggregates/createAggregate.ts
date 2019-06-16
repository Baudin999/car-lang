import { IAggregate, IExpression } from "./../outline";
import { createERD } from "../erd/createERD";
import { purge } from "../helpers";

export const createAggregate = (aggregate: IAggregate, ast: IExpression[]) => {
  let root = ast.find((n: any) => n.id && n.id === aggregate.root) as IExpression;
  let valueObjects = purge(
    aggregate.valueObjects.map((v: string) => {
      return ast.find((n: any) => n.id && n.id === v) as IExpression;
    })
  );
  let erd = createERD([root, ...valueObjects]);

  return `
namespace ${aggregate.root} {
    ${erd}
}
    `.trim();
};
