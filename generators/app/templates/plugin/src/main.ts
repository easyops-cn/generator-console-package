import { platformExtension } from "@easyops/console-plugin-core";
import { <%= moduleName %> } from "./index.module";

platformExtension("@console-plugin/<%= packageName %>").bootstrapModule(
  <%= moduleName %>
);
