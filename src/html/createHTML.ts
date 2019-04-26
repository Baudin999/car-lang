import {
    IExpression,
    NodeType,
    IType,
    IChoice,
    IMarkdownChapter,
    IMarkdownParagraph,
    IMarkdownList,
    IMarkdownCode,
    IView,
    IAggregate,
    IData,
    IMarkdownImage,
    IAlias,
    IMap
} from "../outline";
import { purge } from "../helpers";
import { createTableTYPE } from "./tableTYPE";
import { createTableDATA } from "./tableDATA";
import { createTableCHOICE } from "./tableCHOICE";
import { createTableALIAS } from "./tableALIAS";
// @ts-ignore
import { generateURL } from "./../deflate/deflate";
import { createView } from "../erd/createERD";
import { createFlow } from "../flows/createFlow";
import { createMap } from "../maps/createMap";
import { createAggregate } from "../aggregates/createAggregate";
import { pd } from "pretty-data";
import filter from "ramda/es/filter";

const types = [NodeType.TYPE, NodeType.ALIAS, NodeType.DATA, NodeType.CHOICE];

export const createHTML = (ast: IExpression[], moduleName?: string) => {
    const tables: string[] = [];

    const transformedNodes = ast
        .filter((node: any) => !!!node.ignore)
        .filter(node => node.type)
        .map(node => {
            if (node.type === NodeType.MARKDOWN_CHAPTER) {
                let chapter = node as IMarkdownChapter;
                return `<h${chapter.depth}>${chapter.content}</h${chapter.depth}>`;
            } else if (node.type === NodeType.MARKDOWN_PARAGRAPH) {
                let p = node as IMarkdownParagraph;
                return `<p>${p.content}</p>`;
            } else if (node.type === NodeType.MARKDOWN_IMAGE) {
                let p = node as IMarkdownImage;
                return `<div class="image-container"><img src="${p.uri}" /></div>`;
            } else if (node.type === NodeType.MARKDOWN_LIST) {
                let list = node as IMarkdownList;
                let list_items = list.items.map(i => `<li>${i}</li>`).join("\n");
                return `<ul>${list_items}</ul>`;
            } else if (node.type === NodeType.MARKDOWN_CODE) {
                let code = node as IMarkdownCode;
                return `<pre><code>${code.content}</code></pre>`;
            } else if (node.type === NodeType.TYPE) {
                tables.push(createTableTYPE(node as IType));
            } else if (node.type === NodeType.DATA) {
                tables.push(createTableDATA(node as IData));
            } else if (node.type === NodeType.CHOICE) {
                tables.push(createTableCHOICE(node as IChoice));
            } else if (node.type === NodeType.ALIAS) {
                tables.push(createTableALIAS(node as IAlias));
            } else if (node.type === NodeType.VIEW) {
                let plantSource = createView(node as IView, ast);
                let url = generateURL(plantSource);
                return `<div class="image-container"><img src="${url}" /></div>`;
            } else if (node.type === NodeType.MAP) {
                let plantSource = createMap(node as IMap);
                let url = generateURL(plantSource);
                return `<div class="image-container"><img src="${url}" /></div>`;
            } else if (node.type === NodeType.AGGREGATE) {
                let plantSource = createAggregate(node as IAggregate, ast);
                let url = generateURL(plantSource);
                return `<div class="image-container"><img src="${url}" /></div>`;
            } else if (node.type === NodeType.FLOW) {
                let result = "";
                const { state, sequence, useCase } = createFlow(node as any);
                if (state) {
                    const state_url = generateURL(state);
                    result += `<div class="image-container"><img src="${state_url}" /></div>`;
                }
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


    <h1>Links</h1>
    <ul>
        <li><a href="${moduleName}.xsd">XSD</a></li>
        <li><a href="${moduleName}.json">JSON schema</a></li>
        <li><a href="${moduleName}.svg">ERD</a></li>
    </ul>

    ${purge(transformedNodes).join("\n")}
    <h1>ERD</h1>
    ${moduleName ? `<div class="image-container"><img src="${moduleName}.svg" /></div>` : ""}
    <h1>Appendix: Entities</h1>
    ${purge(tables).join("\n")}

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
