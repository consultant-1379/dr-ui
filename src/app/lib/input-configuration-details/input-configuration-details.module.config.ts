import { inputConfigKey, inputConfigDetailsReducer } from './store/input-configuration-details.reducer';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { InputConfigDetailsEffects } from './store/input-configuration-details.effects';
import { StoreModule } from '@ngrx/store';

export const config = {
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(inputConfigKey, inputConfigDetailsReducer),
    EffectsModule.forFeature([InputConfigDetailsEffects])
  ],
  exports: [
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
};
