import {ModuleConfiguration} from "@erad/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { ApplicationsCardViewComponent } from "./applications-card-view.component";
import { CardModule } from "@erad/components";

export const config: ModuleConfiguration = {
  declarations: [
    ApplicationsCardViewComponent
  ],
  exports: [
    ApplicationsCardViewComponent,
    CardModule
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
