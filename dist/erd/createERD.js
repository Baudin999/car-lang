"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("./../outline");
const plantClass_1 = require("./plantClass");
const plantData_1 = require("./plantData");
const helpers_1 = require("../helpers");
const plantEnum_1 = require("./plantEnum");
const types = [outline_1.NodeType.TYPE, outline_1.NodeType.ALIAS, outline_1.NodeType.DATA, outline_1.NodeType.CHOICE];
exports.createERD = (ast, title) => {
    let lookup = {
        types: ast
            .filter((node) => node.type && node.type === outline_1.NodeType.TYPE)
            .map((n) => n.id),
        enums: ast
            .filter((node) => node.type && node.type === outline_1.NodeType.CHOICE)
            .map((n) => n.id),
        data: ast.filter((node) => node.type && node.type === outline_1.NodeType.DATA).map((n) => n.id)
    };
    const transformedNodes = ast.map(node => {
        if (node.type && node.type === outline_1.NodeType.TYPE) {
            return new plantClass_1.PlantClass(node, lookup).toString();
        }
        else if (node.type && node.type === outline_1.NodeType.CHOICE) {
            return new plantEnum_1.PlantEnum(node).toString();
        }
        else if (node.type && node.type === outline_1.NodeType.DATA) {
            return new plantData_1.PlantData(node, lookup).toString();
        }
        return null;
    });
    if (title) {
        transformedNodes.unshift(`title: ${title}\n`);
    }
    return helpers_1.purge(transformedNodes).join("\n");
};
exports.createView = (view, ast) => {
    const title = view.directives.find(d => d.key === "title");
    const viewAST = view.nodes.map(node => {
        return ast.find((n) => n.id && n.id === node);
    });
    return exports.createERD(viewAST, title ? title.value : undefined);
};
//# sourceMappingURL=createERD.js.map