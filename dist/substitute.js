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
        if (node.type !== outline_1.NodeType.ALIAS || node.ofType_params.length === 0)
            return node;
        else {
            let _node = helpers_1.clone(getNodeById(ast, [], node.ofType));
            _node.fields = _node.fields.map(field => {
                const fieldIndex = _node.params.indexOf(field.ofType);
                if (fieldIndex > -1) {
                    field.ofType = node.ofType_params[fieldIndex];
                    field.ofType_start = node.ofType_params_start[fieldIndex];
                }
                return field;
            });
            _node.params = [];
            _node.id = node.id;
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
                    extension.fields.forEach(eField => {
                        let existingField = node.fields.find(f => f.id === eField.id);
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