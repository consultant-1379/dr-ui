import * as fromInputConfigs from './input-configurations.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';

const selectInputConfigsState = createFeatureSelector<fromInputConfigs.InputConfigsState>(
  fromInputConfigs.inputConfigsKey
);

export const getInputConfigs = createSelector(
  selectInputConfigsState,
  state => state.inputConfigurations
);

export const getInputConfigsTotalCount = createSelector(
  selectInputConfigsState,
  state => state.totalCount
);

export const getInputConfigsLoading = createSelector(
  selectInputConfigsState,
  state => state.loading
);

export const getInputConfigsFailure = createSelector(
  selectInputConfigsState,
  state => state.failure
);
