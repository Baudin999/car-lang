"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIndexPage = (modules, isRelease) => {
    let moduleList = modules
        .map(m => {
        return isRelease
            ? `<li><a href="/public/${m.name}.html">${m.name}</a></li>`
            : `<li><a href="${m.htmlPath.replace(m.projectDirectory, "")}">${m.name}</a></li>`;
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