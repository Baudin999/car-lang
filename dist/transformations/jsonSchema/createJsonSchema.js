"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("./../../outline");
const helpers_1 = require("../../helpers");
const noCase = require("no-case");
const isAPI = (node) => {
    let isAPI = false;
    if (node.type === outline_1.NodeType.TYPE || node.type === outline_1.NodeType.ALIAS) {
        isAPI = !!node.annotations.find(a => a.key === "api");
    }
    return isAPI;
};
const getDescription = (node) => {
    return (node.annotations || []).find(a => a.key) || { value: "" };
};
exports.createJsonSchema = (ast) => {
    // First we'll need to grab the APIs from this ast...
    const apiRootNodes = ast.filter(isAPI);
    //console.log(apis);
    const createInnerSchema = (typeName, definitions) => {
        let node = ast.find((n) => n.id && n.id === typeName);
        if (!node)
            return definitions;
        let description = (node.annotations || []).find(a => a.key === "description");
        if (node.type === outline_1.NodeType.CHOICE) {
            definitions[typeName] = {
                $id: "#/" + typeName,
                type: "string",
                description: description ? description.value : "",
                enum: node.options.map(o => o.id)
            };
        }
        if (node.type === outline_1.NodeType.DATA) {
            definitions[typeName] = {
                $id: "#/" + typeName,
                description: description ? description.value : "",
                anyOf: node.options.map(o => {
                    createInnerSchema(o.id, definitions);
                    return { $ref: "#/definitions/" + o.id };
                })
            };
        }
        if (node.type === outline_1.NodeType.ALIAS) {
            definitions[typeName] = {
                $id: "#/" + typeName,
                description: description ? description.value : "",
                type: helpers_1.baseTypeToJSONType(node.ofType)
            };
            return definitions;
        }
        if (node.type === outline_1.NodeType.TYPE) {
            let fields = {};
            // side effect!!
            mapFields(node, fields, definitions);
            let requiredFields = helpers_1.purge(node.fields.map((f) => {
                return f.ofType !== "Maybe" ? f.id : null;
            }));
            definitions[typeName] = {
                $id: "#/" + typeName,
                type: "object",
                properties: fields,
                description: description ? description.value : "",
                required: requiredFields
            };
            return definitions;
        }
        return definitions;
    };
    function mapFields(api, fields, definitions) {
        (api.fields || []).map(field => {
            let snakeCaseFieldId = noCase(field.id, null, "_");
            let isList = field.ofType === "List";
            let isMaybe = field.ofType === "Maybe";
            let $type = isMaybe || isList ? field.ofType_params[0] : field.ofType;
            let resultType = helpers_1.baseTypeToJSONType($type);
            let description = field.annotations.find(a => a.key === "description");
            let pattern = (field.restrictions || []).find(a => a.key === "pattern");
            if (resultType) {
                if (!isList) {
                    fields[snakeCaseFieldId] = {
                        type: resultType,
                        description: description ? description.value : ""
                    };
                    if (pattern && resultType === "string")
                        fields[snakeCaseFieldId].pattern = pattern.value;
                    if ($type === "Date") {
                        fields[snakeCaseFieldId].format = "date";
                    }
                    if ($type === "DateTime") {
                        fields[snakeCaseFieldId].format = "date-time";
                    }
                    if ($type === "Time") {
                        fields[snakeCaseFieldId].format = "time";
                    }
                }
                else {
                    fields[snakeCaseFieldId] = {
                        type: "array",
                        items: {
                            $ref: "#/definitions/" + $type
                        },
                        description: description ? description.value : ""
                    };
                    createInnerSchema($type, definitions);
                }
            }
            else {
                if (!isList) {
                    fields[snakeCaseFieldId] = {
                        $ref: "#/definitions/" + $type,
                        description: description ? description.value : ""
                    };
                    createInnerSchema($type, definitions);
                }
                else {
                    fields[snakeCaseFieldId] = {
                        type: "array",
                        description: description ? description.value : "",
                        items: {
                            $ref: "#/definitions/" + $type
                        }
                    };
                    createInnerSchema($type, definitions);
                }
            }
        });
    }
    const schemas = apiRootNodes.map((api) => {
        let fields = {};
        let definitions = {};
        mapFields(api, fields, definitions);
        let requiredFields = helpers_1.purge((api.fields || []).map(field => {
            if (field.ofType === "Maybe")
                return null;
            else if (field.ofType === "List")
                return noCase(field.ofType_params[0], null, "_");
            else
                return noCase(field.id, null, "_");
        }));
        const schema = {
            $id: "https://schemas.com/" + api.id,
            $schema: "http://json-schema.org/draft-07/schema#",
            description: getDescription(api).value,
            type: "object",
            required: requiredFields,
            properties: fields,
            definitions
        };
        return { name: api.id, schema };
    });
    return schemas;
};
//# sourceMappingURL=createJsonSchema.js.map