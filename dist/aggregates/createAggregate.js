"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAggregate = (aggregate, ast) => {
    return `
namespace ${aggregate.root} {
    class ${aggregate.root}
    ${aggregate.valueObjects.map(vo => `class ${vo}`).join("\n")}
}
    `.trim();
};
//# sourceMappingURL=createAggregate.js.map