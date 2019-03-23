import { IExpression, NodeType, IType, IChoice, IView } from "./../outline";
import { PlantClass } from "./plantClass";
import { PlantData } from "./plantData";
import { purge } from "../helpers";
import { PlantEnum } from "./plantEnum";

const types = [NodeType.TYPE, NodeType.ALIAS, NodeType.DATA, NodeType.CHOICE];

export const createERD = (ast: IExpression[], title?:string) => {
  let lookup: ILookup = {
    types: ast
      .filter((node: any) => node.type && node.type === NodeType.TYPE)
      .map((n: any) => n.id),
    enums: ast
      .filter((node: any) => node.type && node.type === NodeType.CHOICE)
      .map((n: any) => n.id),
    data: ast.filter((node: any) => node.type && node.type === NodeType.DATA).map((n: any) => n.id)
  };

  const transformedNodes = ast.filter((node:any) => !node.imported).map(node => {
    if (node.type && node.type === NodeType.TYPE) {
      return new PlantClass(node as IType, lookup).toString();
    } else if (node.type && node.type === NodeType.CHOICE) {
      return new PlantEnum(node as any).toString();
    } else if (node.type && node.type === NodeType.DATA) {
      return new PlantData(node as any, lookup).toString();
    }
    return null;
  });

  if (title) {
    transformedNodes.unshift(`title: ${title}\n`);
  }

  return purge(transformedNodes).join("\n");
};

export const createView = (view: IView, ast: IExpression[]) => {
  const title = view.directives.find(d => d.key === "title");
  const viewAST = view.nodes.map(node => {
    return ast.find((n: any) => n.id && n.id === node);
  }) as IExpression[];
  return createERD(viewAST, title ? title.value : undefined);
};

export interface ILookup {
  types: string[];
  enums: string[];
  data: string[];
}
