import { ClearFailureState, LoadInputConfigs, LoadInputConfigsFailure, LoadInputConfigsSuccess } from "./input-configurations.actions";
import { InputConfigsReducer, initialState } from "./input-configurations.reducer";

import { InputConfigurationsItemsResponses } from "src/app/models/input-configurations-items-response.model";
import { failureMock } from "../../../shared/common.mock";

const responseMock: InputConfigurationsItemsResponses = {
    items: [{
        id: "id",
        name: "name",
        description: "description"
    }],
    totalCount: 1
};

const mockId = 'c96fd466-1052-4ab3-be2d-9c172d9fe511';

describe('InputConfigs Reducer', () => {

    describe('an unknown action', () => {

        it('should return the previous state', () => {
            const action = {} as any;
            const result = InputConfigsReducer(initialState, action);

            expect(result).toBe(initialState);
        });
    });

    describe('an unknown state', () => {

        it('should return the initial state', () => {
            const action = {} as any;
            const result = InputConfigsReducer(undefined, action);

            expect(result).toBe(initialState);
        });
    });

    describe('InputConfigs reducer', () => {
        describe('LoadInputConfigs action', () => {
            it('should set loading to true, failure to null and inputConfigurations to null', () => {
                // GIVEN
                const action = new LoadInputConfigs({ query: undefined, id: mockId });

                // WHEN
                const result = InputConfigsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(null);
                expect(result.inputConfigurations).toBe(null);
            });
        });

        describe('LoadInputConfigsSuccess action', () => {
            it('should set loading to false, failure to null and inputConfigurations to items', () => {
                // GIVEN
                const action = new LoadInputConfigsSuccess({ response: responseMock });

                // WHEN
                const result = InputConfigsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(null);
                expect(result.inputConfigurations).toBe(responseMock.items);
            });
        });

        describe('LoadInputConfigsFailure action', () => {
            it('should set loading to false, failure to failure and inputConfigurations to null', () => {
                // GIVEN
                const action = new LoadInputConfigsFailure({ failure: failureMock });

                // WHEN
                const result = InputConfigsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(failureMock);
                expect(result.inputConfigurations).toBe(null);
                expect(result.loading).toBe(false);
            });
        });

        describe('ClearFailureState action', () => {
            it('should set failure to failure to null', () => {
                // GIVEN
                const action = new ClearFailureState();

                // WHEN
                const result = InputConfigsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(null);
            });
        });
    });
});
