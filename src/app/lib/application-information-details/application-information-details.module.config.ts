import { LoaderAnimationModule } from '@erad/components/loader-animation';
import { ButtonModule, EdsIconModule } from '@erad/components';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

import { ApplicationInformationDetailsComponent } from './containers/application-information-details/application-information-details.component';

export const config = {
  declarations: [
    ApplicationInformationDetailsComponent
  ],
  imports: [
    CommonModule,
    LoaderAnimationModule,
    TranslateModule.forChild(),
    ButtonModule,
    EdsIconModule
  ],
  exports: [
    ApplicationInformationDetailsComponent
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
