import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import { JobDetailsColumnContainerComponent } from "./job-details-column-container.component";
import { CommonModule } from "@angular/common";
import { InfoPopupModule, LoaderAnimationModule } from "@erad/components";
import { TranslateModule } from "@ngx-translate/core";
import { InfoMessageComponentModule } from "../info-message/info-message.component.module";
import { JobInputsModule } from "../job-inputs/job-inputs.component.module";
import { JobDetailsModule } from "src/app/lib/job-detail/job-details.module";
import { ItemInformationDetailsModule } from "src/app/lib/item-information-details/item-information-details.module";
import { FailureDisplayModule } from "../failure-display/failure-display.module";

@NgModule({
  declarations: [
    JobDetailsColumnContainerComponent,
  ],
  exports: [
    JobDetailsColumnContainerComponent
  ],
  imports: [
    CommonModule,
    FailureDisplayModule,
    InfoMessageComponentModule,
    InfoPopupModule,
    ItemInformationDetailsModule,
    JobDetailsModule,
    JobInputsModule,
    LoaderAnimationModule,
    TranslateModule.forChild(),
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class JobDetailsColumnContainerComponentModule{}