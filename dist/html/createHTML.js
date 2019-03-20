"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../outline");
const helpers_1 = require("../helpers");
const tableTYPE_1 = require("./tableTYPE");
const types = [outline_1.NodeType.TYPE, outline_1.NodeType.ALIAS, outline_1.NodeType.DATA, outline_1.NodeType.CHOICE];
exports.createHTML = (ast) => {
    const tables = [];
    const transformedNodes = ast
        .filter(node => node.type)
        .map(node => {
        if (node.type === outline_1.NodeType.CHAPTER) {
            let chapter = node;
            return `<h${chapter.depth}>${chapter.content}</h${chapter.depth}>`;
        }
        else if (node.type === outline_1.NodeType.PARAGRAPH) {
            let p = node;
            return `<p>${p.content}</p>`;
        }
        else if (node.type === outline_1.NodeType.MARKDOWN_LIST) {
            let list = node;
            let list_items = list.items.map(i => `<li>${i}</li>`);
            return `<ul>${list_items}</ul>`;
        }
        else if (node.type === outline_1.NodeType.MARKDOWN_CODE) {
            let code = node;
            return `<pre><code>${code.content}</code></pre>`;
        }
        else if (node.type === outline_1.NodeType.TYPE) {
            tables.push(tableTYPE_1.createTableTYPE(node));
        }
        return null;
    });
    return `
<html>
  <head>
    <title></title>
  </head>
  <body>
    ${helpers_1.purge(transformedNodes.concat(tables)).join("\n")}
  </body>
</html>
  `.trim();
};
//# sourceMappingURL=createHTML.js.map