import {
    IExpression,
    NodeType,
    IType,
    IChoice,
    IMarkdownChapter,
    IMarkdownParagraph,
    IMarkdownList,
    IMarkdownCode,
    IView
} from "../outline";
import { purge } from "../helpers";
import { createTableTYPE } from "./tableTYPE";
// @ts-ignore
import { generateURL } from "./../deflate/deflate";
import { createView } from "../erd/createERD";
import { createFlow } from "../flows/createFlow";
import { pd } from "pretty-data";

const types = [NodeType.TYPE, NodeType.ALIAS, NodeType.DATA, NodeType.CHOICE];

export const createHTML = (ast: IExpression[], moduleName?: string) => {
    const tables: string[] = [];

    const transformedNodes = ast
        .filter(node => node.type)
        .map(node => {
            if (node.type === NodeType.MARKDOWN_CHAPTER) {
                let chapter = node as IMarkdownChapter;
                return `<h${chapter.depth}>${chapter.content}</h${chapter.depth}>`;
            } else if (node.type === NodeType.MARKDOWN_PARAGRAPH) {
                let p = node as IMarkdownParagraph;
                return `<p>${p.content}</p>`;
            } else if (node.type === NodeType.MARKDOWN_LIST) {
                let list = node as IMarkdownList;
                let list_items = list.items.map(i => `<li>${i}</li>`).join("\n");
                return `<ul>${list_items}</ul>`;
            } else if (node.type === NodeType.MARKDOWN_CODE) {
                let code = node as IMarkdownCode;
                return `<pre><code>${code.content}</code></pre>`;
            } else if (node.type === NodeType.TYPE) {
                tables.push(createTableTYPE(node as IType));
            } else if (node.type === NodeType.VIEW) {
                let plantSource = createView(node as any, ast);
                let url = generateURL(plantSource);
                return `<div class="image-container"><img src="${url}" /></div>`;
            } else if (node.type === NodeType.FLOW) {
                let result = "";
                const { sequence, useCase } = createFlow(node as any);
                if (sequence) {
                    const s_url = generateURL(sequence);
                    result += `<div class="image-container"><img src="${s_url}" /></div>`;
                }
                if (useCase) {
                    const u_url = generateURL(useCase);
                    result += `<div class="image-container"><img src="${u_url}" /></div>`;
                }
                return result;
            }
            return null;
        });

    return pd
        .xml(
            `
<html>
  <head>
    <title></title>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"> 
    <link rel="stylesheet" href="./../style.css">
  </head>
  <body>

  <div class="page">

    <h1>Links</h1>
    <a href="${moduleName}.xsd">XSD</a>
    <a href="${moduleName}.json">JSON schema</a>

    ${purge(transformedNodes).join("\n")}
    <h1>ERD</h1>
    ${moduleName ? `<div class="image-container"><img src="${moduleName}.svg" /></div>` : ""}
    <h1>Appendix: Entities</h1>
    ${purge(tables).join("\n")}

  </div>
  </body>
</html>
  `
        )
        .trim();
};

export interface ILookup {
    types: string[];
    enums: string[];
}
