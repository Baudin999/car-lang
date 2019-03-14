"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../outline");
const helpers_1 = require("../helpers");
class PlantClass {
    constructor(node, lookup) {
        this.node = node;
        this.lookup = lookup;
    }
    fields() {
        return this.node.fields
            .filter(n => n.type === outline_1.NodeType.TYPE_FIELD)
            .map((f) => {
            const source = f.source ? ` <i>from ${f.source}</i>` : "";
            return `\t${f.id}: ${f.ofType} ${f.ofType_params.join(" ")}${source}`;
        })
            .join("\n");
    }
    associations() {
        return this.node.fields
            .filter((field) => this.lookup.types.indexOf(field.ofType) > -1 ||
            this.lookup.enums.indexOf(field.ofType) > -1)
            .map((field) => `${field.id} --> ${this.node.id} : ${field.id}`)
            .join("\n");
    }
    extensions() {
        return this.node.extends
            .filter((extension) => this.lookup.types.indexOf(extension) > -1)
            .map((extension) => `${extension} --|> ${this.node.id}`)
            .join("\n");
    }
    annotations() {
        return this.node.annotations.map(a => helpers_1.foldText(`<b>${a.key}</b>: ${a.value}`));
    }
    source() {
        return this.node.source ? `<${this.node.source}>` : "";
    }
    toString() {
        return `
class ${this.node.id}${this.source()} {
${this.fields()}
---
${this.annotations()}
}
${this.associations()}
${this.extensions()}
${this.node.source ? `${this.node.source} --* ${this.node.id}: ALIAS` : ""}
`
            .trim()
            .replace(/\n\n+/g, "\n");
    }
}
exports.PlantClass = PlantClass;
//# sourceMappingURL=plantClass.js.map