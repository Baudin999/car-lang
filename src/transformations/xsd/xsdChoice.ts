import { IExpression, IType, NodeType, ITypeField, IRestriction, IChoice } from "../../outline";
import { purge, baseTypeToXSDType, mapRestrictionToXSD } from "../../helpers";

export class XsdChoice {
  private node: IChoice;
  constructor(node: IChoice) {
    if (!node) throw "There should be a node";
    this.node = node;
  }

  toString() {
    const fields = purge(this.node.options.map(o => `<xsd:enumeration value="${o.id}"/>`)).join(
      "\n"
    );

    return `
    <xsd:simpleType name="${this.node.id}">
      <xsd:restriction base="xsd:string">
        ${fields}
      </xsd:restriction>
    </xsd:simpleType>
        `;
  }
}
