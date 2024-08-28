
import { InputConfiguration } from 'src/app/models/input-configuration.model';
import { initialState } from './input-configurations.reducer';
import { getInputConfigs, getInputConfigsFailure, getInputConfigsLoading, getInputConfigsTotalCount } from './input-configurations.selectors';
import { failureMock } from 'src/app/shared/common.mock';

const inputConfigurationsMock: InputConfiguration[] =
    [{
        id: "id",
        name: "name",
        description: "description"
    }];

describe('Selectors', () => {

    it('getInputConfigs', () => {
        // WHEN
        const state = {
            inputConfigs: {
                ...initialState,
                inputConfigurations: inputConfigurationsMock
            }
        };

        // THEN
        expect(getInputConfigs(state)).toEqual(inputConfigurationsMock);
    });

    it('getInputConfigsTotalCount', () => {
        // GIVEN

        // WHEN
        const state = {
            inputConfigs: {
                ...initialState,
                totalCount: 1
            }
        };

        // THEN
        expect(getInputConfigsTotalCount(state)).toEqual(1);
    });

    it('getInputConfigsLoading', () => {
        // WHEN
        const state = {
            inputConfigs: {
                ...initialState,
                loading: true
            }
        };

        // THEN
        expect(getInputConfigsLoading(state)).toEqual(true);
    });

    it('getInputConfigsFailure', () => {
        // WHEN
        const state = {
            inputConfigs: {
                ...initialState,
                failure: failureMock
            }
        };

        // THEN
        expect(getInputConfigsFailure(state)).toEqual(failureMock);
    });
});
