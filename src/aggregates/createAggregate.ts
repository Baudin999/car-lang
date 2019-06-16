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

  let operations = `
  <table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Input</th>
      <th>Output</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
  ${aggregate.operations
    .map(o =>
      `
    <tr>
    <td>${o.id}</td>
    <td>${o.params.map(p => `<div>${p.id}: ${p.ofType}</div>`).join("")}</td>
    <td>${o.result || (o as any).ofType}</td>
    <td>${o.annotations.map(a => `${a.key}: ${a.value}`).join("")}</td>
    </tr>
  `.trim()
    )
    .join("\n")}
  </tbody>

  </table>
  `.trim();

  return {
    plantSource: `
package "Aggregate: ${aggregate.root}" <<frame>> {
    ${erd}
}
    `.trim(),
    operations
  };
};
