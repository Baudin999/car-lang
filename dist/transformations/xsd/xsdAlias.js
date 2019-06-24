"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../../helpers");
class XsdAlias {
    constructor(node) {
        this.mapRestrictions = () => {
            let $min = this.node.restrictions.find(r => r.key === "min");
            let $max = this.node.restrictions.find(r => r.key === "max");
            let $length = this.node.restrictions.find(r => r.key === "length");
            let $restrictions = this.node.restrictions;
            if (this.$type === "String") {
                if (!$min && !$length)
                    $restrictions.push({ key: "min", value: 1 });
                if (!$max && !$length)
                    $restrictions.push({ key: "max", value: 100 });
            }
            else if (this.$type === "Number") {
                if (!$min && !$length)
                    $restrictions.push({ key: "min", value: 1 });
                if (!$max && !$length)
                    $restrictions.push({ key: "max", value: 9999 });
            }
            return $restrictions.map(r => helpers_1.mapRestrictionToXSD(this.$type, r)).join("\n");
        };
        if (!node)
            throw "There should be a node";
        this.node = node;
        this.$type =
            this.node.ofType === "Maybe" || this.node.ofType === "List"
                ? this.node.ofType_params[0]
                : this.node.ofType;
    }
    toString() {
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
        <xsd:simpleType name="${this.node.id}">
            <xsd:restriction base="${helpers_1.baseTypeToXSDType(this.$type)}">
                ${this.mapRestrictions()}
            </xsd:restriction>
        </xsd:simpleType>
        `;
    }
}
exports.XsdAlias = XsdAlias;
//# sourceMappingURL=xsdAlias.js.map