"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
class PlantData {
    constructor(node, lookup) {
        this.node = node;
        this.lookup = lookup;
        this.lookupValues = [...lookup.data, ...lookup.enums, ...lookup.types];
    }
    options() {
        return this.node.options
            .map((f) => {
            return `\t${f.id} ${(f.params || []).join(" ")}`;
        })
            .join("\n");
    }
    associations() {
        return this.node.options
            .filter(field => this.lookupValues.indexOf(field.id) > -1)
            .map((field) => `${field.id} --> ${this.node.id} : ${field.id}`)
            .join("\n");
    }
    annotations() {
        if (this.node.annotations.length === 0)
            return "";
        const annotations = this.node.annotations
            .map(a => helpers_1.foldText(`<b>${a.key}</b>: ${a.value}`))
            .join("\n");
        return `
  ---
  ${annotations}
    `;
    }
    paramAssociations() {
        const fieldParams = this.node.options
            .map(option => {
            return (option.params || []).filter(p => /[A-Z].*/.test(p)).map(param => {
                return `${param} ..|> ${this.node.id} : ${option.id} <i>${param}</i>`;
            });
        });
        return helpers_1.purge(fieldParams).join("\n");
    }
    params() {
        return this.node.params ?
            " " + this.node.params.join(" ") : "";
    }
    toString() {
        return `
abstract "${this.node.id}${this.params()}" as ${this.node.id} {
${this.options()}
${this.annotations()}
}
${this.associations()}
${this.paramAssociations()}
`
            .trim()
            .replace(/\n\n+/g, "\n");
    }
}
exports.PlantData = PlantData;
//# sourceMappingURL=plantData.js.map