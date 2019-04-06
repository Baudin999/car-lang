"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("./../outline");
const helpers_1 = require("../helpers");
const isAPI = (node) => {
    let isAPI = false;
    if (node.type === outline_1.NodeType.TYPE) {
        isAPI = !!node.annotations.find(a => a.key === "api");
    }
    return isAPI;
};
const getDescription = (node) => {
    return (node.annotations || []).find(a => a.key) || { value: "" };
};
exports.createJsonSchema = (ast) => {
    // First we'll need to grab the APIs from this ast...
    const apis = ast.filter(isAPI);
    //console.log(apis);
    const schemas = apis.map((api) => {
        let fields = {};
        (api.fields || []).map(field => {
            let isList = field.ofType === "List";
            let isMaybe = field.ofType === "Maybe";
            let $type = isMaybe || isList ? field.ofType_params[0] : field.ofType;
            let resultType = helpers_1.baseTypeToJSONType($type);
            if (resultType) {
                if (!isList) {
                    fields[field.id] = {
                        type: resultType
                    };
                }
                else {
                    fields[field.id] = {
                        type: "array",
                        items: {
                            $ref: "#/definitions/" + $type
                        }
                    };
                }
            }
            else {
                if (!isList) {
                    fields[field.id] = {
                        $ref: "#/definitions/" + $type
                    };
                }
                else {
                    fields[field.id] = {
                        type: "array",
                        items: {
                            $ref: "#/definitions/" + $type
                        }
                    };
                }
            }
        });
        let requiredFields = helpers_1.purge((api.fields || []).map(field => {
            if (field.ofType === "Maybe")
                return null;
            else if (field.ofType === "List")
                return field.ofType_params[0];
            else
                return field.id;
        }));
        const schema = {
            $id: "https://schemas.com/" + api.id,
            $schema: "http://json-schema.org/draft-07/schema#",
            description: getDescription(api).value,
            type: "object",
            required: requiredFields,
            properties: fields
        };
        return { name: api.id, schema };
    });
    return schemas;
};
//# sourceMappingURL=createJsonSchema.js.map