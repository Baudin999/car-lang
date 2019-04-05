"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("./../outline");
const helpers_1 = require("../helpers");
const xsdClass_1 = require("./xsdClass");
const xsdChoice_1 = require("./xsdChoice");
const xsdAlias_1 = require("./xsdAlias");
const pretty_data_1 = require("pretty-data");
const types = [outline_1.NodeType.TYPE, outline_1.NodeType.ALIAS, outline_1.NodeType.DATA, outline_1.NodeType.CHOICE];
/*
Call the same file  "self"
*/
let defaultConfig = {
    name: "unknown",
    version: "0.0.0",
    xsd: {
        namespace: "http://something.com"
    },
    json: {
        namespace: "http://something.com"
    }
};
exports.createXSD = (ast, config = defaultConfig) => {
    let lookup = {
        types: ast
            .filter((node) => node.type && node.type === outline_1.NodeType.TYPE)
            .map((n) => n.id),
        enums: ast
            .filter((node) => node.type && node.type === outline_1.NodeType.CHOICE)
            .map((n) => n.id),
        data: ast
            .filter((node) => node.type && node.type === outline_1.NodeType.DATA)
            .map((n) => n.id)
    };
    const transformedNodes = ast
        .filter((n) => !n.ignore)
        .map(node => {
        if (node.type && node.type === outline_1.NodeType.TYPE) {
            return new xsdClass_1.XsdClass(node).toString();
        }
        else if (node.type && node.type === outline_1.NodeType.CHOICE) {
            return new xsdChoice_1.XsdChoice(node).toString();
        }
        else if (node.type && node.type === outline_1.NodeType.ALIAS) {
            return new xsdAlias_1.XsdAlias(node).toString();
        }
        else if (node.type && node.type === outline_1.NodeType.DATA) {
            //return new PlantData(node as any, lookup).toString();
        }
        return null;
    });
    const template = `

<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
  xmlns:self="${config.xsd.namespace}"
  targetNamespace="${config.xsd.namespace}">

  <!-- VERSION: ${config.version} -->

${helpers_1.purge(transformedNodes).join("\n")}

</xsd:schema>
  
  `;
    return pretty_data_1.pd.xml(template);
};
//# sourceMappingURL=createXSD.js.map