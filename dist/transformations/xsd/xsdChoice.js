"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
class XsdChoice {
    constructor(node) {
        if (!node)
            throw "There should be a node";
        this.node = node;
    }
    toString() {
        const fields = helpers_1.purge(this.node.options.map(o => `<xsd:enumeration value="${o.id}"/>`)).join("\n");
        return `
    <xsd:simpleType name="${this.node.id}">
      <xsd:restriction base="xsd:string">
        ${fields}
      </xsd:restriction>
    </xsd:simpleType>
        `;
    }
}
exports.XsdChoice = XsdChoice;
//# sourceMappingURL=xsdChoice.js.map