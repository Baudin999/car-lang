"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const outline_1 = require("../../outline");
const helpers_1 = require("../../helpers");
exports.createGuideline = (guideline) => {
    const html = helpers_1.purge((guideline.markdown || []).map((node, index) => {
        if (node.type === outline_1.NodeType.MARKDOWN_CHAPTER) {
            let chapter = node;
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
            return `<pre><code class="${code.lang}">${code.source}</code></pre>`;
        }
        else {
            return null;
        }
    })).join("\n");
    return `
<div class="guideline">
    <div class="gl-header">Guideline: ${guideline.title || "No Title"}</div>
    ${guideline.version ? `<div class="gl-version">version: ${guideline.version || 0}</div>` : ""}
    <div class="gl-body">
       ${html}
    </div>
</div>    
    `;
};
//# sourceMappingURL=createGuideline.js.map