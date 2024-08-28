import { addQueryParamsToUrl } from "./query-utils";

describe('addQueryParamsToUrl', () => {
  it('should add query parameters to the URL', () => {
    //GIVEN
    const url = 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs';
    const query = { limit: 10, offset: 20 };

    //WHEN
    const result = addQueryParamsToUrl(url, query);

    //THEN
    expect(result).toBe('http://localhost:4200/discovery-and-reconciliation/v1/feature-packs?limit=10&offset=20');
  });

  it('should handle an empty query object', () => {
    //GIVEN
    const url = 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs';
    const query = {};

    //WHEN
    const result = addQueryParamsToUrl(url, query);

    //THEN
    expect(result).toBe('http://localhost:4200/discovery-and-reconciliation/v1/feature-packs');
  });

  it('should handle a query object with null and undefined values', () => {
    //GIVEN
    const url = 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs';
    const query = { limit: 10, offset: null, sort: undefined };

    //WHEN
    const result = addQueryParamsToUrl(url, query);

    //THEN
    expect(result).toBe('http://localhost:4200/discovery-and-reconciliation/v1/feature-packs?limit=10');
  });

  it('should handle a query object with params', () => {
    //GIVEN
    const url = 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs';
    const query = { limit: 10, offset: '', sort: '+name' };

    //WHEN
    const result = addQueryParamsToUrl(url, query);

    //THEN
    expect(result).toBe('http://localhost:4200/discovery-and-reconciliation/v1/feature-packs?limit=10&sort=+name');
  });
});
