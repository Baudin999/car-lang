import { IType, NodeType, ITypeField, IExpression } from "../outline";
import { baseTypes } from "../helpers";
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
    return this.node.fields
      .filter(
        (field: any) =>
          this.lookup.types.indexOf(field.ofType) > -1 ||
          this.lookup.enums.indexOf(field.ofType) > -1
      )
      .map((field: any) => `${field.id} --> ${this.node.id} : ${field.id}`)
      .join("\n");
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

  toString(): string {
    return `
class ${this.node.id}${this.source()} {
${this.fields()}
}
${this.associations()}
${this.extensions()}
${this.node.source ? `${this.node.source} --* ${this.node.id}: ALIAS` : ""}
`
      .trim()
      .replace(/\n\n+/g, "\n");
  }
}
