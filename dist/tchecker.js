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
        .filter(node => node.type === outline_1.NodeType.TYPE && !node.imported)
        .forEach((node) => {
        // check the normal fields for errors
        node.fields
            .filter(field => field.type == outline_1.NodeType.TYPE_FIELD)
            .forEach((field) => {
            // the id of the field
            let typeId = field.ofType === "Maybe" || field.ofType === "List"
                ? field.ofType_params[0]
                : field.ofType;
            let ref = getNodeById(ast, node.params, typeId);
            if (!ref) {
                errors.push(Object.assign({ message: `Cannot find type "${typeId}" of field "${field.id}" of type "${node.id}"` }, field.ofType_start, { type: outline_1.ErrorType.FieldTypeUndefined }));
            }
            // Now also check all the parameters if they exist
            for (let i = 0; i < field.ofType_params.length; ++i) {
                let paramId = field.ofType_params[i];
                let paramRef = getNodeById(ast, node.params, paramId);
                if (!paramRef) {
                    errors.push(Object.assign({ message: `Cannot find type "${paramId}" of field "${field.id}" of type "${node.id}"` }, field.ofType_params_start[i], { type: outline_1.ErrorType.ParameterTypeUndefined }));
                }
            }
        });
    });
    /**
     * Type Check the AGGREGATES
     */
    ast
        .filter(node => node.type === outline_1.NodeType.AGGREGATE)
        .forEach((aggregate) => {
        // test if the root exists
        let root = getNodeById(ast, [], aggregate.root);
        if (!root) {
            errors.push(Object.assign({ message: `Cannot find the aggregate root "${aggregate.root}"` }, aggregate.root_start));
        }
        aggregate.valueObjects.forEach((v, i) => {
            let valueObject = getNodeById(ast, [], v);
            if (!valueObject) {
                errors.push(Object.assign({ message: `Cannot find the Value Object "${v}" on Aggregate "${aggregate.root}"` }, aggregate.valueObjects_start[i]));
            }
        });
    });
    /**
     * Type Check the VIEWS
     */
    ast
        .filter(node => node.type === outline_1.NodeType.VIEW)
        .forEach((view) => {
        view.nodes.forEach((v, i) => {
            let valueObject = getNodeById(ast, [], v);
            if (!valueObject) {
                errors.push(Object.assign({ message: `Cannot find the Type "${v}" in View "${view.id || "Unnamed view"}"` }, view.nodes_start[i]));
            }
        });
    });
    return errors;
};
//# sourceMappingURL=tchecker.js.map