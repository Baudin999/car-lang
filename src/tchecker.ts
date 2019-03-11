import { baseTypes, ITokenStart } from "./helpers";
import { IExpression, IType, NodeType, ITypeField } from "./outline";

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
      node.fields.forEach((field: ITypeField) => {
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
              message: `Cannot find type "${paramId}" of field "${field.id}" of type "${node.id}"`,
              ...(field.ofType_params_start[i] as ITokenStart)
            });
          }
        }
      });
    });

  return errors;
};

export interface IError {
  message: string;
}
