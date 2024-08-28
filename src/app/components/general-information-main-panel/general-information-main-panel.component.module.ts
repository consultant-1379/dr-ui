import {NgModule} from "@angular/core";
import {config} from "./general-information-main-panel.component.module.config";

@NgModule({
  declarations: config.declarations,
  exports: config.exports,
  imports: config.imports,
  providers: config.providers,
  schemas: config.schemas
})

export class GeneralInformationMainPanelModule{}