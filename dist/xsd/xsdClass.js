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
            let optional = tf.ofType === "Maybe" ? ` minOccurs="0"` : ` minOccurs="1"`;
            return `<xsd:element ref="self:${this.node.id}_${tf.id}"${optional} />`;
        })).join("\n");
        return `
    <xsd:complexType name="${this.node.id}">
        <xsd:all>
        ${fields}
        </xsd:all>
    </xsd:complexType>
        `;
    }
    simpleTypes() {
        const mapRestrictions = (field, fieldType) => {
            let $min = field.restrictions.find(r => r.key === "min");
            let $max = field.restrictions.find(r => r.key === "max");
            let $length = field.restrictions.find(r => r.key === "length");
            let $restrictions = field.restrictions;
            if (fieldType === "String") {
                if (!$min && !$length)
                    $restrictions.push({ key: "min", value: 1 });
                if (!$max && !$length)
                    $restrictions.push({ key: "max", value: 100 });
            }
            else if (fieldType === "Number") {
                if (!$min && !$length)
                    $restrictions.push({ key: "min", value: 1 });
                if (!$max && !$length)
                    $restrictions.push({ key: "max", value: 9999 });
            }
            return $restrictions.map(r => helpers_1.mapRestrictionToXSD(fieldType, r)).join("\n");
        };
        return helpers_1.purge(this.node.fields.map(field => {
            if (field.type !== outline_1.NodeType.TYPE_FIELD)
                return;
            let tf = field;
            let fieldType = tf.ofType === "Maybe" || tf.ofType === "List" ? tf.ofType_params[0] : tf.ofType;
            let isMaybe = tf.ofType === "Maybe";
            let isList = tf.ofType === "List";
            let restrictions = mapRestrictions(tf, fieldType);
            let annotations = tf.annotations
                .map(a => {
                if (a.key === "description") {
                    return `<xsd:documentation>${a.value}</xsd:documentation>`;
                }
                else {
                    return `<xsd:appinfo><key>${a.key}</key><value>${a.value}</value></xsd:appinfo>`;
                }
            })
                .join("\n");
            let xsdType = helpers_1.baseTypeToXSDType(fieldType);
            if (isList) {
                return `
    <xsd:element name="${this.node.id}_${tf.id}" nillable="false">
        <xsd:annotation>${annotations}</xsd:annotation>
        <xsd:complexType>
        <xsd:sequence>
        <xsd:element type="${xsdType}" name="foo" minOccurs="0" maxOccurs="100" />
        </xsd:sequence>
        </xsd:complexType>
    </xsd:element>
            `.trim();
            }
            else if (fieldType === "Char") {
                return `
          <xsd:element name="${this.node.id}_${tf.id}" nillable="false">
              <xsd:annotation>${annotations}</xsd:annotation>
              <xsd:simpleType>
          <xsd:restriction base="xsd:string">
            <xsd:minLength value="1" />
            <xsd:maxLength value="1" />
          </xsd:restriction>
        </xsd:simpleType>
          </xsd:element>
                  `.trim();
            }
            else if (xsdType.startsWith("xsd:")) {
                return `
    <xsd:element name="${this.node.id}_${tf.id}" nillable="false">
        <xsd:annotation>${annotations}</xsd:annotation>
        <xsd:simpleType>
        <xsd:restriction base="${xsdType}">
            ${restrictions}
        </xsd:restriction>
        </xsd:simpleType>
    </xsd:element>
            `.trim();
            }
            else if (xsdType.startsWith("self")) {
                return `
    <xsd:element name="${this.node.id}_${tf.id}" type="${xsdType}" nillable="false">
        <xsd:annotation>${annotations}</xsd:annotation>
    </xsd:element>
            `.trim();
            }
            else if (xsdType.startsWith("self")) {
                return `
    <xsd:element name="${this.node.id}_${tf.id}" type="${xsdType}" nillable="false">
        <xsd:annotation>${annotations}</xsd:annotation>
    </xsd:element>
            `.trim();
            }
            else {
                return "";
            }
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