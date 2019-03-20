"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../outline");
exports.createTableTYPE = (node) => {
    const title = `<h2>${node.id}</h2>`;
    const description = node.annotations.find(a => a.key === "description");
    const fields = node.fields
        .filter(f => f.type === outline_1.NodeType.TYPE_FIELD)
        .map((f) => `
  <tr>
    <td>${f.id}</td>
    <td>${f.ofType} ${f.ofType_params.join(" ")}</td>
    <td></td>
    <td></td>
  </tr>
  `.trim())
        .join("\n");
    return `

<table>
  <thead>
    <tr>
      <th colSpan="4">
        ${title}
      </th>
    </tr>
    <tr>
      <th colSpan="4">
        ${description ? description.value : "No description"}
      </th>
    </tr>
    <tr>
      <th>Name</th>
      <th>Type</th>
      <th>Restrictions</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    ${fields}
  </tbody>

</table>

  `.trim();
};
//# sourceMappingURL=tableTYPE.js.map