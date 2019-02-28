import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UIRouterModule } from "@uirouter/angular";

import { states } from "./index.states";
import { IndexComponent } from './pages/index/index.component';

@NgModule({
  imports: [
    CommonModule,
    UIRouterModule.forChild({ states }),
  ],
  declarations: [IndexComponent],
  entryComponents: [IndexComponent]
})
export class <%= moduleName %> {}
