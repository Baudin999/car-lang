import { baseTypes, clone, purge } from "./helpers";
import { IExpression, IType, NodeType, IError, ITypeField, IPluckedField } from "./outline";

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
): { ast: IExpression[]; errors: IError[] } => {
  const errors: IError[] = [];
  const _ast = ast.map((node: any) => {
    if (node.type !== NodeType.ALIAS) return node;
    else if (baseTypes.indexOf(node.ofType) > -1) {
      // now we know it's a "simple type" a String or a Number,
      // something we don't really have to substitute, so we can
      // just return the actual ALIAS node.
      return node;
    } else {
      let originalType = getNodeById(ast, [], node.ofType);
      if (!originalType) {
        errors.push({
          message: `Could not find type ${node.ofType}`,
          ...node.ofType_start
        });
        return node;
      }

      if (baseTypes.indexOf(node.ofType) > -1) return originalType;

      let _node = clone(originalType) as any;
      let newChildren = (_node.fields || _node.options).map(field => {
        // Check if the field is in the parameters list...
        const fieldIndex = (_node.params || []).indexOf(field.ofType);
        if (fieldIndex > -1) {
          field.ofType = node.ofType_params[fieldIndex];
          field.ofType_start = node.ofType_params_start[fieldIndex];
          return field;
        }

        // else we'll check if the field is a type itself...
        const ref: any = getNodeById(ast, [], field.id);
        if (ref && ref.params && ref.params.length === 0) {
          // no paramters means a plane type, something we can just
          // return without doing extra work.
          return field;
        } else if (ref && ref.params && ref.params.length > 0) {
          // here we're in the situation where we're passing a
          // parameter through to another type.
          // Example:
          /* 
          type Foo a =
              Something: a
          
          data Option a =
              | Person
              | Foo a   <-- here we're passing the 'a' through to Foo 
          */

          //console.log(node.ofType_params)
          node.ofType_params.forEach((p, i) => {
            field.params[i] = p;
          });

          return field;
        } else {
          return field;
        }
      });
      if (_node.options) _node.options = newChildren;
      else if (_node.fields) _node.fields = newChildren;
      _node.params = [];
      _node.id = node.id;
      _node.source = `${node.ofType}`;
      return _node;
    }
  });
  return { ast: purge(_ast), errors };
};

export const substitutePluckedFields = (
  ast: IExpression[] = []
): { ast: IExpression[]; errors: IError[] } => {
  const errors: IError[] = [];
  if (!Array.isArray(ast)) return { ast: [], errors: [] };
  const newAST = ast.map((node: IType) => {
    if (node.type !== NodeType.TYPE) return node;
    else {
      let newNode = node as IType;

      // Manage the plucked fields
      newNode.fields = node.fields.map((field: any) => {
        if (field.type !== NodeType.PLUCKED_FIELD) return field;
        let [ofType, fieldName] = field.parts;
        let targetNode = getNodeById(ast, [], ofType) as any;
        if (!targetNode) return field;
        let targetField = (targetNode.fields || []).find(f => f.id === fieldName);
        let result = clone(targetField);

        // Here we manipulate the annotations of the result in order to get
        // everything we need to this new field.
        result.annotations = result.annotations.map(a => {
          if (a.key !== "description") return a;
          else return { key: "original description", value: a.value };
        });
        result.annotations.push({
          key: "plucked from",
          value: `${ofType}.${fieldName}`
        });
        Array.prototype.push.apply(result.annotations, field.annotations);

        // We should also manipulate the restrictions of the new fields
        // we might override the previous restrictions when plucking.
        let restrictions = targetField.restrictions || [];
        (field.restrictions || []).forEach(r => {
          let or = restrictions.find(_r => _r.key === r.key);
          if (!or) restrictions.push(r);
          else or.value = r.value;
        });

        result.restrictions = restrictions;
        return result;
      });

      // Manage and substitute the fields which take the type from
      // another field in the application.
      newNode.fields = node.fields.map((field: any) => {
        if (!field.field) return field;
        else {
          let targetNode = getNodeById(ast, [], field.ofType) as IType;
          if (!targetNode) {
            errors.push({
              message: `Type ${field.ofType} cannot be found to grab the field ${
                field.field
              } from.`,
              ...field.ofType_start
            });
            return field;
          }
          let targetField = (targetNode.fields || []).find((f: any) => f.id === field.field) as any;
          if (!targetField) {
            errors.push({
              message: `Type ${field.ofType} does not contain field ${field.field}.`,
              ...field.fieldStart
            });
            return field;
          }

          let result = {
            ...clone(targetField),
            id: field.id,
            id_start: field.id_start,
            ofType_start: field.fieldStart,
            annotations: field.annotations
          };

          let restrictions = targetField.restrictions;
          field.restrictions.forEach(r => {
            let or = restrictions.find(_r => _r.key === r.key);
            if (!or) restrictions.push(r);
            else or.value = r.value;
          });

          result.restrictions = restrictions;
          return result;
        }
      });

      return newNode;
    }
  });

  return { ast, errors };
};

export const substituteExtensions = (
  ast: IExpression[] = []
): { ast: IExpression[]; errors: IError[] } => {
  const errors: IError[] = [];
  const newAST = (ast || []).map((node: IType) => {
    if (node.type !== NodeType.TYPE) return node;
    else {
      let newNode = node as IType;
      newNode.extends.forEach((e, i) => {
        let extension = getNodeById(ast, [], e) as IExpression;
        if (!extension) {
          errors.push({
            message: `Could not find type ${e} to extend from`,
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
  return { ast: newAST, errors };
};
