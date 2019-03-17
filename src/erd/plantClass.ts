import { IType, NodeType, ITypeField, IExpression } from "../outline";
import { baseTypes, foldText } from "../helpers";
import { ILookup } from "./createERD";

export class PlantClass {
  node: IType;
  lookup: ILookup;
  constructor(node: IType, lookup: ILookup) {
    this.node = node;
    this.lookup = lookup;
  }

  fields() {
    return this.node.fields
      .filter(n => n.type === NodeType.TYPE_FIELD)
      .map((f: ITypeField) => {
        const source = f.source ? ` <i>from ${f.source}</i>` : "";
        return `\t${f.id}: ${f.ofType} ${f.ofType_params.join(" ")}${source}`;
      })
      .join("\n");
  }

  associations() {
    const normalFields = this.node.fields
      .filter((field: any) => field.ofType !== "Maybe" && field.ofType !== "List")
      .filter(
        (field: any) =>
          this.lookup.types.indexOf(field.ofType) > -1 ||
          this.lookup.data.indexOf(field.ofType) > -1 ||
          this.lookup.enums.indexOf(field.ofType) > -1
      )
      .map((field: any) => `${field.id} --> ${this.node.id} : ${field.id}`);

    const maybeFields = this.node.fields
      .filter((f: any) => f.ofType && f.ofType === "Maybe")
      .filter((field: any) => baseTypes.indexOf(field.ofType_params[0]) === -1)
      .map(
        (field: any) =>
          `${field.ofType_params[0]} "0" --> "1" ${this.node.id} : Maybe ${field.ofType_params[0]}`
      );

    const listFields = this.node.fields
      .filter((f: any) => f.ofType && f.ofType === "List")
      .filter((field: any) => baseTypes.indexOf(field.ofType_params[0]) === -1)
      .map(
        (field: any) =>
          `${field.ofType_params[0]} "0" --> "*" ${this.node.id} : List ${field.ofType_params[0]}`
      );

    return [...normalFields, ...maybeFields, ...listFields].join("\n");
  }

  extensions() {
    return this.node.extends
      .filter((extension: any) => this.lookup.types.indexOf(extension) > -1)
      .map((extension: any) => `${extension} --|> ${this.node.id}`)
      .join("\n");
  }

  source() {
    return this.node.source ? `<${this.node.source}>` : "";
  }

  annotations() {
    if (this.node.annotations.length === 0) return "";
    const annotations = this.node.annotations
      .map(a => foldText(`<b>${a.key}</b>: ${a.value}`))
      .join("\n");
    return `
  ---
  ${annotations}
    `;
  }

  toString(): string {
    return `
class ${this.node.id}${this.source()} {
${this.fields()}
${this.annotations()}
}
${this.associations()}
${this.extensions()}
${this.node.source ? `${this.node.source} --* ${this.node.id}: ALIAS` : ""}
`
      .trim()
      .replace(/\n\n+/g, "\n");
  }
}
