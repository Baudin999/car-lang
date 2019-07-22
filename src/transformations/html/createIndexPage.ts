import { IModule } from "./../../helpers";

export const createIndexPage = (modules: IModule[]) => {
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
