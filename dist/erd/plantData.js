"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
class PlantData {
    constructor(node, lookup) {
        this.node = node;
        this.lookup = lookup;
    }
    options() {
        return this.node.options
            .map((f) => {
            return `\t${f.id}`;
        })
            .join("\n");
    }
    associations() {
        return this.node.options
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
    toString() {
        return `
abstract ${this.node.id} {
${this.options()}
${this.annotations()}
}
${this.associations()}
`
            .trim()
            .replace(/\n\n+/g, "\n");
    }
}
exports.PlantData = PlantData;
//# sourceMappingURL=plantData.js.map