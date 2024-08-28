import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EnableSwitchModule } from "../enable-switch/enable-switch.module";
import { GeneralInformationMainPanelComponent } from "./general-information-main-panel.component";
import { GroupedItemsModule } from "@erad/components/grouped-items";
import { InfoPopupModule } from '@erad/components';
import { MatTableModule } from '@angular/material/table';
import { ModuleConfiguration } from "@erad/core";
import { TranslateModule } from "@ngx-translate/core";

export const config: ModuleConfiguration = {
  declarations: [
    GeneralInformationMainPanelComponent,
  ],
  exports: [
    GeneralInformationMainPanelComponent
  ],
  imports: [
    CommonModule,
    EnableSwitchModule,
    GroupedItemsModule,
    InfoPopupModule,
    MatTableModule,
    TranslateModule.forChild(),
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
