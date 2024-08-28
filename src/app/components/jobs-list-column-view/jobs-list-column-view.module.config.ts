import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FailureDisplayModule } from '../failure-display/failure-display.module';
import { InfoMessageComponentModule } from '../info-message/info-message.component.module';
import { JobDefinitionDropdownModule } from '../job-definition-dropdown/job-definition-dropdown.module';
import { JobsListColumnViewComponent } from './jobs-list-column-view.component';
import { LoaderAnimationModule } from '@erad/components';
import { ModuleConfiguration } from '@erad/core';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [
    JobsListColumnViewComponent
  ],
  exports: [
    JobsListColumnViewComponent
  ],
  imports: [
    FailureDisplayModule,
    InfoMessageComponentModule,
    JobDefinitionDropdownModule,
    LoaderAnimationModule,
    TranslateModule.forChild(),
    CommonModule
  ],
  providers: [

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
};
