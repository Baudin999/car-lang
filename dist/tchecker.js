"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
const outline_1 = require("./outline");
const lookupTree = {};
/*
We will need a function with which we can grab a node
from the ast by the id
*/
const getNodeById = (ast, params = [], id) => {
    return (params.indexOf(id) > -1 ||
        helpers_1.baseTypes.find(t => t === id) ||
        ast.find((node) => node.id && node.id === id));
};
exports.typeChecker = (ast = []) => {
    let errors = [];
    ast
        .filter(node => node.type === outline_1.NodeType.TYPE)
        .forEach((node) => {
        node.fields.forEach((field) => {
            // the id of the field
            let typeId = field.ofType;
            let ref = getNodeById(ast, node.params, typeId);
            if (!ref) {
                errors.push(Object.assign({ message: `Cannot find type "${typeId}" of field "${field.id}" of type "${node.id}"` }, field.ofType_start));
            }
            // Now also check all the parameters if they exist
            for (let i = 0; i < field.ofType_params.length; ++i) {
                let paramId = field.ofType_params[i];
                let paramRef = getNodeById(ast, node.params, paramId);
                if (!paramRef) {
                    errors.push(Object.assign({ message: `Cannot find type "${paramId}" of field "${field.id}" of type "${node.id}"` }, field.ofType_params_start[i]));
                }
            }
        });
    });
    return errors;
};
//# sourceMappingURL=tchecker.js.map