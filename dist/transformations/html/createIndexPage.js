"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexPage = (modules, isRelease, useRelativePaths) => {
    let moduleList = modules
        .map(m => {
        if (useRelativePaths) {
            return `<li><a href="${m.name + `/` + m.name}.html">${m.name}</a></li>`;
        }
        else {
            return `<li><a href="${m.htmlPath}">${m.name}</a></li>`;
        }
    })
        .join("\n");
    let source = `
<html>
      <body>
      <h1>Modules</h1>
        <ul>
          ${moduleList}
        </ul>
      </body>
</html>      
      `;
    return source;
};
//# sourceMappingURL=createIndexPage.js.map