import { isJson, parseJson, stringifyJson } from "./json.utils";

const jsonStringMock = '{"key": "testValue"}';

const expectedJsonString = `{
    "key": "testValue"
}`;

describe('parseJson', () => {
  it('should parse valid JSON strings', () => {

    //WHEN
    const result = parseJson(jsonStringMock);

    //THEN
    expect(result).toEqual({ key: 'testValue' });
  });

  it('should return false for invalid JSON strings', () => {

    //GIVEN
    const invalidStr = 'invalid JSON';

    //WHEN
    const result = parseJson(invalidStr);

    //THEN
    expect(result).toBe(false);
  });

  it('should return false for non-string input', () => {

    //GIVEN
    const nonString = 1;

    //WHEN
    const result = parseJson(nonString);

    //THEN
    expect(result).toBe(false);
  });

  it('should return the input if it is an object', () => {

    //GIVEn
    const input = { key: 'testValue' };

    //WHEN
    const result = parseJson(input);

    //THEN
    expect(result).toBe(input);
  });
});

describe('isJson', () => {
  it('should return true for valid JSON strings', () => {

    //WHEN
    const result = isJson(jsonStringMock);

    //THEN
    expect(result).toBe(true);
  });

  it('should return false for invalid JSON strings', () => {

    //GIVEN
    const invalidJsonStr = 'invalid JSON';

    //WHEN
    const result = isJson(invalidJsonStr);

    //THEN
    expect(result).toBe(false);
  });

  it('should return false for non-string input', () => {

    //GIVEN
    const nonStringMock = 1;

    //WHEN
    const result = isJson(nonStringMock);

    //THEN
    expect(result).toBe(false);
  });

  it('should return false for null input', () => {

    //WHEN
    const result = isJson(null);

    //THEN
    expect(result).toBe(false);
  });
});

describe('stringifyJson', () => {
  it('should stringify JSON objects', () => {

    //GIVEN
    const jsonObj = { key: 'testValue' };

    //WHEN
    const result = stringifyJson(jsonObj);

    //THEN
    expect(result).toEqual(expectedJsonString);
  });

  it('should handle the gap parameter', () => {

    //GIVEN
    const jsonObj = { key: 'testValue' };
    const gapMock = 2;

    //WHEN
    const result = stringifyJson(jsonObj, gapMock);

    //THEN
    expect(result).toEqual('{\n  "key": "testValue"\n}');
  });

  it('should return an empty string for null', () => {

    //WHEN
    const result = stringifyJson(null);

    //THEN
    expect(result).toBe('');
  });
});
