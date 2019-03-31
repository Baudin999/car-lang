"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("./../outline");
const helpers_1 = require("../helpers");
const xsdClass_1 = require("./xsdClass");
const types = [outline_1.NodeType.TYPE, outline_1.NodeType.ALIAS, outline_1.NodeType.DATA, outline_1.NodeType.CHOICE];
/*
Call the same file  "self"
*/
exports.createXSD = (ast) => {
    let lookup = {
        types: ast
            .filter((node) => node.type && node.type === outline_1.NodeType.TYPE)
            .map((n) => n.id),
        enums: ast
            .filter((node) => node.type && node.type === outline_1.NodeType.CHOICE)
            .map((n) => n.id),
        data: ast.filter((node) => node.type && node.type === outline_1.NodeType.DATA).map((n) => n.id)
    };
    const transformedNodes = ast.filter((n) => !n.ignore).map(node => {
        if (node.type && node.type === outline_1.NodeType.TYPE) {
            return new xsdClass_1.XsdClass(node).toString();
        }
        else if (node.type && node.type === outline_1.NodeType.CHOICE) {
            //return new PlantEnum(node as any).toString();
        }
        else if (node.type && node.type === outline_1.NodeType.DATA) {
            //return new PlantData(node as any, lookup).toString();
        }
        return null;
    });
    const template = `

<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:self="something.com">
${helpers_1.purge(transformedNodes).join("\n")}
</xsd:schema>
  
  `;
    return template;
};
//# sourceMappingURL=createXSD.js.map