import { getCronErrorMessage, validateSafeInput } from './validator.utils';

describe('ValidatorUtils', () => {



  describe('validateSafeInput', () => {

    it('should verify if string is safe against XSS attack ', () => {
      const isValid = validateSafeInput("hello world");
      expect(isValid).toEqual(true);
    });

    it('should not allow <>', () => {
      const isValid = validateSafeInput("<script>");
      expect(isValid).toEqual(false);
    });

    it('should not allow &', () => {
      const isValid = validateSafeInput("&lt;script&gt;");
      expect(isValid).toEqual(false);
    });

    it('should be valid if value is not defined ', () => {
      const isValid = validateSafeInput(null);
      expect(isValid).toEqual(true);
    });

  });

  describe('getCronErrorMessage', () => {

    it('should verify string exists ', () => {
      const message = getCronErrorMessage(null);
      expect(message).toEqual("createSchedule.CRON_EXPRESSION_REQUIRED");
    });

    it('should verify if string is safe against XSS attack ', () => {
      const message = getCronErrorMessage("<script>");
      expect(message).toEqual("createSchedule.INVALID_CRON_XSS");
    });

    it('should ensure expression has 6 fields separated by a single space', () => {
      const message = getCronErrorMessage("hello world");
      expect(message).toEqual('createSchedule.INVALID_CRON_NOT_SIX_FIELDS');
    });

    it('should allow valid spring cron expressions (have no error message)', () => {
      const message = getCronErrorMessage("0 0 * * * *");
      expect(!!message).toEqual(false);
    });

    it('should allow valid spring cron expressions (have no error message) 1', () => {
      const message = getCronErrorMessage("*/10 * * * * *");
      expect(!!message).toEqual(false);
    });

    it('should allow valid spring cron expressions (have no error message) 2', () => {
      const message = getCronErrorMessage("0 0 8-10 * * *");
      expect(!!message).toEqual(false);
    });

    it('should allow valid spring cron expressions (have no error message) 3', () => {
      const message = getCronErrorMessage("0 0 6,19 * * *");
      expect(!!message).toEqual(false);
    });

    it('should allow valid spring cron expressions (have no error message) 4', () => {
      const message = getCronErrorMessage("0 0/30 8-10 * * *");
      expect(!!message).toEqual(false);
    });

    it('should allow valid spring cron expressions (have no error message) 5', () => {
      const message = getCronErrorMessage("0 0 9-17 * * MON-FRI");
      expect(!!message).toEqual(false);
    });

    it('should allow valid spring cron expressions (have no error message) 6', () => {
      const message = getCronErrorMessage("0 0 0 25 12 ?");
      expect(!!message).toEqual(false);
    });
  });

});

