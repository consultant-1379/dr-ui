/**
 * Replace response with this response when want fake server to generate error
 *
 * e.g paste : throwAnErrorToUI(res, 500, 'DR-A-001', "my error message");
 * or throwAnErrorToUI(res, 500) in place of passing back the
 * responses below
 *
 * @param {*} response            error response
 * @param {*} statusCode          status code
 * @param {*} errorCode           key code in dictionary
 * @param {*} errorMessage        D&R Server will be passing localized message (not UI)
 */
const throwAnErrorToUI = (response, statusCode, errorCode, errorMessage) => {

  if (! errorCode) {
    errorCode = 'DR-A-001';
    errorMessage = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sagittis bibendum ultrices. Aliquam commodo ullamcorper tellus.\nMauris ac hendrerit purus. Pellentesque erat elit, facilisis ac posuere in, elementum at mi. Vivamus at aliquam libero.\rDuis vel arcu fringilla, facilisis odio sed, gravida libero. Donec arcu diam, finibus vel congue eu, blandit et libero. '
  }
  const exception = {
      httpStatusCode: statusCode,
      errorCode,
      errorMessage,
  };

  response.setHeader('Content-Type', 'application/json');
  console.log("ErrorGenerator sends: " + JSON.stringify(exception));
  response.status(statusCode).send(JSON.stringify(exception));
};

module.exports.throwAnErrorToUI = throwAnErrorToUI;