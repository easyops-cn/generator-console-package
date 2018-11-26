import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIRouterModule } from "@uirouter/angular";
import { Extension } from "@easyops/console-plugin-core";

import { states } from "./index.states";
import { IndexComponent } from './pages/index/index.component';

@Extension("@console-plugin/just-for-test")
@NgModule({
  imports: [
    CommonModule,
    UIRouterModule.forChild({ states }),
  ],
  declarations: [IndexComponent],
  entryComponents: [IndexComponent]
})
export class <%= moduleName %> {}
