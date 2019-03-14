import { baseTypes, ITokenStart } from "./helpers";
import { IExpression, IType, IChoice, NodeType, ITypeField, IPluckedField } from "./outline";

const lookupTree = {};

/*
We will need a function with which we can grab a node
from the ast by the id
*/
const getNodeById = (ast: IExpression[], params: string[] = [], id: string) => {
  return (
    params.indexOf(id) > -1 ||
    baseTypes.find(t => t === id) ||
    ast.find((node: any) => node.id && node.id === id)
  );
};

export const typeChecker = (ast: IExpression[] = []): IError[] => {
  let errors: IError[] = [];
  ast
    .filter(node => node.type === NodeType.TYPE)
    .forEach((node: IType) => {
      // check the normal fields for errors
      node.fields
        .filter(field => field.type == NodeType.TYPE_FIELD)
        .forEach((field: ITypeField) => {
          // the id of the field
          let typeId = field.ofType;
          let ref = getNodeById(ast, node.params, typeId);
          if (!ref) {
            errors.push({
              message: `Cannot find type "${typeId}" of field "${field.id}" of type "${node.id}"`,
              ...(field.ofType_start as ITokenStart)
            });
          }

          // Now also check all the parameters if they exist
          for (let i = 0; i < field.ofType_params.length; ++i) {
            let paramId = field.ofType_params[i];
            let paramRef = getNodeById(ast, node.params, paramId);
            if (!paramRef) {
              errors.push({
                message: `Cannot find type "${paramId}" of field "${field.id}" of type "${
                  node.id
                }"`,
                ...(field.ofType_params_start[i] as ITokenStart)
              });
            }
          }
        });

      // check the plucked fields for errors
      node.fields
        .filter(field => field.type == NodeType.PLUCKED_FIELD)
        .forEach(
          (field: IPluckedField): void => {
            if (field.parts.length === 1) {
              errors.push({
                message: `Cannot pluck the entire object, must specify a field.`,
                ...(field.parts_start[0] as ITokenStart)
              });
            }

            // the id of the field
            let typeId = field.parts[0];
            let ref = getNodeById(ast, node.params, typeId);
            if (!ref) {
              errors.push({
                message: `Cannot find type "${typeId}" to pluck from on type ${node.id}`,
                ...field.parts_start[0]
              });
              return;
            }
            if ((ref as any).type !== NodeType.TYPE) {
              errors.push({
                message: `Can only pluck from a type`,
                ...field.parts_start[0]
              });
            }
            let refField = (ref as IType).fields.find(
              f => f.type === NodeType.TYPE_FIELD && (f as ITypeField).id === field.parts[1]
            );
            if (!refField) {
              errors.push({
                message: `Cannot find field "${field.parts[1]}" of type "${typeId}" to pluck`,
                ...field.parts_start[1]
              });
            }
          }
        );
    });

  return errors;
};

export interface IError {
  message: string;
}
