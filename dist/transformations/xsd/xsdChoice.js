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
        const fields = helpers_1.purge(this.node.options.map(o => `<xsd:element name="${o.id}"/>`)).join("\n");
        return `
    <xsd:complexType name="${this.node.id}">
        <xsd:choice>
        ${fields}
        </xsd:choice>
    </xsd:complexType>
        `;
    }
}
exports.XsdChoice = XsdChoice;
//# sourceMappingURL=xsdChoice.js.map