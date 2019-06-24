import { IType, ITypeField, NodeType } from "../../outline";

export const createTableTYPE = (node: IType) => {
  const title = `<h2>${node.id}</h2>`;
  const description = node.annotations.find(a => a.key === "description");

  const fields = node.fields
    .filter(f => f.type === NodeType.TYPE_FIELD)
    .map((f: ITypeField) =>
      `
  <tr>
    <td>${f.id}</td>
    <td>${f.ofType} ${f.ofType_params.join(" ")}</td>
    <td>${f.restrictions.map(r => `<div><b>${r.key}</b>: ${r.value}</div>`).join("\n")}</td>
    <td>${f.annotations.map(r => `<div><b>${r.key}</b>: ${r.value}</div>`).join("\n")}</td>
  </tr>
  `.trim()
    )
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
