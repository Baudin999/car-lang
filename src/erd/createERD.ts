import { IExpression, NodeType, IType, IChoice } from "./../outline";
import { PlantClass } from "./plantClass";
import { purge } from "../helpers";
import { PlantEnum } from "./plantEnum";

const types = [NodeType.TYPE, NodeType.ALIAS, NodeType.DATA, NodeType.CHOICE];

export const createERD = (ast: IExpression[]) => {
  let lookup: ILookup = {
    types: ast
      .filter((node: any) => node.type && node.type === NodeType.TYPE)
      .map((n: any) => n.id),
    enums: ast
      .filter((node: any) => node.type && node.type === NodeType.CHOICE)
      .map((n: any) => n.id)
  };

  const transformedNodes = ast.map(node => {
    if (node.type && node.type === NodeType.TYPE) {
      return new PlantClass(node as IType, lookup).toString();
    } else if (node.type && node.type === NodeType.CHOICE) {
      return new PlantEnum(node as any).toString();
    }
    return null;
  });

  return purge(transformedNodes).join("\n");
};

export interface ILookup {
  types: string[];
  enums: string[];
}
