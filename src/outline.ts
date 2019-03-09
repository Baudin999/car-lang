import { parser } from "./parser";
import { purge, getStartToken, ITokenStart } from "./helpers";

const BaseCstVisitorWithDefaults: any = parser.getBaseCstVisitorConstructorWithDefaults();

export class OutlineVisitor extends BaseCstVisitorWithDefaults {
  tags: any = {};

  constructor() {
    super();
    this.validateVisitor();
  }

  START(ctx: any) {
    const expressions = ctx.EXPRESSION.map(expression => this.visit(expression));

    return expressions;
  }

  EXPRESSION(ctx: any): IType | IData | IAlias | IComment | null {
    const annotations = purge(ctx.ROOT_ANNOTATIONS.map(a => this.visit(a)));
    if (ctx.TYPE) {
      return {
        annotations,
        ...this.visit(ctx.TYPE[0])
      };
    } else if (ctx.DATA) {
      return {
        annotations,
        ...this.visit(ctx.DATA[0])
      };
    } else if (ctx.ALIAS) {
      return {
        annotations,
        ...this.visit(ctx.ALIAS[0])
      };
    } else if (ctx.CommentBlock) {
      return {
        type: NodeType.COMMENT,
        comment: ctx.CommentBlock[0].image
      };
    } else if (ctx.MARKDOWN_CHAPTER) {
      return this.visit(ctx.MARKDOWN_CHAPTER[0]);
    } else if (ctx.MARKDOWN_IMAGE) {
      return this.visit(ctx.MARKDOWN_IMAGE[0]);
    } else if (ctx.MARKDOWN_PARAGRAPH) {
      return this.visit(ctx.MARKDOWN_PARAGRAPH[0]);
    } else if (ctx.MARKDOWN_CODE) {
      return this.visit(ctx.MARKDOWN_CODE[0]);
    } else if (ctx.MARKDOWN_LIST) {
      return this.visit(ctx.MARKDOWN_LIST);
    } else {
      console.log(ctx);
      return null;
    }
  }

  TYPE(ctx: any): IType {
    return {
      type: NodeType.TYPE_FIELD,
      ...this.GetIdentity(ctx),
      fields: ctx.SIGN_EqualsType ? ctx.TYPE_FIELD.map(f => this.visit(f)) : []
    };
  }

  TYPE_FIELD(ctx: any): ITypeField {
    const items = purge<string>([
      (ctx.GenericIdentifier || []).map(i => i.image),
      (ctx.ConcreteIdentifier || []).map(i => i.image),
      (ctx.Identifier || []).map(i => i.image),
      (ctx.GenericParameter || []).map(i => i.image)
    ]);
    return {
      type: NodeType.TYPE_FIELD,
      ...this.GetIdentity(ctx),
      ofType: items,
      annotations: purge((ctx.ANNOTATIONS || []).map(a => this.visit(a)))
    };
  }

  DATA(ctx: any): IData {
    const options = ctx.DATA_OPTION.map(d => this.visit(d));
    return {
      type: NodeType.DATA,
      ...this.GetIdentity(ctx),
      options
    };
  }

  DATA_OPTION(ctx: any): IDataOption {
    return {
      type: NodeType.DATA_OPTION,
      ...this.GetIdentity(ctx)
    };
  }

  ALIAS(ctx: any): IAlias {
    return {
      type: NodeType.ALIAS,
      ...this.GetIdentity(ctx),
      ...this.visit(ctx.ALIAS_FOR[0])
    };
  }

  ALIAS_FOR(ctx: any): IAliasFor {
    const items = purge([
      (ctx.GenericIdentifier || []).map(i => i.image),
      (ctx.ConcreteIdentifier || []).map(i => i.image),
      (ctx.Identifier || []).map(i => i.image),
      (ctx.GenericParameter || []).map(i => i.image),
      (ctx.StringLiteral || []).map(i => i.image),
      (ctx.NumberLiteral || []).map(i => i.image),
      (ctx.PatternLiteral || []).map(i => i.image)
    ]);
    return {
      ofType: items
    };
  }

  GetIdentity(ctx: any): IIdentity {
    if (ctx.GenericIdentifier) {
      return {
        id: ctx.GenericIdentifier[0].image,
        params: ctx.GenericParameter.map(g => g.image),
        id_start: getStartToken(ctx.GenericIdentifier[0]),
        params_start: ctx.GenericParameter.map(getStartToken)
      };
    } else if (ctx.FieldName) {
      return {
        id: ctx.FieldName[0].image,
        id_start: getStartToken(ctx.FieldName[0])
      };
    } else {
      return {
        id: ctx.Identifier[0].image,
        id_start: getStartToken(ctx.Identifier[0])
      };
    }
  }

  /* MARKDOWN */

  MARKDOWN_CHAPTER(ctx: any): IMarkdownChapter {
    return {
      type: NodeType.MARKDOWN_CHAPTER,
      content: ctx.MarkdownChapterLiteral[0].image
    };
  }

