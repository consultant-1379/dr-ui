import { ErrorType, Failure } from '@erad/core';
import { Action } from '@ngrx/store';

export const sampleResponseMock = {
  response: 'value'
};

export const actionTypeMock = 'actionTypeMock';
export const responseKeyMock = 'responseKey';
export const failureCustomKeyMock = 'failureCustomKey';
export const notificationDescriptionMock = 'notification description';
export const failureMock: Failure = {
  type: ErrorType.BackEnd,
  message: notificationDescriptionMock
};

export class ActionMock implements Action {
  readonly type = actionTypeMock;

  constructor(public payload: {
    [responseKeyMock]?: any;
    [failureCustomKeyMock]?: Failure;
    failure?: Failure;
  }) { }
}
