import Response from './Response';

/**
 * Gets the corrected data from the response.
 *
 * @param {Object} response - The response object.
 * @return {*} - Corrected data
 */
export function getCorrected(response) {
  const responseObj = new Response(response);
  const type = responseObj.getType();
  let selector = `response.resultCorrected.data.${type}`;

  switch (type) {
    case 'phone':
      selector = 'response.resultCorrected.data.numberWithPrefix';
      break;
    // Add more cases if needed
  }

  return responseObj.getResult(selector);
}

/**
 * Checks if the response contains valid data.
 *
 * @param {Object} response - The response object.
 * @param {string} source - Which part of response to get the value from [Allowed values: result, resultCorrected, suggestion]
 * @return {boolean|string} - Whether the data is valid or "N/A" for suggestions.
 */
export function isValid(response, source = 'result') {
  const responseObj = new Response(response);

  switch (source) {
    case 'suggestion': {
      const suggestion = responseObj.getFirstSuggestion();
      return suggestion ? suggestion.isValid : 'N/A';
    }
    // Add additional cases for other sources if needed in the future.
  }

  return responseObj.getResult(`response.${source}.isValid`);
}

/**
 * Gets the proposal from the response.
 *
 * @param {Object} response - The response object.
 * @return {*} - The proposal from the response.
 */
export function getProposal(response) {
  const responseObj = new Response(response);
  return responseObj.getResult('response.result.proposal');
}

/**
 * Gets the error message from the response or indicates if there's no error.
 *
 * @param {Object} response - The response object.
 * @return {string} - The error message or 'N/A' if there's no error.
 */
export function getError(response) {
  const responseObj = new Response(response);
  const result = responseObj.getResult('response.result.errors');

  if (!Array.isArray(result)) return result;

  const error = responseObj.findErrorWithHighestSeverity(result);

  if (!error) return 'N/A';

  const severity = error.severity?.toUpperCase() ?? 'N/A';
  const description = error.description ?? 'N/A';

  return `${severity} - ${description}`;
}

/**
 * Gets the first suggestion from the response.
 *
 * @param {Object} response - The response object.
 * @return {string} - The suggestion data or 'N/A' if no suggestions are available.
 */
export function getSuggestion(response) {
  const responseObj = new Response(response);
  const type = responseObj.getType();
  const result = responseObj.getResult('response.suggestions');

  if (!result || result.length <= 0) {
    return 'N/A';
  }

  const suggestion = responseObj.getFirstSuggestion();
  return suggestion.data[type] ?? 'N/A';
}
