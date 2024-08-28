import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";

import { CommonModule } from "@angular/common";
import { FailureDisplayModule } from "../failure-display/failure-display.module";
import { InfoMessageComponentModule } from "../info-message/info-message.component.module";
import { JobInputsComponent } from './job-inputs.component';
import { LoaderAnimationModule } from "@erad/components";
import { TranslateModule } from "@ngx-translate/core";

@NgModule({
  declarations: [
    JobInputsComponent
  ],
  exports: [
    JobInputsComponent
  ],
  imports: [
    CommonModule,
    FailureDisplayModule,
    InfoMessageComponentModule,
    LoaderAnimationModule,
    TranslateModule.forChild()
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class JobInputsModule{}