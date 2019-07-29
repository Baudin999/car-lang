"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../../outline");
const helpers_1 = require("../../helpers");
class XsdClass {
    constructor(node) {
        if (!node)
            throw "There shoulde be a node";
        this.node = node;
    }
    /*
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
  
    */
    complexType() {
        const fields = helpers_1.purge(this.node.fields.map(field => {
            if (field.type !== outline_1.NodeType.TYPE_FIELD)
                return;
            else if ("ofType" in field) {
                if (helpers_1.baseTypes.indexOf(field.ofType) > -1) {
                    return createBaseTypedElement(field, true);
                }
                else if (field.ofType === "Maybe") {
                    if (helpers_1.baseTypes.indexOf(field.ofType_params[0]) > -1) {
                        // This is a Maybe of a base type like String or Number...
                        return createBaseTypedElement(field, false);
                    }
                    else {
                        console.log(JSON.stringify(field, null, 4));
                        // maybe type of an alias or another reference...
                        let name = field.ofType_params[0];
                        return `<xsd:element name="${name}" type="self:${name}" minOccurs="0" maxOccurs="1" />`;
                    }
                }
                else if (field.ofType === "List") {
                    return null;
                }
                else {
                    return `<xsd:element name="${field.ofType}" type="self:${field.ofType}" minOccurs="1" maxOccurs="1" />`;
                }
            }
            else {
                return null;
            }
        })).join("\n");
        let annotations = this.node.annotations
            .map(a => {
            if (a.key === "description") {
                return `<xsd:documentation>${a.value}</xsd:documentation>`;
            }
            else {
                return `<xsd:appinfo><key>${a.key}</key><value>${a.value}</value></xsd:appinfo>`;
            }
        })
            .join("\n");
        return `
    <xsd:complexType name="${this.node.id}">
        <xsd:annotation>
          ${annotations}
        </xsd:annotation>
        <xsd:all>
        ${fields}
        </xsd:all>
    </xsd:complexType>
        `;
    }
    simpleTypes() {
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
const createBaseTypedElement = (field, required) => {
    let t = required ? field.ofType : field.ofType_params[0];
    let xsdType = helpers_1.baseTypeToXSDType(t);
    let restrictions = mapRestrictions(field, t);
    let annotations = field.annotations
        .map(a => {
        if (a.key === "description") {
            return `<xsd:documentation>${a.value}</xsd:documentation>`;
        }
        else {
            return `<xsd:appinfo><key>${a.key}</key><value>${a.value}</value></xsd:appinfo>`;
        }
    })
        .join("\n");
    return `
<xsd:element name="${field.id}" minOccurs="${required ? "1" : "0"}" maxOccurs="1">
<xsd:annotation>${annotations}</xsd:annotation>
<xsd:simpleType>
<xsd:restriction base="${xsdType}">
  ${restrictions}
</xsd:restriction>
</xsd:simpleType>
</xsd:element>
`.trim();
};
//# sourceMappingURL=xsdClass.js.map