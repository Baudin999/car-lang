import { IChoice } from "../outline";

export class PlantEnum {
  node: IChoice;
  constructor(node: IChoice) {
    this.node = node;
  }

  fields() {
    return this.node.options.map(o => `\t${o}`).join("\n");
  }

  toString(): string {
    return `
enum ${this.node.id} {
${this.fields()}
}
`.trim();
  }
}
