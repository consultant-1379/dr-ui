import * as fromInputConfig from './input-configuration-details.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectInputConfigDetailsState = createFeatureSelector<fromInputConfig.InputConfigDetailsState>(
  fromInputConfig.inputConfigKey
);

export const getInputConfigDetails = createSelector(
  selectInputConfigDetailsState,
  state => state.inputConfig
);

export const getInputConfigDetailsLoading = createSelector(
  selectInputConfigDetailsState,
  state => state.loading
);

export const getInputConfigDetailsFailure = createSelector(
  selectInputConfigDetailsState,
  state => state.failure
);
