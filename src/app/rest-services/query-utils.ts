// change e.g. URL and {limit:10,offset:20} into 'URL?limit=10&offset=20'
export function addQueryParamsToUrl(url: string, query: object) {
  const queryStr = Object.keys(query)
    .filter(key => hasValue(query[key]))
    .map(key => `${key}=${query[key].toString()}`).join('&');
  return url + ((queryStr) ? `?${queryStr}` : '');
}

function hasValue(value: any) {
  return value !== '' && value !== null && value !== undefined;
}