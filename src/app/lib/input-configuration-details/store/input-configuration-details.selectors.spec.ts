
import { InputConfigurationDetails } from 'src/app/models/input-configuration-details.model';
import { initialState } from './input-configuration-details.reducer';
import { getInputConfigDetails, getInputConfigDetailsFailure, getInputConfigDetailsLoading } from './input-configuration-details.selectors';
import { failureMock } from 'src/app/shared/common.mock';


const inputConfigurationsDetailsMock: InputConfigurationDetails = {
    id: "897652",
    name: "TestName",
    description: "Test description",
    inputs: [{
        name: 'inputTestName',
        value: true,
        pickList: [true]
    }]
};

describe('Selectors', () => {

    it('getInputConfigDetails', () => {
        // WHEN
        const state = {
            inputConfigDetails: {
                ...initialState,
                inputConfig: inputConfigurationsDetailsMock
            }
        };

        // THEN
        expect(getInputConfigDetails(state)).toEqual(inputConfigurationsDetailsMock);
    });

    it('getInputConfigDetailsLoading', () => {
        // WHEN
        const state = {
            inputConfigDetails: {
                ...initialState,
                loading: true
            }
        };

        // THEN
        expect(getInputConfigDetailsLoading(state)).toEqual(true);
    });

    it('getInputConfigDetailsFailure', () => {
        // WHEN
        const state = {
            inputConfigDetails: {
                ...initialState,
                failure: failureMock
            }
        };

        // THEN
        expect(getInputConfigDetailsFailure(state)).toEqual(state.inputConfigDetails.failure);
    });
});
