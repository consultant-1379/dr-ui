import { ButtonModule } from '@erad/components/button';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateJobComponentModule } from '../create-job/create-job.component.module';
import { CreateScheduleComponent } from './create-schedule.component';
import { CreateScheduleFormComponent } from './create-schedule-form/create-schedule-form.component';
import { JobScheduleDetailsModule } from 'src/app/lib/job-schedule-details/job-schedule-details.module';
import { LoaderModule } from '@erad/components/loader';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ModuleConfiguration } from '@erad/core';
import { TextInputModule } from '@erad/components/text-input';
import { TranslateModule } from '@ngx-translate/core';

export const config: ModuleConfiguration = {
  declarations: [
    CreateScheduleFormComponent,
    CreateScheduleComponent,
  ],
  exports: [
    CreateScheduleFormComponent,
    CreateScheduleComponent,
  ],
  imports: [
    ButtonModule,
    CommonModule,
    CreateJobComponentModule,
    JobScheduleDetailsModule,
    LoaderModule,
    MatTooltipModule,
    TextInputModule,
    TranslateModule.forChild(),
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
