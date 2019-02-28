import { platformBrick } from "@easyops/console-plugin-core";
import { <%= moduleName %> } from "./index.module";

platformBrick("<%= scope %>/<%= packageName %>").bootstrapModule(
  <%= moduleName %>
);
