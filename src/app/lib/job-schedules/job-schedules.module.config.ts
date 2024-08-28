import { jobSchedulesReducer as JobSchedulesReducer, jobSchedulesFeatureKey } from './store/job-schedules.reducer';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { JobSchedulesEffects } from './store/job-schedules.effects';
import { StoreModule } from '@ngrx/store';

export const config = {
  declarations: [],
  imports: [
    CommonModule,
    EffectsModule.forFeature([JobSchedulesEffects]),
    StoreModule.forFeature(jobSchedulesFeatureKey, JobSchedulesReducer)
  ],
  exports: [
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
