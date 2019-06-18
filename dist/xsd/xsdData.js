"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
class XsdData {
    constructor(node) {
        if (!node)
            throw "There should be a node";
        this.node = node;
    }
    toString() {
        let id = this.node.id;
        const fields = helpers_1.purge(this.node.options.map(o => `<xsd:element type="self:${o.id}" name="${id}_${o.id}" />`)).join("\n");
        return `
    <xsd:complexType name="${this.node.id}">
        <xsd:choice>
        ${fields}
        </xsd:choice>
    </xsd:complexType>
        `;
    }
}
exports.XsdData = XsdData;
//# sourceMappingURL=xsdData.js.map