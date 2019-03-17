import { baseTypes, clone, purge } from "./helpers";
import { IExpression, IType, NodeType, IError, ITypeField } from "./outline";

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

export const substituteAliases = (
  ast: IExpression[] = []
): { newAST: IExpression[]; errors: IError[] } => {
  const errors: IError[] = [];
  const newAST = ast.map((node: any) => {
    if (node.type !== NodeType.ALIAS) return node;
    else {
      let originalType = getNodeById(ast, [], node.ofType);
      if (!originalType) {
        errors.push({
          message: `Could not find type ${node.ofType}`,
          ...node.ofType_start
        });
        return node;
      }

      let _node = clone(originalType) as any;
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

export const substituteExtensions = (
  ast: IExpression[] = []
): { newAST: IExpression[]; errors: IError[] } => {
  const errors: IError[] = [];
  const newAST = ast.map((node: IType) => {
    if (node.type !== NodeType.TYPE) return node;
    else {
      let newNode = node as IType;
      newNode.extends.forEach((e, i) => {
        let extension = getNodeById(ast, [], e) as IExpression;
        if (!extension) {
          errors.push({
            message: `Could not find type ${e} to extends from`,
            ...node.extends_start[i]
          });
        } else if (extension.type !== NodeType.TYPE) {
          errors.push({
            message: `Type ${e} is not a "type" and as such cannot be extended from.`,
            ...node.extends_start[i]
          });
        } else {
          (extension as IType).fields
            .filter(f => f.type === NodeType.TYPE_FIELD)
            .forEach(eField => {
              let existingField = node.fields.find(
                f =>
                  f.type === NodeType.TYPE_FIELD &&
                  (f as ITypeField).id === (eField as ITypeField).id
              );
              if (!existingField) {
                newNode.fields.push({ ...eField, source: e });
              }
            });
        }
      });
      return newNode;
    }
  });
  return { newAST, errors };
};
