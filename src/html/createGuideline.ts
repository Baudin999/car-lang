import {
  IGuideline,
  NodeType,
  IMarkdownChapter,
  IMarkdownParagraph,
  IMarkdownImage,
  IMarkdownList,
  IMarkdownCode
} from "../outline";
import { purge } from "../helpers";
import * as hljs from "highlightjs";

export const createGuideline = (guideline: IGuideline) => {
  const html = purge(
    (guideline.markdown || []).map((node, index) => {
      if (node.type === NodeType.MARKDOWN_CHAPTER) {
        let chapter = node as IMarkdownChapter;
        return `<h${chapter.depth} id="${index}">${chapter.content}</h${chapter.depth}>`;
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
        let result = hljs.highlight(code.lang, code.source);
        return `<pre><code class="${code.lang}">${result.value}</code></pre>`;
      } else {
        return null;
      }
    })
  ).join("\n");

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
