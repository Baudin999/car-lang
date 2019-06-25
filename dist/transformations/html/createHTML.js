"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../../outline");
const stringHash = require("string-hash");
const helpers_1 = require("../../helpers");
const tableTYPE_1 = require("./tableTYPE");
const tableDATA_1 = require("./tableDATA");
const tableCHOICE_1 = require("./tableCHOICE");
const tableALIAS_1 = require("./tableALIAS");
// @ts-ignore
const deflate_1 = require("./../../deflate/deflate");
const createERD_1 = require("../erd/createERD");
const createFlow_1 = require("../flows/createFlow");
const createMap_1 = require("../maps/createMap");
const createAggregate_1 = require("../aggregates/createAggregate");
const createGuideline_1 = require("./createGuideline");
const pretty_data_1 = require("pretty-data");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const highlightStyle = ""; //readFileSync(join(__dirname, "./hljs.xcode.css"), "utf8");
const types = [outline_1.NodeType.TYPE, outline_1.NodeType.ALIAS, outline_1.NodeType.DATA, outline_1.NodeType.CHOICE];
exports.createHTML = (ast, modulePath, svgs, moduleName) => {
    const tables = [];
    let currentChapter;
    let chapters = [];
    // We will remove the hashes
    svgs.hashes = [];
    let jsonSchemas = [];
    const transformedNodes = ast
        .filter((node) => !!!node.ignore)
        .filter(node => node.type)
        .map((node, index) => {
        // test to see if the node is an API
        (() => {
            let _node = node;
            let isAPI = !!(_node.annotations || []).find(a => a.key === "api");
            if (isAPI) {
                jsonSchemas.push(`${_node.id}.json`);
            }
        })();
        if (node.type === outline_1.NodeType.MARKDOWN_CHAPTER) {
            let chapter = node;
            if (chapter.depth === 1) {
                // clear the last one
                if (currentChapter)
                    chapters.push(Object.assign({}, currentChapter));
                // create a new chapter
                currentChapter = {
                    title: chapter.content,
                    id: index,
                    subChapters: []
                };
            }
            else if (chapter.depth === 2) {
                if (!currentChapter) {
                    // This happens when people start with an ##Header (h2)
                    currentChapter = { title: chapter.content, id: index, subChapters: [] };
                }
                else {
                    currentChapter.subChapters.push({ title: chapter.content, id: index });
                }
            }
            return `<h${chapter.depth} id="${index}">${chapter.content}</h${chapter.depth}>`;
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
            return `<pre><code class="${code.lang || "hs"}">\n${code.source}\n</code></pre>`;
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
            return generateHashAndFetchUrl(plantSource, svgs, modulePath);
        }
        else if (node.type === outline_1.NodeType.MAP) {
            let plantSource = createMap_1.createMap(node);
            return generateHashAndFetchUrl(plantSource, svgs, modulePath);
        }
        else if (node.type === outline_1.NodeType.AGGREGATE) {
            let aggregate = node;
            let { plantSource, operations } = createAggregate_1.createAggregate(node, ast);
            return (`<h2>${aggregate.root} Aggregate</h2>\n` +
                generateHashAndFetchUrl(plantSource, svgs, modulePath) +
                `<p>Operation on the ${aggregate.root} aggregate:</p>` +
                operations);
        }
        else if (node.type === outline_1.NodeType.FLOW) {
            let result = "";
            const { state, sequence, useCase } = createFlow_1.createFlow(node);
            if (state) {
                result += generateHashAndFetchUrl(state, svgs, modulePath);
            }
            if (sequence) {
                result += generateHashAndFetchUrl(sequence, svgs, modulePath);
            }
            if (useCase) {
                result += generateHashAndFetchUrl(useCase, svgs, modulePath);
            }
            return result;
        }
        else if (node.type === outline_1.NodeType.GUIDELINE) {
            return createGuideline_1.createGuideline(node);
        }
        return null;
    });
    if (currentChapter) {
        chapters.push(currentChapter);
    }
    const html = pretty_data_1.pd
        .xml(`
<html>
  <head>
    <title></title>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"> 
    <link rel="stylesheet" href="./../style.css">
    <link rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/styles/default.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.8/highlight.min.js"></script>
  </head>
  <body>

      <a href="./../index.html">Index</a>

    <h1>Index</h1>
    <ul>
    ${chapters
        .map(c => {
        return `<li><a href="#${c.id}">${c.title}</a><ul>${c.subChapters
            .map(s => `<li><a href="#${s.id}">${s.title}</a></li>`)
            .join("")}</ul></li>`;
    })
        .join("")}
    </ul>

    <h1>Links</h1>
    <ul>
        <li><a href="${moduleName}.xsd">XSD</a></li>
        ${jsonSchemas.map(s => `<li><a href="./${s}">${s}</a></li>`).join("\n")}
        <li><a href="${moduleName}.svg">ERD</a></li>
    </ul>

    ${helpers_1.purge(transformedNodes).join("\n")}
    <h1>ERD</h1>
    ${moduleName ? `<div class="image-container"><img src="${moduleName}.svg" /></div>` : ""}
    <h1>Appendix: Entities</h1>
    ${helpers_1.purge(tables).join("\n")}

    <script>hljs.initHighlightingOnLoad();</script>
  </body>
</html>
  `)
        .trim();
    return { html, svgs };
};
function generateHashAndFetchUrl(plantSource, svgs, modulePath) {
    let hash = stringHash(plantSource);
    svgs.hashes.push(hash.toString());
    if (!svgs[hash]) {
        let url = deflate_1.generateURL(plantSource);
        svgs[hash] = url;
        helpers_1.fetchImage(url).then(img => {
            const filePathSVG = path_1.join(modulePath, hash + ".svg");
            fs_extra_1.outputFile(filePathSVG, img);
        });
        console.log("Hash doesn't exits: " + hash);
    }
    else {
        //
    }
    return `<div class="image-container"><img src="./${hash}.svg" /></div>`;
}
//# sourceMappingURL=createHTML.js.map