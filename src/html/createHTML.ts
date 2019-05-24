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
  IMap,
  IGuideline
} from "../outline";
import * as stringHash from "string-hash";
import { purge, fetchImage } from "../helpers";
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
import { createGuideline } from "./createGuideline";
import { pd } from "pretty-data";
import { join } from "path";
import { outputFile } from "fs-extra";
import { readFileSync } from "fs";

const highlightStyle = ""; //readFileSync(join(__dirname, "./hljs.xcode.css"), "utf8");

const types = [NodeType.TYPE, NodeType.ALIAS, NodeType.DATA, NodeType.CHOICE];

export const createHTML = (
  ast: IExpression[],
  modulePath: string,
  svgs: any,
  moduleName?: string
) => {
  const tables: string[] = [];

  let currentChapter;
  let chapters: any[] = [];

  // We will remove the hashes
  svgs.hashes = [];

  const transformedNodes = ast
    .filter((node: any) => !!!node.ignore)
    .filter(node => node.type)
    .map((node, index) => {
      if (node.type === NodeType.MARKDOWN_CHAPTER) {
        let chapter = node as IMarkdownChapter;
        if (chapter.depth === 1) {
          // clear the last one
          if (currentChapter) chapters.push({ ...currentChapter });
          // create a new chapter
          currentChapter = {
            title: chapter.content,
            id: index,
            subChapters: []
          };
        } else if (chapter.depth === 2) {
          if (!currentChapter) {
            // This happens when people start with an ##Header (h2)
            currentChapter = { title: chapter.content, id: index, subChapters: [] };
          } else {
            currentChapter.subChapters.push({ title: chapter.content, id: index });
          }
        }
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
        return generateHashAndFetchUrl(plantSource, svgs, modulePath);
      } else if (node.type === NodeType.MAP) {
        let plantSource = createMap(node as IMap);
        return generateHashAndFetchUrl(plantSource, svgs, modulePath);
      } else if (node.type === NodeType.AGGREGATE) {
        let plantSource = createAggregate(node as IAggregate, ast);
        return generateHashAndFetchUrl(plantSource, svgs, modulePath);
      } else if (node.type === NodeType.FLOW) {
        let result = "";
        const { state, sequence, useCase } = createFlow(node as any);
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
      } else if (node.type === NodeType.GUIDELINE) {
        return createGuideline(node as IGuideline);
      }
      return null;
    });

  if (currentChapter) {
    chapters.push(currentChapter);
  }

  const html = pd
    .xml(
      `
<html>
  <head>
    <title></title>
    <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet"> 
    <link rel="stylesheet" href="./../style.css">
    <style>${highlightStyle}</style>
  </head>
  <body>

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

  return { html, svgs };
};

export interface ILookup {
  types: string[];
  enums: string[];
}

function generateHashAndFetchUrl(plantSource: string, svgs: any, modulePath: string) {
  let hash = stringHash(plantSource);
  svgs.hashes.push(hash.toString());
  if (!svgs[hash]) {
    let url = generateURL(plantSource);
    svgs[hash] = url;
    fetchImage(url).then(img => {
      const filePathSVG = join(modulePath, hash + ".svg");
      outputFile(filePathSVG, img);
    });
    console.log("Hash doesn't exits: " + hash);
  } else {
    //
  }
  return `<div class="image-container"><img src="./${hash}.svg" /></div>`;
}
