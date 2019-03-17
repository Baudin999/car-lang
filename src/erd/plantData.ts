import { IType, NodeType, ITypeField, IExpression, IData, IDataOption } from "../outline";
import { baseTypes, foldText } from "../helpers";
import { ILookup } from "./createERD";

export class PlantData {
  node: IData;
  lookup: ILookup;
  constructor(node: IData, lookup: ILookup) {
    this.node = node;
    this.lookup = lookup;
  }

  options() {
    return this.node.options
      .map((f: IDataOption) => {
        return `\t${f.id}`;
      })
      .join("\n");
  }

  associations() {
    return this.node.options
      .map((field: any) => `${field.id} --> ${this.node.id} : ${field.id}`)
      .join("\n");
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
abstract ${this.node.id} {
${this.options()}
${this.annotations()}
}
${this.associations()}
`
      .trim()
      .replace(/\n\n+/g, "\n");
  }
}
