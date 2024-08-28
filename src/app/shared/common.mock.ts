import { ErrorType, Failure } from '@erad/utils';

export const errorMock = { message: 'Some error' };
export const failureMock: Failure = {
  type: ErrorType.BackEnd,
  message: 'Some error'
};
export const defaultFailure: Failure = {
  type: ErrorType.FrontEnd,
  message: 'messages.NO_INFO_AVAILABLE'
};
export const loadingMock = true;
