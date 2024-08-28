import { ErrorType } from './enums/error-type.enum';

/**
 * Wrapping server error response
 * (not to be confused with the erad/core "Failure" model)
 */
export interface DnrFailure {
  type: ErrorType;
  errorCode?: string;
  errorMessage?: string;
}
