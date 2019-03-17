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
    return (
    // the type we're searching for might be in the params
    // for example:
    // type Foo a =
    //    Bar: a
    params.indexOf(id) > -1 ||
        // It might be a baseType like "String"
        helpers_1.baseTypes.find(t => t === id) ||
        // it Might be a real type like "Person" or "Address"
        ast.find((node) => node.id && node.id === id));
};
exports.typeChecker = (ast = []) => {
    let errors = [];
    ast
        .filter(node => node.type === outline_1.NodeType.TYPE)
        .forEach((node) => {
        // check the normal fields for errors
        node.fields
            .filter(field => field.type == outline_1.NodeType.TYPE_FIELD)
            .forEach((field) => {
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
        // check the plucked fields for errors
        node.fields
            .filter(field => field.type == outline_1.NodeType.PLUCKED_FIELD)
            .forEach((field) => {
            if (field.parts.length === 1) {
                errors.push(Object.assign({ message: `Cannot pluck the entire object, must specify a field.` }, field.parts_start[0]));
            }
            // the id of the field
            let typeId = field.parts[0];
            let ref = getNodeById(ast, node.params, typeId);
            if (!ref) {
                errors.push(Object.assign({ message: `Cannot find type "${typeId}" to pluck from on type ${node.id}` }, field.parts_start[0]));
                return;
            }
            if (ref.type !== outline_1.NodeType.TYPE) {
                errors.push(Object.assign({ message: `Can only pluck from a type` }, field.parts_start[0]));
            }
            let refField = ref.fields.find(f => f.type === outline_1.NodeType.TYPE_FIELD && f.id === field.parts[1]);
            if (!refField) {
                errors.push(Object.assign({ message: `Cannot find field "${field.parts[1]}" of type "${typeId}" to pluck` }, field.parts_start[1]));
            }
        });
    });
    return errors;
};
//# sourceMappingURL=tchecker.js.map