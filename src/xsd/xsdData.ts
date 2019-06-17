import { IData } from "../outline";
import { purge, baseTypeToXSDType, mapRestrictionToXSD } from "../helpers";

export class XsdData {
  private node: IData;
  constructor(node: IData) {
    if (!node) throw "There should be a node";
    this.node = node;
  }

  toString() {
    let id = this.node.id;
    const fields = purge(
      this.node.options.map(o => `<xsd:element type="self:${o.id}" name="${id}_${o.id}" />`)
    ).join("\n");

    return `
    <xsd:complexType name="${this.node.id}">
        <xsd:choice>
        ${fields}
        </xsd:choice>
    </xsd:complexType>
        `;
  }
}
