
import { DiscoveredObjectsItemsResponse } from 'src/app/models/discovered-objects-items-response.model';
import { ActionFilterStatus } from 'src/app/models/enums/action-filter-status.enum';
import { DiscoveredObjectsStatus } from 'src/app/models/enums/discovered-objects-status.enum';
import { initialState } from './discovered-objects.reducer';
import { getDiscoveredObjects, getDiscoveredObjectsFailure, getDiscoveredObjectsLoading, getDiscoveredObjectsTotalCount } from './discovered-objects.selectors';
import { failureMock } from 'src/app/shared/common.mock';

const discoveredObjectsMock: DiscoveredObjectsItemsResponse = {
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

describe('Selectors', () => {

    it('getDiscoveredObjects', () => {
        // WHEN
        const state = {
            discoveredObjects: {
                ...initialState,
                discoveredObjects: discoveredObjectsMock.items
            }
        };

        // THEN
        expect(getDiscoveredObjects(state)).toEqual(discoveredObjectsMock.items);
    });

    it('getDiscoveredObjectsTotalCount', () => {
        // GIVEN

        // WHEN
        const state = {
            discoveredObjects: {
                ...initialState,
                totalCount: 1
            }
        };

        // THEN
        expect(getDiscoveredObjectsTotalCount(state)).toEqual(1);
    });

    it('getDiscoveredObjectsLoading', () => {
        // WHEN
        const state = {
            discoveredObjects: {
                ...initialState,
                loading: true
            }
        };

        // THEN
        expect(getDiscoveredObjectsLoading(state)).toEqual(true);
    });

    it('getDiscoveredObjectsFailure', () => {
        // WHEN
        const state = {
            discoveredObjects: {
                ...initialState,
                failure: failureMock
            }
        };

        // THEN
        expect(getDiscoveredObjectsFailure(state)).toEqual(state.discoveredObjects.failure);
    });
});
