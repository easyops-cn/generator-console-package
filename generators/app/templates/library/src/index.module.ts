import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Extension } from "@easyops/console-plugin-core";
import { <%= componentClassName %> } from "./components/<%= componentName %>.component";

@Extension("<%= scope %>/<%= packageName %>")
@NgModule({
  imports: [CommonModule],
  declarations: [
    <%= componentClassName %>
  ],
  exports: [
    <%= componentClassName %>
  ]
})
export class <%= moduleName %> {}
