import { IAlias, IRestriction } from "../../outline";

export const createTableALIAS = (node: IAlias) => {
  const title = `<h2>${node.id}</h2>`;
  const description = node.annotations.find(a => a.key === "description");

  const fields = node.restrictions
    .map((f: IRestriction) =>
      `
  <tr>
    <td>${f.key}</td>
    <td>${f.value}</td>
    <td></td>
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
      <th>Restriction</th>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    ${fields}
  </tbody>

</table>

  `.trim();
};
