const JSON_STRING_GAP = 4;

/**
 * Returns a JSON object if the input string is json, otherwise returns false.
 * @param {*} input
 * @returns json string or false if not string.
 */
export function parseJson(input: any) {
  if (typeof input === 'object') {
    return input;
  }
  try {
    const o = JSON.parse(input);
    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {
    /* not interested in showing */
  }
  return false;
}

/**
 * Checks whether string is valid JSON.
 * @param {*} input
 * @returns true or false depending on whether string is json.
 */
export function isJson(input : any) : boolean {
  if (input === null) {
    return false;
  }
  if (typeof input === 'object') {
    return true;
  }
  return typeof parseJson(input) === 'object';
}

/**
 * Convert json to string.
 * @returns String
 */
export function stringifyJson(obj: any, gap = JSON_STRING_GAP) {
  if (isJson(obj)) {
    return JSON.stringify(obj, null, gap);
  }
  return obj || '';
}

