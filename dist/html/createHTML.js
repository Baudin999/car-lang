"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../outline");
const helpers_1 = require("../helpers");
const tableTYPE_1 = require("./tableTYPE");
const tableDATA_1 = require("./tableDATA");
const tableCHOICE_1 = require("./tableCHOICE");
const tableALIAS_1 = require("./tableALIAS");
// @ts-ignore
const deflate_1 = require("./../deflate/deflate");
const createERD_1 = require("../erd/createERD");
const createFlow_1 = require("../flows/createFlow");
const createMap_1 = require("../maps/createMap");
const createAggregate_1 = require("../aggregates/createAggregate");
const pretty_data_1 = require("pretty-data");
const types = [outline_1.NodeType.TYPE, outline_1.NodeType.ALIAS, outline_1.NodeType.DATA, outline_1.NodeType.CHOICE];
exports.createHTML = (ast, moduleName) => {
    const tables = [];
    const transformedNodes = ast
        .filter((node) => !!!node.ignore)
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
        else if (node.type === outline_1.NodeType.MARKDOWN_IMAGE) {
            let p = node;
            return `<div class="image-container"><img src="${p.uri}" /></div>`;
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
        else if (node.type === outline_1.NodeType.DATA) {
            tables.push(tableDATA_1.createTableDATA(node));
        }
        else if (node.type === outline_1.NodeType.CHOICE) {
            tables.push(tableCHOICE_1.createTableCHOICE(node));
        }
        else if (node.type === outline_1.NodeType.ALIAS) {
            tables.push(tableALIAS_1.createTableALIAS(node));
        }
        else if (node.type === outline_1.NodeType.VIEW) {
            let plantSource = createERD_1.createView(node, ast);
            let url = deflate_1.generateURL(plantSource);
            return `<div class="image-container"><img src="${url}" /></div>`;
        }
        else if (node.type === outline_1.NodeType.MAP) {
            let plantSource = createMap_1.createMap(node);
            let url = deflate_1.generateURL(plantSource);
            return `<div class="image-container"><img src="${url}" /></div>`;
        }
        else if (node.type === outline_1.NodeType.AGGREGATE) {
            let plantSource = createAggregate_1.createAggregate(node, ast);
            let url = deflate_1.generateURL(plantSource);
            return `<div class="image-container"><img src="${url}" /></div>`;
        }
        else if (node.type === outline_1.NodeType.FLOW) {
            let result = "";
            const { state, sequence, useCase } = createFlow_1.createFlow(node);
            if (state) {
                const state_url = deflate_1.generateURL(state);
                result += `<div class="image-container"><img src="${state_url}" /></div>`;
            }
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


    <h1>Links</h1>
    <ul>
        <li><a href="${moduleName}.xsd">XSD</a></li>
        <li><a href="${moduleName}.json">JSON schema</a></li>
        <li><a href="${moduleName}.svg">ERD</a></li>
    </ul>

    ${helpers_1.purge(transformedNodes).join("\n")}
    <h1>ERD</h1>
    ${moduleName ? `<div class="image-container"><img src="${moduleName}.svg" /></div>` : ""}
    <h1>Appendix: Entities</h1>
    ${helpers_1.purge(tables).join("\n")}

  </body>
</html>
  `)
        .trim();
};
//# sourceMappingURL=createHTML.js.map