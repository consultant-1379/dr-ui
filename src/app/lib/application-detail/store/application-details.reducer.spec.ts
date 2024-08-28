import { ApplicationDetailsState, applicationDetailsReducer, initialState } from './application-details.reducer'
import {
  ClearFailureState,
  LoadApplicationDetails,
  LoadApplicationDetailsFailure,
  LoadApplicationDetailsSuccess,
} from './application-details.actions';

import { Application } from "src/app/models/application.model";
import { failureMock } from "../../../shared/common.mock";

const responseMock : Application = {
  id: "id",
  name: "name",
  description: "description",
  jobs: undefined
};

const mockFpId = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const mockAppId = 'ab54cb71-5444-59bs-247f-b8288be8c78e';

describe('Applications Reducer', () => {

    describe('an unknown action', () => {

        it('should return the previous state', () => {
            const action = {} as any;
            const result = applicationDetailsReducer(initialState, action);
            expect(result).toBe(initialState);
        });
    });

    describe('an unknown state', () => {

      it('should return the initial state', () => {
        const action = {} as any;
        const result = applicationDetailsReducer(undefined, action);

        expect(result).toBe(initialState);
      });
    });

    describe('ApplicationDetails reducer', () => {
        describe('LoadApplicationDetails action', () => {
            it('should set loading to true, failure to null and application to null', () => {
                // GIVEN
                const action = new LoadApplicationDetails({ featureId: mockFpId, appId: mockAppId });

                // WHEN
                const result = applicationDetailsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(null);
                expect(result.application).toBe(null);
            });
        });

        describe('LoadApplicationDetailsSuccess action', () => {
            it('should set loading to false, failure to null and application to result', () => {
                // GIVEN
                const action = new LoadApplicationDetailsSuccess({ response: responseMock });

                // WHEN
                const result = applicationDetailsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(null);
                expect(result.application).toBe(responseMock);
            });
        });

        describe('LoadApplicationDetailsFailure action', () => {
            it('should set loading to false, failure to failure and application to null', () => {
                // GIVEN
                const action = new LoadApplicationDetailsFailure({ failure: failureMock });

                // WHEN
                const result = applicationDetailsReducer(initialState, action);

                // THEN
                expect(result.failure).toBe(failureMock);
                expect(result.application).toBe(null);
                expect(result.loading).toBe(false);
            });
        });

        describe('ClearFailureState action', () => {
          it('should set failure to null', () => {
            const failureState: ApplicationDetailsState = {
              failure: failureMock,
              application: null,
              loading: false,
            }
            // GIVEN
            const action = new ClearFailureState();

            // WHEN
            const result = applicationDetailsReducer(failureState, action);

            // THEN
            expect(result.failure).toBe(null);
          });
        });
      });
    });