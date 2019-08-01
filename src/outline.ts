import { parser } from "./parser";
import { purge, getStartToken, ITokenStart } from "./helpers";
import { resolve } from "path";

const BaseCstVisitorWithDefaults: any = parser.getBaseCstVisitorConstructorWithDefaults();

export class OutlineVisitor extends BaseCstVisitorWithDefaults {
  modules: any = {};

  constructor(modules?: any) {
    super();
    this.validateVisitor();
    this.modules = modules;
  }

  START(ctx: any): IExpression[] {
    const expressions = purge<IExpression>(
      (ctx.EXPRESSION || []).map(expression => this.visit(expression))
    );

    return expressions;
  }

  EXPRESSION(ctx: any): IExpression | null {
    const annotations: IAnnotation[] = purge(ctx.ANNOTATIONS.map(a => this.visit(a)));

    const ignoreAnnotation: any = annotations.find((a: IAnnotation) => a.key === "ignore");
    const ignore = ignoreAnnotation ? ignoreAnnotation.value === "true" : false;

    const aggregateAnnotation = annotations.find(a => a.key === "aggregate");
    const aggregate = aggregateAnnotation ? aggregateAnnotation.value : null;

    let result: any;

    if (ctx.TYPE) {
      result = {
        annotations,
        aggregate,
        ...this.visit(ctx.TYPE[0]),
        ignore
      };
    } else if (ctx.DATA) {
      result = {
        annotations,
        aggregate,
        ...this.visit(ctx.DATA[0]),
        ignore
      };
    } else if (ctx.ALIAS) {
      result = {
        annotations,
        aggregate,
        ...this.visit(ctx.ALIAS[0]),
        ignore
      };
    } else if (ctx.VIEW) {
      return {
        annotations,
        ...this.visit(ctx.VIEW[0]),
        ignore
      };
    } else if (ctx.OPEN) {
      return this.visit(ctx.OPEN[0]);
    } else if (ctx.CHOICE) {
      result = {
        annotations,
        aggregate,
        ...this.visit(ctx.CHOICE[0]),
        ignore
      };
    } else if (ctx.CommentBlock) {
      return {
        type: NodeType.COMMENT,
        comment: ctx.CommentBlock[0].image
      };
    } else if (ctx.AGGREGATE) {
      return {
        annotations,
        ...this.visit(ctx.AGGREGATE[0]),
        ignore
      };
    } else if (ctx.FLOW) {
      return {
        annotations,
        ...this.visit(ctx.FLOW[0]),
        ignore
      };
    } else if (ctx.MAP) {
      return {
        annotations,
        ...this.visit(ctx.MAP[0]),
        ignore
      };
    } else if (ctx.GUIDELINE) {
      return {
        annotations,
        ...this.visit(ctx.GUIDELINE[0])
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
    } else if (ctx.EndBlock) {
      // do nothing, already parsed at the top...
      return null;
    } else {
      console.log(ctx);
      return null;
    }

    result.plantUML = {
      id: result.aggregate ? `${result.aggregate}.${result.id}` : result.id
    };

    return result;
  }

  OPEN(ctx: any): IOpen {
    if (ctx.IMPORTING) {
      return {
        type: NodeType.OPEN,
        module: ctx.Identifier.map(i => i.image).join("."),
        module_start: getStartToken(ctx.Identifier[0]),
        imports: this.visit(ctx.IMPORTING[0]),
        imports_start: ctx.IMPORTING[0].children.Identifier.map(getStartToken)
      };
    } else {
      return {
        type: NodeType.OPEN,
        module: ctx.Identifier.map(i => i.image).join("."),
        module_start: getStartToken(ctx.Identifier[0]),
      };
    }
  }

  IMPORTING(ctx: any): string[] {
    return ctx.Identifier.map(i => i.image);
  }

  TYPE(ctx: any): IType {
    return {
      type: NodeType.TYPE,
      ...this.visit(ctx.IDENTIFIER[0]),
      extends: (ctx.Identifier || []).map(i => i.image),
      extends_start: (ctx.Identifier || []).map(getStartToken),
      fields: ctx.SIGN_EqualsType ? ctx.TYPE_FIELD.map(f => this.visit(f)) : []
    };
  }

  TYPE_FIELD(ctx: any): ITypeField | IPluckedField {
    if (ctx.KW_pluck) {
      return {
        type: NodeType.PLUCKED_FIELD,
        parts: ctx.Identifier.map(i => i.image),
        parts_start: ctx.Identifier.map(getStartToken),
        annotations: purge((ctx.ANNOTATIONS || []).map(a => this.visit(a)))
      };
    } else {
      return {
        type: NodeType.TYPE_FIELD,
        ...this.visit(ctx.IDENTIFIER[0]),
        ...this.visit(ctx.TYPE_IDENTIFIER[0]),
        restrictions: (ctx.RESTRICTION || []).map(r => this.visit(r)),
        annotations: purge((ctx.ANNOTATIONS || []).map(a => this.visit(a)))
      };
    }
  }

  DATA(ctx: any): IData {
    const options = ctx.DATA_OPTION.map(d => this.visit(d));
    return {
      type: NodeType.DATA,
      ...this.visit(ctx.IDENTIFIER[0]),
      options
    };
  }

  DATA_OPTION(ctx: any): IDataOption {
    return {
      type: NodeType.DATA_OPTION,
      ...this.visit(ctx.IDENTIFIER[0]),
      annotations: purge((ctx.ANNOTATIONS || []).map(a => this.visit(a)))
    };
  }

  ALIAS(ctx: any): IAlias {
    return {
      type: NodeType.ALIAS,
      ...this.visit(ctx.IDENTIFIER[0]),
      ...this.visit(ctx.TYPE_IDENTIFIER[0]),
      restrictions: (ctx.RESTRICTION || []).map(r => this.visit(r))
    };
  }

  VIEW(ctx: any): IView {
    return {
      type: NodeType.VIEW,
      id: ctx.ViewIdentifier ? ctx.ViewIdentifier[0].image : "",
      nodes: (ctx.Identifier || []).map(i => i.image),
      nodes_start: (ctx.Identifier || []).map(i => getStartToken(i)),
      directives: parseDirectives(ctx),
      annotations: []
    };
  }

  AGGREGATE(ctx: any): IAggregate {
    return {
      type: NodeType.AGGREGATE,
      root: ctx.ViewIdentifier ? ctx.ViewIdentifier[0].image : "",
      root_start: getStartToken(ctx.ViewIdentifier[0]),
      valueObjects: (ctx.Identifier || []).map(i => i.image),
      valueObjects_start: (ctx.Identifier || []).map(i => getStartToken(i)),
      directives: parseDirectives(ctx),
      operations: (ctx.OPERATION || []).map(o => this.visit(o)),
      annotations: []
    };
  }

  GUIDELINE(ctx: any): IGuideline {
    const directives = parseDirectives(ctx);
    const markdown = ctx.MARKDOWN.map(m => this.visit(m));
    let result = {
      type: NodeType.GUIDELINE,
      markdown,
      directives
    };
    directives.map(d => (result[d.key] = d.value));
    return result;
  }

  MARKDOWN(ctx: any): IMarkdown | null {
    if (ctx.MARKDOWN_CHAPTER) {
      return this.visit(ctx.MARKDOWN_CHAPTER[0]);
    } else if (ctx.MARKDOWN_PARAGRAPH) {
      return this.visit(ctx.MARKDOWN_PARAGRAPH[0]);
    } else if (ctx.MARKDOWN_IMAGE) {
      return this.visit(ctx.MARKDOWN_IMAGE[0]);
    } else if (ctx.MARKDOWN_CODE) {
      return this.visit(ctx.MARKDOWN_CODE[0]);
    } else if (ctx.MARKDOWN_LIST) {
      return this.visit(ctx.MARKDOWN_LIST[0]);
    } else {
      return null;
    }
  }

  FLOW(ctx: any): IFlow {
    return {
      type: NodeType.FLOW,
      operations: purge((ctx.OPERATION || []).map(o => this.visit(o))),
      directives: parseDirectives(ctx)
    };
  }

  OPERATION(ctx: any): IOperation | IFireAndForget | IFlowFunction | IPubSub {
    let annotations = purge(this.ROOT_ANNOTATIONS(ctx));

    let r: any = {};
    if (ctx.FLOW_FUNCTION) {
      r = this.visit(ctx.FLOW_FUNCTION[0]) as IFlowFunction;
    } else if (ctx.FLOW_PUB) {
      r = this.visit(ctx.FLOW_PUB[0]) as IPubSub;
    } else if (ctx.FLOW_SUB) {
      r = this.visit(ctx.FLOW_SUB[0]) as IPubSub;
    } else if (ctx.FLOW_SYSTEM) {
      r = this.visit(ctx.FLOW_SYSTEM[0]) as IOperation | IFireAndForget;
    }

    r.annotations = annotations;
    annotations.forEach(a => {
      r[a.key] = r[a.key] || a.value;
    });

    // it can be typed a "FLOW_FUNCTION" but actually be an operation,
    // we will rectify this...
    if (r.type === NodeType.FLOW_FUNCTION && r.to && r.from) {
      r.type = NodeType.OPERATION;
      r.result = r.ofType;
      r.result_start = r.ofType_start;
      r.result_params = r.ofType_params;
      r.result_params_start = r.ofType_params_start;
      delete r.ofType;
      delete r.ofType_params;
      delete r.ofType_start;
      delete r.ofType_params_start;
    }

    return r;
  }

  FLOW_FUNCTION(ctx: any): IFlowFunction {
    let params = (ctx.OPERATION_PARAMETER || []).map(p => this.visit(p));
    return {
      ...params[params.length - 1],
      type: NodeType.FLOW_FUNCTION,
      id: ctx.GenericParameter[0].image,
      id_start: getStartToken(ctx.GenericParameter[0]),
      params: (params as []).slice(0, params.length - 1)
    };
  }

  /**
   * A SYSTEM FLOW looks something like:
   *
   * @ id: getCustomer
   * ("Entity Service", SAP) :: String -> Customer
   */
  FLOW_SYSTEM(ctx: any): IOperation | IFireAndForget {
    let fireAndForget = !!ctx.SIGN_fireAndForget;
    let from: string = this.visit(ctx.ID_OR_STRING[0]) as string;
    let to: string = this.visit(ctx.ID_OR_STRING[1]) as string;

    let params: IOperationParameter[] = purge(
      (ctx.OPERATION_PARAMETER || []).map(p => this.visit(p))
    );
    let result = params[params.length - 1];

    if (fireAndForget) {
      return {
        type: NodeType.FIRE_FORGET,
        from,
        to,
        params
      } as IFireAndForget;
    } else {
      return {
        type: NodeType.OPERATION,
        from: from,
        to: to,
        params: (params as []).slice(0, params.length - 1),
        result: result.id || result.ofType,
        result_start: result.id_start || result.ofType_start,
        result_params: result.ofType_params,
        result_params_start: result.ofType_params_start,
        result_ofType: result.ofType,
        description: "",
        annotations: []
      };
    }
  }

  /**
   * Be able to publish to some queue
   *
   * "Customer Service" pub "The Event Name" :: Customer
   */
  FLOW_PUB(ctx: any): IPubSub {
    let params: IOperationParameter[] = purge(
      (ctx.OPERATION_PARAMETER || []).map(p => this.visit(p))
    );
    return {
      type: NodeType.PUB,
      service: this.visit(ctx.ID_OR_STRING[0]),
      event: this.visit(ctx.ID_OR_STRING[1]),
      message: params, //this.visit(ctx.OPERATION_RESULT).result,
      annotations: []
    };
  }

  /**
   * Be able to subscribe to some queue
   *
   * "Customer Service" sub "The Event Name" :: String
   */
  FLOW_SUB(ctx: any): IPubSub {
    let params: IOperationParameter[] = purge(
      (ctx.OPERATION_PARAMETER || []).map(p => this.visit(p))
    );
    return {
      type: NodeType.SUB,
      service: this.visit(ctx.ID_OR_STRING[0]),
      event: this.visit(ctx.ID_OR_STRING[1]),
      message: params,
      annotations: []
    };
  }

  ID_OR_STRING(ctx: any): string {
    if (ctx.Identifier) {
      return ctx.Identifier[0].image;
    } else if (ctx.GenericIdentifier) {
      return ctx.GenericIdentifier[0].image;
    } else {
      return ctx.StringLiteral[0].image.replace(/"/g, "");
    }
  }

  OPERATION_PARAMETER(ctx: any): IOperationParameter {
    let paramDetails;
    if (ctx.OPERATION_PARAMETER_FIELD_TYPE) {
      paramDetails = this.visit(ctx.OPERATION_PARAMETER_FIELD_TYPE[0]);
    } else if (ctx.OPERATION_PARAMETER_TYPE) {
      paramDetails = this.visit(ctx.OPERATION_PARAMETER_TYPE[0]);
    }
    return {
      type: NodeType.OPERATION_PARAMETER,
      ...paramDetails
    };
  }
  OPERATION_PARAMETER_TYPE(ctx: any) {
    let t = this.visit(ctx.TYPE_IDENTIFIER[0]);
    return {
      id: t.ofType,
      id_start: t.ofType_start,
      ...t
    };
  }
  OPERATION_PARAMETER_FIELD_TYPE(ctx: any) {
    return {
      id: ctx.GenericParameter[0].image,
      id_start: getStartToken(ctx.GenericParameter[0]),
      ...this.visit(ctx.TYPE_IDENTIFIER[0])
    };
  }

  CHOICE(ctx: any): IChoice {
    let type = this.visit(ctx.TYPE_IDENTIFIER[0]);
    return {
      type: NodeType.CHOICE,
      id: type.ofType,
      id_start: type.ofType_start,
      options: ctx.CHOICE_OPTION.map(o => this.visit(o)),
      options_start: ctx.CHOICE_OPTION.map(o => {
        const literal = o.children.StringLiteral || o.children.NumberLiteral;
        return getStartToken(literal[0]);
      }),
      annotations: purge((ctx.ANNOTATIONS || []).map(a => this.visit(a)))
    };
  }

  CHOICE_OPTION(ctx: any): IChoiceOption {
    let value: string | number = "";
    if (ctx.StringLiteral) {
      value = ctx.StringLiteral[0].image.replace(/"/g, "");
    }
    if (ctx.NumberLiteral) {
      value = +ctx.NumberLiteral[0].image;
    }

    return {
      type: ctx.NumberLiteral ? "number" : "string",
      id: value,
      annotations: purge((ctx.ANNOTATIONS || []).map(a => this.visit(a)))
    };
  }

  MAP(ctx: any): IMap {
    // TODO: add directives

    return {
      type: NodeType.MAP,
      directives: [],
      flows: ctx.MAP_FLOW.map(o => this.visit(o))
    };
  }
  MAP_FLOW(ctx: any): IMapFlow {
    return {
      type: NodeType.MAP_FLOW,
      nodes: purge(ctx.MAP_FLOW_KEY.map(o => this.visit(o)))
    };
  }

  MAP_FLOW_KEY(ctx: any): string | null {
    if (ctx.Identifier) {
      return ctx.Identifier[0].image;
    } else if (ctx.StringLiteral) {
      return ctx.StringLiteral[0].image.replace(/"/g, "");
    } else {
      return null;
    }
  }

  IDENTIFIER(ctx: any): IIdentity {
    if (ctx.GenericIdentifier) {
      return {
        id: ctx.GenericIdentifier[0].image,
        params: (ctx.GenericParameter || []).map(g => g.image),
        id_start: getStartToken(ctx.GenericIdentifier[0]),
        params_start: (ctx.GenericParameter || []).map(getStartToken)
      };
    } else if (ctx.FieldName) {
      return {
        id: ctx.FieldName[0].image,
        id_start: getStartToken(ctx.FieldName[0])
      };
    } else if (ctx.Identifier.length > 1) {
      //throw new Error("Invalid number of Identifiers");
      return {
        id: ctx.Identifier[0].image,
        id_start: getStartToken(ctx.Identifier[0])
      };
    } else {
      return {
        id: ctx.Identifier[0].image,
        id_start: getStartToken(ctx.Identifier[0])
      };
    }
  }

  TYPE_IDENTIFIER(ctx: any) {
    if (ctx.GenericIdentifier) {
      return {
        ofType: ctx.GenericIdentifier[0].image,
        ofType_params: (ctx.GenericParameter || []).map(g => g.image),
        ofType_start: getStartToken(ctx.GenericIdentifier[0]),
        ofType_params_start: (ctx.GenericParameter || []).map(getStartToken)
      };
    } else if (ctx.GenericParameter) {
      return {
        ofType: ctx.GenericParameter[0].image,
        ofType_start: getStartToken(ctx.GenericParameter[0]),
        ofType_params: [],
        ofType_params_start: []
      };
    } else if (ctx.SIGN_dot) {
      return {
        ofType: ctx.Identifier[0].image,
        ofType_start: getStartToken(ctx.Identifier[0]),
        ofType_params: [],
        ofType_params_start: [],
        field: ctx.Identifier[1].image,
        fieldStart: getStartToken(ctx.Identifier[1])
      };
    } else {
      let [ofType, ...ofType_params] = ctx.Identifier.map(i => i.image);
      let [ofType_start, ...ofType_params_start] = ctx.Identifier.map(getStartToken);
      return {
        ofType,
        ofType_start,
        ofType_params,
        ofType_params_start
      };
    }
  }

  RESTRICTION(ctx): IRestriction {
    return {
      key: ctx.RestrictionIdentifier[0].image,
      value: ctx.NumberLiteral
        ? +ctx.NumberLiteral[0].image
        : ctx.StringLiteral
          ? ctx.StringLiteral[0].image
          : ctx.PatternLiteral
            ? ctx.PatternLiteral[0].image
            : ctx.BooleanLiteral
              ? ctx.BooleanLiteral[0].image === "True"
              : false
    };
  }

  // GetIdentity(ctx: any): IIdentity {

  // }

  /* MARKDOWN */

  MARKDOWN_CHAPTER(ctx: any): IMarkdownChapter {
    const content: string = ctx.MarkdownChapterLiteral[0].image;
    const depth = content.startsWith("#####")
      ? 5
      : content.startsWith("####")
        ? 4
        : content.startsWith("###")
          ? 3
          : content.startsWith("##")
            ? 2
            : content.startsWith("#")
              ? 1
              : 1;
    return {
      type: NodeType.MARKDOWN_CHAPTER,
      content: content.replace(/#+/, ""),
      depth
    };
  }

  MARKDOWN_IMAGE(ctx: any): IMarkdownImage {
    const pattern = /(\[)(.*)(\])(\()(.*)(\))/;
    const segments = pattern.exec(ctx.MarkdownImageLiteral[0].image) || [];

    let uri = segments[5].startsWith("http") ? segments[5] : "file://" + resolve(segments[5]);

    return {
      type: NodeType.MARKDOWN_IMAGE,
      content: ctx.MarkdownImageLiteral[0].image,
      alt: segments[2],
      uri
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
    const source = (segments[3] || "")
      .trim()
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return {
      type: NodeType.MARKDOWN_CODE,
      content: ctx.MarkdownCodeLiteral[0].image,
      lang: segments[2],
      source: source
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
    const description = (ctx.AnnotationLiteral || [])
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
    return [descriptionAnnotation, ...(ctx.AnnotationLiteral || []).map(this.ANNOTATION)];
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
        key: result[3].trim().toLowerCase(),
        value: result[5].trim()
      }
      : null;
  }
}

const parseDirectives = (ctx: any): IDirective[] => {
  // Parse the Directives in the code.
  const pattern = /( *)(%)(.*)(:)(.*)(\n)/;
  let directives: IDirective[] = (ctx.DirectiveLiteral || []).map(d => {
    const segments = pattern.exec(d.image);
    if (segments) {
      return {
        key: segments[3].trim(),
        value: segments[5].trim()
      };
    } else {
      return {
        key: "description",
        value: d.image
          .replace(/%%/g, "")
          .split(/\n +/)
          .join(" ")
          .trim()
      };
    }
  });
  return directives;
};

export interface IOpen {
  type: NodeType;
  module: string;
  module_start: ITokenStart;
  imports?: string[];
  imports_start?: ITokenStart[];
}

export interface IType {
  type: NodeType;
  id: string;
  extends: string[];
  extends_start: ITokenStart[];
  params?: string[];
  fields: (ITypeField | IPluckedField)[];
  source?: string;
  annotations: IAnnotation[];
  imported?: boolean;
  ignore: boolean;
  aggregate?: string;
  plantUML?: {
    id: string;
  };
}

export interface ITypeField {
  type: NodeType;
  id: string;
  ofType: string;
  ofType_start: ITokenStart;
  ofType_params: string[];
  ofType_params_start: ITokenStart[];
  field?: string;
  fieldStart?: ITokenStart;
  annotations: IAnnotation[];
  source?: string;
  restrictions: IRestriction[];
}

export interface IPluckedField {
  type: NodeType;
  parts: string[];
  parts_start: ITokenStart[];
}

export interface IGuideline {
  type: NodeType;
  markdown: IMarkdown[];
  directives: IDirective[];
  title?: string;
  version?: string;
  subject?: string;
}

export interface IFlow {
  type: NodeType;
  directives: IDirective[];
  operations: (IOperation | IFireAndForget | IFlowFunction | IPubSub)[];
}

export interface IOperation {
  type: NodeType;
  id?: string;
  id_start?: ITokenStart;
  result: string;
  result_ofType: string;
  result_start: ITokenStart;
  result_params: string[];
  result_params_start: ITokenStart[];
  from: string;
  to: string;
  description: string;
  params: IOperationParameter[];
  annotations: IAnnotation[];
}

export interface IFlowFunction {
  type: NodeType;
  id: string;
  id_start: ITokenStart;
  ofType: string;
  ofType_ofType: string;
  ofType_start: ITokenStart;
  ofType_params: string[];
  ofType_params_start: ITokenStart[];
  description: string;
  params: IOperationParameter[];
  annotations: IAnnotation[];
}

export interface IOperationParameter {
  type: NodeType;
  id?: string;
  id_start?: ITokenStart;
  ofType: string;
  ofType_start: ITokenStart;
  ofType_params: string[];
  ofType_params_start: ITokenStart[];
}

export interface IFireAndForget {
  type: NodeType;
  id: string;
  id_start: ITokenStart;
  from: string;
  to: string;
  description: string;
  params: IOperationParameter[];
  annotations: IAnnotation[];
}

export interface IData {
  type: NodeType;
  id: string;
  params?: string[];
  options: IDataOption[];
  annotations: IAnnotation[];
  ignore: boolean;
  aggregate?: string;
  plantUML?: {
    id: string;
  };
}

export interface IDataOption {
  type: NodeType;
  id: string;
  params?: string[];
  annotations: IAnnotation[];
}

export interface IView {
  type: NodeType;
  id?: string;
  nodes: string[];
  nodes_start: ITokenStart[];
  directives: IDirective[];
  annotations: IAnnotation[];
}

export interface IMap {
  type: NodeType;
  directives: IDirective[];
  flows: IMapFlow[];
}
export interface IMapFlow {
  type: NodeType;
  nodes: string[];
}

export interface IAggregate {
  type: NodeType;
  root: string;
  root_start: ITokenStart;
  valueObjects: string[];
  valueObjects_start: ITokenStart[];
  directives: IDirective[];
  operations: IOperation[];
  annotations: IAnnotation[];
}

export interface IAlias {
  type: NodeType;
  id: string;
  ofType: string;
  ofType_start: ITokenStart;
  ofType_params: string[];
  ofType_params_start: ITokenStart[];
  annotations: IAnnotation[];
  restrictions: IRestriction[];
  source?: string;
  aggregate?: string;
  plantUML?: {
    id: string;
  };
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

export interface IDirective {
  key: string;
  value: string;
}

export interface IIdentity {
  id: string;
  id_start: ITokenStart;
  params?: string[];
  params_start?: ITokenStart[];
}

export interface IChoice {
  type: string;
  id: string;
  id_start: ITokenStart;
  options: IChoiceOption[];
  options_start: ITokenStart[];
  annotations: IAnnotation[];
  aggregate?: string;
  plantUML?: {
    id: string;
  };
}

export interface IPubSub {
  type: string;
  service: string;
  event: string;
  message: IOperationParameter[];
  annotations: IAnnotation[];
}

export interface IChoiceOption {
  type: string;
  id: string | number;
  annotations: IAnnotation[];
}

export interface IRestriction {
  key: string;
  value: string | number | boolean;
}

export interface IMarkdownChapter {
  type: NodeType;
  content: string;
  depth: number;
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

export type IMarkdown =
  | IMarkdownChapter
  | IMarkdownCode
  | IMarkdownImage
  | IMarkdownList
  | IMarkdownCode;

export type IExpression =
  | IOpen
  | IType
  | IAlias
  | IData
  | IComment
  | IAggregate
  | IChoice
  | IFlow
  | IView
  | IMap
  | IGuideline
  | IMarkdownChapter
  | IMarkdownCode
  | IMarkdownImage
  | IMarkdownList
  | IMarkdownParagraph;

export enum NodeType {
  TYPE = "TYPE",
  TYPE_FIELD = "TYPE_FIELD",
  ANNOTATION = "ANNOTATION",
  DATA = "DATA",
  DATA_OPTION = "DATA_OPTION",
  ALIAS = "ALIAS",
  COMMENT = "COMMENT",
  CHAPTER = "CHAPTER",
  IMAGE = "IMAGE",
  VIEW = "VIEW",
  AGGREGATE = "AGGREGATE",
  PARAGRAPH = "PARAGRAPH",
  MARKDOWN_CODE = "MARKDOWN_CODE",
  MARKDOWN_PARAGRAPH = "MARKDOWN_PARAGRAPH",
  MARKDOWN_IMAGE = "MARKDOWN_IMAGE",
  MARKDOWN_CHAPTER = "MARKDOWN_CHAPTER",
  MARKDOWN_LIST = "MARKDOWN_LIST",
  CHOICE = "CHOICE",
  PLUCKED_FIELD = "PLUCKED_FIELD",
  OPEN = "OPEN",
  FLOW = "FLOW",
  OPERATION = "OPERATION",
  OPERATION_PARAMETER = "OPERATION_PARAMETER",
  MAP = "MAP",
  MAP_FLOW = "MAP_FLOW",
  PUB = "PUB",
  SUB = "SUB",
  FIRE_FORGET = "FIRE_FORGET",
  FLOW_FUNCTION = "FLOW_FUNCTION",
  GUIDELINE = "GUIDELINE"
}

const defaultStart: ITokenStart = {
  startLineNumber: 0,
  endLineNumber: 0,
  startColumn: 0,
  endColumn: 0
};

export enum ErrorType {
  MismatchedTokenException = "MismatchedTokenException",
  TypeUndefined = "TypeUndefined",
  ParameterTypeUndefined = "ParameterTypeUndefined",
  FieldTypeUndefined = "FieldTypeUndefined",
  PluckedFieldUnknown = "PluckedFieldUnknown",
  PluckedFieldUndefined = "PluckedFieldUndefined",
  Other = "Other"
}

export interface IError {
  message: string | object;
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
  ruleStack?: string[];
  type?: ErrorType;
}
