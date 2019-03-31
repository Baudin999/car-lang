"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../outline");
const helpers_1 = require("../helpers");
class XsdClass {
    constructor(node) {
        if (!node)
            throw "There shoulde be a node";
        this.node = node;
    }
    complexType() {
        const fields = helpers_1.purge(this.node.fields.map(field => {
            if (field.type !== outline_1.NodeType.TYPE_FIELD)
                return;
            let tf = field;
            return `<xsd:element ref="self:${this.node.id}_${tf.id}" />`;
        })).join("\n");
        return `
    <xsd:complexType name="${this.node.id}">
        <xsd:sequence>
        ${fields}
        </xsd:sequence>
    </xsd:complexType>
        `;
    }
    simpleTypes() {
        return helpers_1.purge(this.node.fields.map(field => {
            if (field.type !== outline_1.NodeType.TYPE_FIELD)
                return;
            let tf = field;
            let restrictions = tf.restrictions.map(r => helpers_1.mapRestrictionToXSD(tf.ofType, r)).join("\n");
            return `
    <xsd:element name="${this.node.id}_${tf.id}">
        <xsd:simpleType>
        <xsd:restriction base="${helpers_1.baseTypeToXSDType(tf.ofType)}">
            ${restrictions}
        </xsd:restriction>
        </xsd:simpleType>
    </xsd:element>
            `.trim();
        })).join("\n");
    }
    toString() {
        return `
${this.simpleTypes()}
${this.complexType()}        
        `.trim();
    }
}
exports.XsdClass = XsdClass;
//# sourceMappingURL=xsdClass.js.map