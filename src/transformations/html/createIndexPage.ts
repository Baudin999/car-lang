import { IModule } from "./../../helpers";

export const createIndexPage = (modules: IModule[], isRelease: boolean, useRelativePaths: boolean) => {
  let moduleList = modules
    .map(m => {
      if(useRelativePaths) {
        return `<li><a href="${m.name + `/` +m.name}.html">${m.name}</a></li>`;
      } else {
      return `<li><a href="/public/${m.name}.html">${m.name}</a></li>`
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
