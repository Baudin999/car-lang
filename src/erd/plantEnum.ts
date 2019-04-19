import { IChoice } from "../outline";
import { foldText } from "../helpers";

export class PlantEnum {
    node: IChoice;
    constructor(node: IChoice) {
        this.node = node;
    }

    fields() {
        return this.node.options
            .map(o => {
                return `\t${o.id}`;
            })
            .join("\n");
    }

    annotations() {
        if (this.node.annotations.length === 0) return "";
        const annotations = this.node.annotations
            .map(a => foldText(`<b>${a.key}</b>: ${a.value}`))
            .join("\n");
        return `
  ---
  ${annotations}
    `;
    }

    toString(): string {
        return `
enum ${this.node.id} {
${this.fields()}
${this.annotations()}
}
`.trim();
    }
}
