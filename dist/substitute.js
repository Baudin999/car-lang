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
exports.substituteAliases = (ast = []) => {
    const errors = [];
    const newAST = ast.map((node) => {
        if (node.type !== outline_1.NodeType.ALIAS)
            return node;
        else if (helpers_1.baseTypes.indexOf(node.ofType) > -1) {
            // now we know it's a "simple type" a String or a Number,
            // something we don't really have to substitute, so we can
            // just return the actual ALIAS node.
            return node;
        }
        else {
            let originalType = getNodeById(ast, [], node.ofType);
            if (!originalType) {
                errors.push(Object.assign({ message: `Could not find type ${node.ofType}` }, node.ofType_start));
                return node;
            }
            if (helpers_1.baseTypes.indexOf(node.ofType) > -1)
                return originalType;
            let _node = helpers_1.clone(originalType);
            _node.fields = _node.fields.map(field => {
                const fieldIndex = (_node.params || []).indexOf(field.ofType);
                if (fieldIndex > -1) {
                    field.ofType = node.ofType_params[fieldIndex];
                    field.ofType_start = node.ofType_params_start[fieldIndex];
                }
                return field;
            });
            _node.params = [];
            _node.id = node.id;
            _node.source = `${node.ofType}`;
            return _node;
        }
    });
    return { newAST, errors };
};
exports.substituteExtensions = (ast = []) => {
    const errors = [];
    const newAST = ast.map((node) => {
        if (node.type !== outline_1.NodeType.TYPE)
            return node;
        else {
            let newNode = node;
            newNode.extends.forEach((e, i) => {
                let extension = getNodeById(ast, [], e);
                if (!extension) {
                    errors.push(Object.assign({ message: `Could not find type ${e} to extends from` }, node.extends_start[i]));
                }
                else if (extension.type !== outline_1.NodeType.TYPE) {
                    errors.push(Object.assign({ message: `Type ${e} is not a "type" and as such cannot be extended from.` }, node.extends_start[i]));
                }
                else {
                    extension.fields
                        .filter(f => f.type === outline_1.NodeType.TYPE_FIELD)
                        .forEach(eField => {
                        let existingField = node.fields.find(f => f.type === outline_1.NodeType.TYPE_FIELD &&
                            f.id === eField.id);
                        if (!existingField) {
                            newNode.fields.push(Object.assign({}, eField, { source: e }));
                        }
                    });
                }
            });
            return newNode;
        }
    });
    return { newAST, errors };
};
//# sourceMappingURL=substitute.js.map