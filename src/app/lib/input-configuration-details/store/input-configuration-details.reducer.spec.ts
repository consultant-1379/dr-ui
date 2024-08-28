import { LoadInputConfigDetails, LoadInputConfigDetailsFailure, LoadInputConfigDetailsSuccess } from "./input-configuration-details.actions";
import { initialState, inputConfigDetailsReducer } from "./input-configuration-details.reducer";

import { InputConfigurationDetails } from "src/app/models/input-configuration-details.model";
import { failureMock } from "../../../shared/common.mock";

const responseMock: InputConfigurationDetails = {
    id: "897652",
    name: "TestName",
    description: "Test description",
    inputs: [{
        name: 'inputTestName',
        value: false,
        pickList: [false]
    }]
};

const featureMockId = '1234';
const configurationMockId = '6578';

describe('inputConfigDetails Reducer', () => {

    describe('an unknown action', () => {

        it('should return the previous state', () => {
            const action = {} as any;
            const result = inputConfigDetailsReducer(initialState, action);

            expect(result).toBe(initialState);
        });
    });

    describe('an unknown state', () => {

        it('should return the initial state', () => {
          const action = {} as any;
          const result = inputConfigDetailsReducer(undefined, action);

          expect(result).toBe(initialState);
        });
    });

    describe('inputConfigDetails reducer', () => {
        describe('LoadInputConfigDetails action', () => {
            it('should set loading to true, failure to null and inputConfigurations to null', () => {
                // GIVEN
                const action = new LoadInputConfigDetails({ featureId: featureMockId, configurationId: configurationMockId });

                // WHEN
                const result = inputConfigDetailsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(null);
                expect(result.inputConfig).toBe(null);
            });
        });

        describe('LoadInputConfigDetailsSuccess action', () => {
            it('should set loading to false, failure to null and inputConfigurations to items', () => {
                // GIVEN
                const action = new LoadInputConfigDetailsSuccess({ response: responseMock });

                // WHEN
                const result = inputConfigDetailsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(null);
                expect(result.inputConfig).toBe(responseMock);
            });
        });

        describe('LoadInputConfigDetailsFailure action', () => {
            it('should set loading to false, failure to failure and inputConfigurations to null', () => {
                // GIVEN
                const action = new LoadInputConfigDetailsFailure({ failure: failureMock });

                // WHEN
                const result = inputConfigDetailsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(failureMock);
                expect(result.inputConfig).toBe(null);
                expect(result.loading).toBe(false);
            });
        });
    });
});
