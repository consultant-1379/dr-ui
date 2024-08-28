import { jobsFeatureKey, jobsReducer } from './store/jobs.reducer';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { JobsEffects } from './store/jobs.effects';
import { StoreModule } from '@ngrx/store';

export const config = {
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(jobsFeatureKey, jobsReducer),
    EffectsModule.forFeature([JobsEffects])
  ],
  exports: [
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
