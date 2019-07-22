import { IModule } from "./../../helpers";

export const createIndexPage = (modules: IModule[], isRelease: boolean) => {
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
