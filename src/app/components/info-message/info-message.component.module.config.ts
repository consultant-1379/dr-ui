import { ModuleConfiguration } from "@erad/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { InfoMessageComponent } from "./info-message.component";

export const config: ModuleConfiguration = {
  declarations: [
    InfoMessageComponent
  ],
  exports: [
    InfoMessageComponent
  ],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
