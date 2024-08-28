import { LoaderModule, SelectionModule } from '@erad/components';

import { ButtonModule } from '@erad/components/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateJobComponent } from './create-job.component';
import { CreateJobInformationFormComponent } from './create-job-information-form/create-job-information-form.component';
import { DropdownModule } from '@erad/components/dropdown';
import { DynamicInputsDisplayModule } from '../dynamic-inputs-display/dynamic-inputs-display.module';
import { JobDefinitionDropdownModule } from '../job-definition-dropdown/job-definition-dropdown.module';
import { LayoutModule } from '@erad/components/layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModuleConfiguration } from '@erad/core';
import { TextInputModule } from '@erad/components/text-input';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [
    CreateJobComponent,
    CreateJobInformationFormComponent,
  ],
  exports: [
    CreateJobComponent,
    CreateJobInformationFormComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    DropdownModule,
    DynamicInputsDisplayModule,
    JobDefinitionDropdownModule,
    LayoutModule,
    LoaderModule,
    MatTooltipModule,
    TextInputModule,
    TranslateModule.forChild(),
    SelectionModule
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
