import { JobScheduleDetailsReducer, jobScheduleDetailsFeatureKey } from './store/job-schedule-details.reducer';

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InfoPopupModule, LoaderAnimationModule } from '@erad/components';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { FailureDisplayModule } from 'src/app/components/failure-display/failure-display.module';
import { GeneralInformationMainPanelModule } from 'src/app/components/general-information-main-panel/general-information-main-panel.component.module';
import { InfoMessageComponentModule } from 'src/app/components/info-message/info-message.component.module';
import { JobInputsModule } from 'src/app/components/job-inputs/job-inputs.component.module';
import { JobListColumnViewModule } from 'src/app/components/jobs-list-column-view/jobs-list-column-view.module';
import { ScheduleDetailColumnViewComponent } from 'src/app/components/schedule-detail-column-view/schedule-detail-column-view.component';
import { ScheduleDetailsColumnContainerComponent } from 'src/app/components/schedule-details-column-container/schedule-details-column-container.component';
import { ItemInformationDetailsModule } from '../item-information-details/item-information-details.module';
import { JobScheduleDetailsEffects } from './store/job-schedule-details.effects';

export const config = {
  declarations: [
    ScheduleDetailColumnViewComponent,
    ScheduleDetailsColumnContainerComponent
  ],
  imports: [
    CommonModule,
    GeneralInformationMainPanelModule,
    StoreModule.forFeature(jobScheduleDetailsFeatureKey, JobScheduleDetailsReducer),
    EffectsModule.forFeature([JobScheduleDetailsEffects]),
    FailureDisplayModule,
    JobListColumnViewModule,
    JobInputsModule,
    InfoMessageComponentModule,
    InfoPopupModule,
    ItemInformationDetailsModule,
    LoaderAnimationModule,
    TranslateModule.forChild(),
  ],
  exports: [
    ScheduleDetailColumnViewComponent,
    ScheduleDetailsColumnContainerComponent
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
