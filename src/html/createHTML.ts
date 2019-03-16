import {
  IExpression,
  NodeType,
  IType,
  IChoice,
  IMarkdownChapter,
  IMarkdownParagraph,
  IMarkdownList,
  IMarkdownCode
} from "../outline";
import { purge } from "../helpers";

const types = [NodeType.TYPE, NodeType.ALIAS, NodeType.DATA, NodeType.CHOICE];

export const createHTML = (ast: IExpression[]) => {
  const transformedNodes = ast
    .filter(node => node.type)
    .map(node => {
      if (node.type === NodeType.CHAPTER) {
        let chapter = node as IMarkdownChapter;
        return `<h${chapter.depth}>${chapter.content}</h${chapter.depth}>`;
      } else if (node.type === NodeType.PARAGRAPH) {
        let p = node as IMarkdownParagraph;
        return `<p>${p.content}</p>`;
      } else if (node.type === NodeType.MARKDOWN_LIST) {
        let list = node as IMarkdownList;
        let list_items = list.items.map(i => `<li>${i}</li>`);
        return `<ul>${list_items}</ul>`;
      } else if (node.type === NodeType.MARKDOWN_CODE) {
        let code = node as IMarkdownCode;
        return `<pre><code>${code.content}</code></pre>`;
      }
      return null;
    });

  return purge(transformedNodes).join("\n");
};

export interface ILookup {
  types: string[];
  enums: string[];
}
