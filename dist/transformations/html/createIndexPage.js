"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexPage = (modules) => {
    let moduleList = modules
        .map(m => {
        return `<li><a href="${m.htmlPath.replace(m.projectDirectory, "")}">${m.name}</a></li>`;
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