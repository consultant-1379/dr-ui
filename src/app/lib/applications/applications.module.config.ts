import { applicationsFeatureKey, applicationsReducer } from './store/applications.reducer';

import { ApplicationsEffects } from './store/applications.effects';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

export const config = {
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(applicationsFeatureKey, applicationsReducer),
    EffectsModule.forFeature([ApplicationsEffects])
  ],
  exports: [
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