  MARKDOWN_IMAGE(ctx: any): IMarkdownImage {
    const pattern = /(\[)(.*)(\])(\()(.*)(\))/;
    const segments = pattern.exec(ctx.MarkdownImageLiteral[0].image) || [];

    return {
      type: NodeType.MARKDOWN_IMAGE,
      content: ctx.MarkdownImageLiteral[0].image,
      alt: segments[2],
      uri: segments[5]
    };
  }

  MARKDOWN_PARAGRAPH(ctx: any): IMarkdownParagraph {
    return {
      type: NodeType.MARKDOWN_PARAGRAPH,
      content: ctx.MarkdownParagraphLiteral[0].image
    };
  }

  MARKDOWN_CODE(ctx: any): IMarkdownCode {
    const pattern = /(`{3})(\w*(?=\n))?([^`]*)(`{3})/;
    const segments = pattern.exec(ctx.MarkdownCodeLiteral[0].image) || [];

    return {
      type: NodeType.MARKDOWN_CODE,
      content: ctx.MarkdownCodeLiteral[0].image,
      lang: segments[2],
      source: (segments[3] || "").trim()
    };
  }

  MARKDOWN_LIST(ctx: any): IMarkdownList | null {
    const items = ctx.MarkdownListLiteral[0].image
      .split(/\n */)
      .map(s => s.replace(/\*/, "").trim())
      .filter(f => f);
    return {
      type: NodeType.MARKDOWN_LIST,
      items
    };
  }

  /* ANNOTATIONS */

  ROOT_ANNOTATIONS(ctx: any): IAnnotation[] {
    // The description is the accumulation of all the annotations
    // without a real key.
    const description = (ctx.Annotation || [])
      .filter(a => a.image.indexOf(":") === -1)
      .map(a => {
        const pattern = /( *)(@)(.*)/;
        const result = pattern.exec(a.image) || [];
        return (result[3] || "").trim();
      })
      .join(" ");

    // Create the description annotation.
    const descriptionAnnotation = description
      ? {
          type: NodeType.ANNOTATION,
          key: "description",
          value: description
        }
      : null;

    // return the collection of annotations with the description annotation
    return [descriptionAnnotation, ...(ctx.Annotation || []).map(this.ANNOTATION)];
  }

  ANNOTATIONS(ctx: any) {
    return this.ROOT_ANNOTATIONS(ctx);
  }

  ANNOTATION(ctx: any): IAnnotation | null {
    const pattern = /( *)(@)(.*)(:)(.*)/;
    const result = pattern.exec(ctx.image);
    return result
      ? {
          type: NodeType.ANNOTATION,
          key: result[3].trim(),
          value: result[5].trim()
        }
      : null;
  }
}

export interface IType {
  type: NodeType;
  id: string;
  params?: string[];
  fields: ITypeField[];
}

export interface ITypeField {
  type: NodeType;
  id: string;
  ofType: string[];
  annotations: IAnnotation[];
}

export interface IData {
  type: NodeType;
  id: string;
  params?: string[];
  options: IDataOption[];
}

export interface IDataOption {
  type: NodeType;
  id: string;
  params?: string[];
}

export interface IAlias {
  type: NodeType;
  id: string;
}

export interface IComment {
  type: NodeType;
  comment: string;
}

export interface IAliasFor {
  ofType: string[];
}

export interface IAnnotation {
  type: NodeType;
  key: string;
  value: string;
}

export interface IIdentity {
  id: string;
  id_start: ITokenStart;
  params?: string[];
  params_start?: ITokenStart[];
}

export interface IMarkdownChapter {
  type: NodeType;
  content: string;
}

export interface IMarkdownImage {
  type: NodeType;
  content: string;
  alt: string;
  uri: string;
}

export interface IMarkdownCode {
  type: NodeType;
  content: string;
  lang: string;
  source: string;
}

export interface IMarkdownParagraph {
  type: NodeType;
  content: string;
}

export interface IMarkdownList {
  type: NodeType;
  items: string[];
}

enum NodeType {
  TYPE = "TYPE",
  TYPE_FIELD = "TYPE_FIELD",
  ANNOTATION = "ANNOTATION",
  DATA = "DATA",
  DATA_OPTION = "DATA_OPTION",
  ALIAS = "ALIAS",
  COMMENT = "COMMENT",
  CHAPTER = "CHAPTER",
  IMAGE = "IMAGE",
  PARAGRAPH = "PARAGRAPH",
  MARKDOWN_CODE = "MARKDOWN_CODE",
  MARKDOWN_PARAGRAPH = "MARKDOWN_PARAGRAPH",
  MARKDOWN_IMAGE = "MARKDOWN_IMAGE",
  MARKDOWN_CHAPTER = "MARKDOWN_CHAPTER",
  MARKDOWN_LIST = "MARKDOWN_LIST"
}
