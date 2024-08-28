import { ClearFailureState, LoadDiscoveredObjects, LoadDiscoveredObjectsFailure, LoadDiscoveredObjectsSuccess } from "./discovered-objects.actions";
import { discoveredObjectsReducer, initialState } from "./discovered-objects.reducer";

import { ActionFilterStatus } from "src/app/models/enums/action-filter-status.enum";
import { DiscoveredObjectsItemsResponse } from "src/app/models/discovered-objects-items-response.model";
import { DiscoveredObjectsStatus } from "src/app/models/enums/discovered-objects-status.enum";
import { QueryParams } from "src/app/models/query.params.model";
import { failureMock } from "../../../shared/common.mock";

const mockId = '12345';

const responseMock: DiscoveredObjectsItemsResponse = {
    items: [
        {
            objectId: '1',
            discrepancies: [
                'Missing in ecm'
            ],
            properties: {
                flavorName: 'ECM_CORE',
                ephemeralDiskSize: '0',
                diskSize: '64',
                isPublic: 'false',
                numberOfCPU: '4',
                ramMemorySize: '12288',
                assignedObjectId: '1',
                receivedTransmitFactor: '1.0'
            },
            filters: [
                {
                    name: 'filter one',
                    reconcileAction: {
                        status: ActionFilterStatus.FAILED,
                        command: 'Method: POST',
                        commandOutput: 'command output message',
                        errorMessage: 'DR-20:Execution step.'
                    }
                }
            ],
            errorMessage: '',
            status: DiscoveredObjectsStatus.RECONCILED
        }
    ],
    totalCount: 50
}

const queryParams: QueryParams = {
    offset: 10,
    limit: 10,
    sort: 'ASC',
    filters: 'anyString'
  };

describe('discoveredObjectsReducer Reducer', () => {

    describe('an unknown action', () => {

        it('should return the previous state', () => {
            const action = {} as any;
            const result = discoveredObjectsReducer(initialState, action);

            expect(result).toBe(initialState);
        });
    });

    describe('an unknown state', () => {

        it('should return the initial state', () => {
          const action = {} as any;
          const result = discoveredObjectsReducer(undefined, action);

          expect(result).toBe(initialState);
        });
    });

    describe('discoveredObjects reducer', () => {
        describe('LoadDiscoveredObjects action', () => {
            it('should set loading to true, failure to null and discoveredObjects to null', () => {
                // GIVEN
                const action = new LoadDiscoveredObjects({ query: queryParams, id: mockId });

                // WHEN
                const result = discoveredObjectsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(null);
                expect(result.discoveredObjects).toBe(null);
            });
        });

        describe('LoadDiscoveredObjectsSuccess action', () => {
            it('should set loading to false, failure to null and discoveredObjects to items', () => {
                // GIVEN
                const action = new LoadDiscoveredObjectsSuccess({ response: responseMock });

                // WHEN
                const result = discoveredObjectsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(null);
                expect(result.discoveredObjects).toBe(responseMock.items);
            });
        });

        describe('LoadDiscoveredObjectsFailure action', () => {
            it('should set loading to false, failure to failure and discoveredObjects to null', () => {
                // GIVEN
                const action = new LoadDiscoveredObjectsFailure({ failure: failureMock });

                // WHEN
                const result = discoveredObjectsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(failureMock);
                expect(result.discoveredObjects).toBe(null);
                expect(result.loading).toBe(false);
            });
        });

        describe('ClearFailureState action', () => {
            it('should set loading to false, failure to failure and discoveredObjects to null', () => {
                // GIVEN
                const action = new ClearFailureState();

                // WHEN
                const result = discoveredObjectsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(null);
                expect(result.discoveredObjects).toBe(null);
                expect(result.loading).toBe(false);
            });
        });
    });
});
