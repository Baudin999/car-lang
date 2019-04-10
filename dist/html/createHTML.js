"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../outline");
const helpers_1 = require("../helpers");
const tableTYPE_1 = require("./tableTYPE");
// @ts-ignore
const deflate_1 = require("./../deflate/deflate");
const createERD_1 = require("../erd/createERD");
const createFlow_1 = require("../flows/createFlow");
const createAggregate_1 = require("../aggregates/createAggregate");
const pretty_data_1 = require("pretty-data");
const types = [outline_1.NodeType.TYPE, outline_1.NodeType.ALIAS, outline_1.NodeType.DATA, outline_1.NodeType.CHOICE];
exports.createHTML = (ast, moduleName) => {
    const tables = [];
    const transformedNodes = ast
        .filter(node => node.type)
        .map(node => {
        if (node.type === outline_1.NodeType.MARKDOWN_CHAPTER) {
            let chapter = node;
            return `<h${chapter.depth}>${chapter.content}</h${chapter.depth}>`;
        }
        else if (node.type === outline_1.NodeType.MARKDOWN_PARAGRAPH) {
            let p = node;
            return `<p>${p.content}</p>`;
        }
        else if (node.type === outline_1.NodeType.MARKDOWN_LIST) {
            let list = node;
            let list_items = list.items.map(i => `<li>${i}</li>`).join("\n");
            return `<ul>${list_items}</ul>`;
        }
        else if (node.type === outline_1.NodeType.MARKDOWN_CODE) {
            let code = node;
            return `<pre><code>${code.content}</code></pre>`;
        }
        else if (node.type === outline_1.NodeType.TYPE) {
            tables.push(tableTYPE_1.createTableTYPE(node));
        }
        else if (node.type === outline_1.NodeType.VIEW) {
            let plantSource = createERD_1.createView(node, ast);
            let url = deflate_1.generateURL(plantSource);
            return `<div class="image-container"><img src="${url}" /></div>`;
        }
        else if (node.type === outline_1.NodeType.AGGREGATE) {
            let plantSource = createAggregate_1.createAggregate(node, ast);
            console.log(plantSource);
            let url = deflate_1.generateURL(plantSource);
            return `<div class="image-container"><img src="${url}" /></div>`;
        }
        else if (node.type === outline_1.NodeType.FLOW) {
            let result = "";
            const { sequence, useCase } = createFlow_1.createFlow(node);
            if (sequence) {
                const s_url = deflate_1.generateURL(sequence);
                result += `<div class="image-container"><img src="${s_url}" /></div>`;
            }
            if (useCase) {
                const u_url = deflate_1.generateURL(useCase);
                result += `<div class="image-container"><img src="${u_url}" /></div>`;
            }
            return result;
        }
        return null;
    });
    return pretty_data_1.pd
        .xml(`
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

    ${helpers_1.purge(transformedNodes).join("\n")}
    <h1>ERD</h1>
    ${moduleName ? `<div class="image-container"><img src="${moduleName}.svg" /></div>` : ""}
    <h1>Appendix: Entities</h1>
    ${helpers_1.purge(tables).join("\n")}

  </div>
  </body>
</html>
  `)
        .trim();
};
//# sourceMappingURL=createHTML.js.map