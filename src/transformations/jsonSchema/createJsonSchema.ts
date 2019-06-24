import { IExpression, IType, NodeType, IAlias, IChoice, IData } from "./../../outline";
import { baseTypeToJSONType, purge } from "../../helpers";

const isAPI = (node: IExpression) => {
  let isAPI = false;
  if (node.type === NodeType.TYPE) {
    isAPI = !!(node as IType).annotations.find(a => a.key === "api");
  }
  return isAPI;
};

const getDescription = (node: any) => {
  return (node.annotations || []).find(a => a.key) || { value: "" };
};

export const createJsonSchema = (ast: IExpression[]): { name: string; schema: object }[] => {
  // First we'll need to grab the APIs from this ast...
  const apiRootNodes = ast.filter(isAPI);
  //console.log(apis);

  const createInnerSchema = (typeName: string, definitions) => {
    let node = ast.find((n: any) => n.id && n.id === typeName);
    if (!node) return definitions;

    let description = ((node as any).annotations || []).find(a => a.key === "description");

    if (node.type === NodeType.CHOICE) {
      definitions[typeName] = {
        $id: "#/" + typeName,
        type: "string",
        description: description ? description.value : "",
        enum: (node as IChoice).options.map(o => o.id)
      };
    }

    if (node.type === NodeType.DATA) {
      definitions[typeName] = {
        $id: "#/" + typeName,
        description: description ? description.value : "",
        oneOf: (node as IData).options.map(o => {
          createInnerSchema(o.id, definitions);
          return { $ref: "#/definitions/" + o.id };
        })
      };
    }

    if (node.type === NodeType.ALIAS) {
      definitions[typeName] = {
        $id: "#/" + typeName,
        description: description ? description.value : "",
        type: baseTypeToJSONType((node as IAlias).ofType)
      };
      return definitions;
    }

    if (node.type === NodeType.TYPE) {
      let fields = {};

      // side effect!!
      mapFields(node, fields, definitions);
      let requiredFields = purge(
        (node as IType).fields.map((f: any) => {
          return f.ofType !== "Maybe" ? f.id : null;
        })
      );

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

  function mapFields(api: any, fields, definitions) {
    (api.fields || []).map(field => {
      let isList = field.ofType === "List";
      let isMaybe = field.ofType === "Maybe";
      let $type = isMaybe || isList ? field.ofType_params[0] : field.ofType;
      let resultType = baseTypeToJSONType($type);
      let description = field.annotations.find(a => a.key === "description");
      if (resultType) {
        if (!isList) {
          fields[field.id] = {
            type: resultType,
            description: description ? description.value : ""
          };
        } else {
          fields[field.id] = {
            type: "array",
            items: {
              $ref: "#/definitions/" + $type
            },
            description: description ? description.value : ""
          };
          createInnerSchema($type, definitions);
        }
      } else {
        if (!isList) {
          fields[field.id] = {
            $ref: "#/definitions/" + $type,
            description: description ? description.value : ""
          };
          createInnerSchema($type, definitions);
        } else {
          fields[field.id] = {
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

  const schemas = apiRootNodes.map((api: any) => {
    let fields = {};
    let definitions = {};
    mapFields(api, fields, definitions);

    let requiredFields = purge(
      (api.fields || []).map(field => {
        if (field.ofType === "Maybe") return null;
        else if (field.ofType === "List") return field.ofType_params[0];
        else return field.id;
      })
    );

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
