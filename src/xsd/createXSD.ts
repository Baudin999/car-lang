import { IExpression, NodeType, IType, IChoice, IView, IDirective } from "./../outline";
import { purge } from "../helpers";
import { ILookup } from "../erd/createERD";
import { XsdClass } from "./xsdClass";

const types = [NodeType.TYPE, NodeType.ALIAS, NodeType.DATA, NodeType.CHOICE];

/*
Call the same file  "self"
*/

export const createXSD = (ast: IExpression[]) => {
  let lookup: ILookup = {
    types: ast
      .filter((node: any) => node.type && node.type === NodeType.TYPE)
      .map((n: any) => n.id),
    enums: ast
      .filter((node: any) => node.type && node.type === NodeType.CHOICE)
      .map((n: any) => n.id),
    data: ast.filter((node: any) => node.type && node.type === NodeType.DATA).map((n: any) => n.id)
  };

  const transformedNodes = ast.filter((n: any) => !n.ignore).map(node => {
    if (node.type && node.type === NodeType.TYPE) {
      return new XsdClass(node as IType).toString();
    } else if (node.type && node.type === NodeType.CHOICE) {
      //return new PlantEnum(node as any).toString();
    } else if (node.type && node.type === NodeType.DATA) {
      //return new PlantData(node as any, lookup).toString();
    }
    return null;
  });


  const template = `

<xsd:schema xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:self="something.com">
${purge(transformedNodes).join("\n")}
</xsd:schema>
  
  `;

  return template;
};

