import { IExtendedNg2StateDeclaration } from "@easyops/console-schema";
import { IndexComponent } from './pages/index/index.component';

const stateRoot: IExtendedNg2StateDeclaration = {
  name: "ext.@console-plugin/<%= packageName %>",
  url: "/@console-plugin/<%= packageName %>",
  component: IndexComponent,
  breadcrumb: {
    title: "<%= packageName %>"
  }
};

export const states: IExtendedNg2StateDeclaration[] = [
  stateRoot
];
