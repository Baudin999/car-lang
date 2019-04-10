"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
class PlantEnum {
    constructor(node) {
        this.node = node;
    }
    fields() {
        return this.node.options.map(o => `\t${o.id}`).join("\n");
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
enum ${this.node.id} {
${this.fields()}
${this.annotations()}
}
`.trim();
    }
}
exports.PlantEnum = PlantEnum;
//# sourceMappingURL=plantEnum.js.map