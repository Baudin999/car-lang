import { IExpression, IType, NodeType, ITypeField, IRestriction } from "../outline";
import { purge, baseTypeToXSDType, mapRestrictionToXSD } from "../helpers";

export class XsdClass {
    private node: IType;
    constructor(node: IType) {
        if (!node) throw "There shoulde be a node";
        this.node = node;
    }

    complexType() {
        const fields = purge(
            this.node.fields.map(field => {
                if (field.type !== NodeType.TYPE_FIELD) return;
                let tf = field as ITypeField;
                let optional = tf.ofType === "Maybe" ? ` minOccurs="0"` : ` minOccurs="1"`;
                return `<xsd:element ref="self:${this.node.id}_${tf.id}"${optional}/>`;
            })
        ).join("\n");

        return `
    <xsd:complexType name="${this.node.id}">
        <xsd:sequence>
        ${fields}
        </xsd:sequence>
    </xsd:complexType>
        `;
    }

    simpleTypes() {
        const mapRestrictions = (field: ITypeField, fieldType: string): string => {
            let $min = field.restrictions.find(r => r.key === "min");
            let $max = field.restrictions.find(r => r.key === "max");
            let $length = field.restrictions.find(r => r.key === "length");
            let $restrictions = field.restrictions;
            if (fieldType === "String") {
                if (!$min && !$length) $restrictions.push({ key: "min", value: 1 });
                if (!$max && !$length) $restrictions.push({ key: "max", value: 100 });
            } else if (fieldType === "Number") {
                if (!$min && !$length) $restrictions.push({ key: "min", value: 1 });
                if (!$max && !$length) $restrictions.push({ key: "max", value: 9999 });
            }
            return $restrictions.map(r => mapRestrictionToXSD(fieldType, r)).join("\n");
        };

        return purge(
            this.node.fields.map(field => {
                if (field.type !== NodeType.TYPE_FIELD) return;
                let tf = field as ITypeField;
                let fieldType =
                    tf.ofType === "Maybe" || tf.ofType === "List" ? tf.ofType_params[0] : tf.ofType;
                let isMaybe = tf.ofType === "Maybe";
                let isList = tf.ofType === "List";
                let restrictions = mapRestrictions(tf, fieldType);
                let annotations = tf.annotations
                    .map(a => {
                        if (a.key === "description") {
                            return `<xsd:documentation>${a.value}</xsd:documentation>`;
                        } else {
                            return `<xsd:appinfo><key>${a.key}</key><value>${
                                a.value
                            }</value></xsd:appinfo>`;
                        }
                    })
                    .join("\n");
                let xsdType = baseTypeToXSDType(fieldType);

                if (xsdType.startsWith("xsd:")) {
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
                } else if (xsdType.startsWith("self")) {
                    return `
    <xsd:element name="${this.node.id}_${tf.id}" type="${xsdType}" nillable="false">
        <xsd:annotation>${annotations}</xsd:annotation>
    </xsd:element>
            `.trim();
                } else {
                    return "";
                }
            })
        ).join("\n");
    }

    toString() {
        return `
${this.simpleTypes()}
${this.complexType()}        
        `.trim();
    }
}
