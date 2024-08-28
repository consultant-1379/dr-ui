import { validationConstants } from "../constants/app.constants";

/**
 * Basic XSS attack validation for safe input
 * (though angular itself can sanitize input)
 * @param value  input value
 * @returns
 */
export function validateSafeInput(value: string): boolean {
  return value?.match(validationConstants.safeStringPattern) !== null;
}

/**
 * Basic cron validation.
 *
 * This can not be a full validation - server will have to throw an error if it is not valid
 * (3pp cron-parser is unix cron not spring cron and it not available to use here)
 *
 * Ensure that any spring cron expression will pass this validation
 *
 * @param value  cron expression
 * @returns error message key from dictionary can see issue with cron expression
 */
export function getCronErrorMessage(value: string): string {

  /* best to do all here (including safe input) to avoid possibility of
     2 error messages been shown over-lapping each other */

  if (!value) {
    return 'createSchedule.CRON_EXPRESSION_REQUIRED';
  }

  if (!validateSafeInput(value)) {
    return 'createSchedule.INVALID_CRON_XSS';
  }

  if (value.match(validationConstants.springCronSpacingPattern) === null) {
    return 'createSchedule.INVALID_CRON_NOT_SIX_FIELDS';
  }

  return '';
}
