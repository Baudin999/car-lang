"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fetch = require("node-fetch");
/**
 *
 * "startLine": 2,
 * "endLine": 2,
 * "startColumn": 14,
 * "endColumn": 19,
 *
 */
exports.getStartToken = (tokenId) => {
    const result = {
        startLineNumber: tokenId.startLine || tokenId.startLineNumber,
        endLineNumber: tokenId.endLine || tokenId.endLineNumber,
        startColumn: tokenId.startColumn,
        endColumn: tokenId.endColumn + 1
    };
    return result;
};
exports.flatten = (items) => {
    return [].concat.apply([], items);
};
exports.purge = (items) => {
    return exports.flatten(items).filter(i => !!i);
};
exports.clone = (source, template) => {
    if (template) {
        return Object.assign({}, JSON.parse(JSON.stringify(source)), template);
    }
    else {
        return JSON.parse(JSON.stringify(source));
    }
};
/**
 * Fold a long line and intersperse with newlines at certain intervals
 * @param s - input string
 * @param n - number of chars at which to separate lines
 * @param useSpaces - if true, attempt to insert newlines at whitespace
 * @param a - array used to build result, defaults to new array
 */
function foldText(s, n = 40, split = "\n", useSpaces = true, a = []) {
    a = a || [];
    if (s.length <= n) {
        a.push(s);
        return a.join(split);
    }
    var line = s.substring(0, n);
    if (!useSpaces) {
        // insert newlines anywhere
        a.push(line);
        return foldText(s.substring(n), n, split, useSpaces, a);
    }
    else {
        // attempt to insert newlines after whitespace
        var lastSpaceRgx = /\s(?!.*\s)/;
        var idx = line.search(lastSpaceRgx);
        var nextIdx = n;
        if (idx > 0) {
            line = line.substring(0, idx);
            nextIdx = idx;
        }
        a.push(line);
        return foldText(s.substring(nextIdx), n, split, useSpaces, a);
    }
}
exports.foldText = foldText;
exports.fetchImage = url => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(r => r.text())
            .then(r => {
            resolve(r);
        });
    });
};
exports.baseTypes = [
    "String",
    "Char",
    "Integer",
    "Number",
    "Decimal",
    "Double",
    "Boolean",
    "Date",
    "Time",
    "DateTime"
];
exports.baseTypeToXSDType = (b) => {
    switch (b) {
        case "String":
        case "Char":
            return "xsd:string";
        case "Number":
            return "xsd:integer";
        case "Boolean":
            return "xsd:boolean";
        case "Date":
            return "xsd:date";
        case "DateTime":
            return "xsd:dateTime";
        case "Time":
            return "xsd:time";
        default:
            return `self:${b}`;
    }
};
exports.mapRestrictionToXSD = (baseType, restriction) => {
    switch (baseType) {
        case "String":
            switch (restriction.key) {
                case "min":
                    return `<xsd:minLength value="${restriction.value}" />`;
                case "max":
                    return `<xsd:maxLength value="${restriction.value}" />`;
                case "length":
                    return `<xsd:length value="${restriction.value}" />`;
                case "pattern":
                    return `<xsd:pattern value="${restriction.value}" />`;
                default:
                    return "";
            }
        case "Char":
            return `
      <xsd:minLength value="1" />
      <xsd:maxLength value="1" />
      `.trim();
        case "Number":
            switch (restriction.key) {
                case "min":
                    return `<xsd:minInclusive value="${restriction.value}" />`;
                case "max":
                    return `<xsd:maxInclusive value="${restriction.value}" />`;
                case "pattern":
                    return `<xsd:pattern value="${restriction.value}" />`;
                default:
                    return "";
            }
        default:
            return "";
    }
};
exports.last = (array) => {
    return array[array.length - 1];
};
exports.splitFrom = (array, index) => {
    let start = array.slice(0, index);
    let end = array.slice(index, array.length - 1);
    return { start, end };
};
exports.splitFromLast = (array) => {
    let { start } = exports.splitFrom(array, array.length - 1);
    return { items: start, last: exports.last(array) };
};
exports.baseTypeToJSONType = (b) => {
    switch (b) {
        case "String":
        case "Date":
        case "DateTime":
        case "Time":
            return "string";
        case "Number":
            return "number";
        case "Boolean":
            return "boolean";
        default:
            return null;
    }
};
exports.baseTypeToTypeScriptType = (b) => {
    switch (b) {
        case "String":
            return "string";
        case "Number":
            return "number";
        case "Boolean":
            return "boolean";
        case "Date":
            return "Date";
        case "DateTime":
            return "Date";
        case "Time":
            return "string";
        default:
            return "I" + b;
    }
};
//# sourceMappingURL=helpers.js.map