import { IExpression, IType, NodeType, ITypeField } from "../outline";
import { purge, baseTypeToXSDType, mapRestrictionToXSD } from "../helpers";




export class XsdClass {
    private node: IType;
    constructor(node: IType) {
        if (!node) throw "There shoulde be a node"
        this.node = node;
    }

    complexType() {

        const fields = purge(this.node.fields.map(field => {
            if (field.type !== NodeType.TYPE_FIELD) return;
            let tf = field as ITypeField;
            return `<xsd:element ref="self:${this.node.id}_${tf.id}" />`

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
        return purge(this.node.fields.map(field => {
            if (field.type !== NodeType.TYPE_FIELD) return;
            let tf = field as ITypeField;
            let restrictions = tf.restrictions.map(r => mapRestrictionToXSD(tf.ofType, r)).join("\n")
            
            return `
    <xsd:element name="${this.node.id}_${tf.id}">
        <xsd:simpleType>
        <xsd:restriction base="${baseTypeToXSDType(tf.ofType)}">
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

