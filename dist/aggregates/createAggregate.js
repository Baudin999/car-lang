"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createERD_1 = require("../erd/createERD");
const helpers_1 = require("../helpers");
exports.createAggregate = (aggregate, ast) => {
    let root = ast.find((n) => n.id && n.id === aggregate.root);
    let valueObjects = helpers_1.purge(aggregate.valueObjects.map((v) => {
        return ast.find((n) => n.id && n.id === v);
    }));
    let erd = createERD_1.createERD([root, ...valueObjects]);
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
        .map(o => `
    <tr>
    <td>${o.id}</td>
    <td>${o.params.map(p => `<div>${p.id}: ${p.ofType}</div>`).join("")}</td>
    <td>${o.result || o.ofType}</td>
    <td>${o.annotations.map(a => `${a.key}: ${a.value}`).join("")}</td>
    </tr>
  `.trim())
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
//# sourceMappingURL=createAggregate.js.map