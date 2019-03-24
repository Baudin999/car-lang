"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../outline");
const helpers_1 = require("../helpers");
const tableTYPE_1 = require("./tableTYPE");
// @ts-ignore
const deflate_1 = require("./../deflate/deflate");
const createERD_1 = require("../erd/createERD");
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
        return null;
    });
    return `
<html>
  <head>
    <title></title>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"> 
    <link rel="stylesheet" href="./../style.css">
  </head>
  <body>
  ${helpers_1.purge(transformedNodes).join("\n")}
  <h1>ERD</h1>
  ${moduleName ? `<div class="image-container"><img src="${moduleName}.svg" /></div>` : ""}
  <h1>Appendix: Entities</h1>
  ${helpers_1.purge(tables).join("\n")}
  </body>
</html>
  `.trim();
};
//# sourceMappingURL=createHTML.js.map