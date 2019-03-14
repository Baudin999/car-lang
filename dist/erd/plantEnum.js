"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlantEnum {
    constructor(node) {
        this.node = node;
    }
    fields() {
        return this.node.options.map(o => `\t${o}`).join("\n");
    }
    toString() {
        return `
enum ${this.node.id} {
${this.fields()}
}
`.trim();
    }
}
exports.PlantEnum = PlantEnum;
//# sourceMappingURL=plantEnum.js.map