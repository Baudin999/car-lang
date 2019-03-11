import * as path from "path";
import * as fs from "fs";
import * as chevrotain from "chevrotain";
const parserInstance = require("./parser").parser;

// extract the serialized grammar.
const serializedGrammar = parserInstance.getSerializedGastProductions();

// create the HTML Text
const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar);

// Write the HTML file to disk
const outPath = path.resolve(__dirname, "./../");
fs.writeFileSync(outPath + "/railroad.html", htmlText);
