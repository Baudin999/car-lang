import { baseTypes, ITokenStart } from "./helpers";
import {
  IExpression,
  IType,
  IError,
  NodeType,
  ITypeField,
  IPluckedField,
  IAggregate,
  IView,
  ErrorType
} from "./outline";

const lookupTree = {};

/*
We will need a function with which we can grab a node
from the ast by the id
*/
const getNodeById = (ast: IExpression[], params: string[] = [], id: string) => {
  return (
    // the type we're searching for might be in the params
    // for example:
    // type Foo a =
    //    Bar: a
    params.indexOf(id) > -1 ||
    // It might be a baseType like "String"
    baseTypes.find(t => t === id) ||
    // it Might be a real type like "Person" or "Address"
    ast.find((node: any) => node.id && node.id === id)
  );
};

export const typeChecker = (ast: IExpression[] = []): IError[] => {
  let errors: IError[] = [];
  ast
    .filter(node => node.type === NodeType.TYPE && !(node as any).imported)
    .forEach((node: IType) => {
      // check the normal fields for errors
      node.fields
        .filter(field => field.type == NodeType.TYPE_FIELD)
        .forEach((field: ITypeField) => {
          // the id of the field
          let typeId =
            field.ofType === "Maybe" || field.ofType === "List"
              ? field.ofType_params[0]
              : field.ofType;
          let ref = getNodeById(ast, node.params, typeId);

          if (!ref) {
            errors.push({
              message: `Cannot find type "${typeId}" of field "${field.id}" of type "${node.id}"`,
              ...(field.ofType_start as ITokenStart),
              type: ErrorType.FieldTypeUndefined
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
                ...(field.ofType_params_start[i] as ITokenStart),
                type: ErrorType.ParameterTypeUndefined
              });
            }
          }
        });
    });

  /**
   * Type Check the AGGREGATES
   */
  ast
    .filter(node => node.type === NodeType.AGGREGATE)
    .forEach(
      (aggregate: IAggregate): void => {
        // test if the root exists
        let root = getNodeById(ast, [], aggregate.root);
        if (!root) {
          errors.push({
            message: `Cannot find the aggregate root "${aggregate.root}"`,
            ...aggregate.root_start
          });
        }

        aggregate.valueObjects.forEach((v: string, i: number) => {
          let valueObject = getNodeById(ast, [], v);
          if (!valueObject) {
            errors.push({
              message: `Cannot find the Value Object "${v}" on Aggregate "${aggregate.root}"`,
              ...aggregate.valueObjects_start[i]
            });
          }
        });
      }
    );

  /**
   * Type Check the VIEWS
   */
  ast
    .filter(node => node.type === NodeType.VIEW)
    .forEach(
      (view: IView): void => {
        view.nodes.forEach((v: string, i: number) => {
          let valueObject = getNodeById(ast, [], v);
          if (!valueObject) {
            errors.push({
              message: `Cannot find the Type "${v}" in View "${view.id || "Unnamed view"}"`,
              ...view.nodes_start[i]
            });
          }
        });
      }
    );

  return errors;
};
