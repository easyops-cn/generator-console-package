import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { <%= componentClassName %> } from "./components/<%= componentName %>.component";

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
