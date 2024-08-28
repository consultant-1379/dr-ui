import { applicationDetailsFeatureKey, applicationDetailsReducer } from './store/application-details.reducer';

import { ApplicationDetailsEffects } from './store/application-details.effects';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

export const config = {
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(applicationDetailsFeatureKey, applicationDetailsReducer),
    EffectsModule.forFeature([ApplicationDetailsEffects])
  ],
  exports: [
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
