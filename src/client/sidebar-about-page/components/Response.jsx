class Response {
  /**
   * Constructs a Response object.
   *
   * @param {Object|string} data - The response data object or JSON string.
   */
  constructor(data) {
    // If data is a JSON string, parse it
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    this.data = data;
  }

  /**
   * Retrieves the response data.
   *
   * @return {Object} - The response data.
   */
  getData() {
    return this.data;
  }

  /**
   * Retrieves the type of the response.
   *
   * @return {string} - The type of the response.
   * @throws {Error} - Throws an error if the type cannot be recognized.
   */
  getType() {
    const endpoint = this.data.request.endpoint;

    if (!endpoint) {
      throw new Error('Error recognizing request type');
    }

    const index = endpoint.indexOf('/');
    if (index === -1) {
      throw new Error("Response type wasn't recognized");
    }

    const type = endpoint.substring(0, index);
    return type;
  }

  /**
   * Retrieves a specific property from the response data using a selector.
   *
   * @param {string} path - The selector for the desired property.
   * @return {*} - The selected property value or 'N/A' if not found.
   */
  getProperty(path) {
    try {
      return path
        .split('.')
        .reduce(
          (obj, key) => (obj && typeof obj === 'object' ? obj[key] : null),
          this.data
        );
    } catch (e) {
      return null;
    }
  }

  /**
   * Retrieves a result using a selector (an alias for getProperty).
   *
   * @param {string} selector - The selector for the desired result.
   * @return {*} - The result value based on the selector.
   */
  getResult(selector) {
    return this.getProperty(selector);
  }

  /**
   * Finds the error object with the highest severity from an array of errors.
   *
   * @param {Object[]} array - Array of error objects.
   * @return {Object|null} - Error object with the highest severity or null if not found.
   */
  findErrorWithHighestSeverity(array) {
    if (!Array.isArray(array)) return null;

    const critical = array.find((obj) => obj?.severity === 'critical');
    const warning = array.find((obj) => obj?.severity === 'warning');
    const info = array.find((obj) => obj?.severity === 'info');

    return critical || warning || info || null;
  }

  /**
   * Retrieves the first suggestion from the response.
   *
   * @return {Object|null} - The first suggestion object or null if no suggestions are found.
   */
  getFirstSuggestion() {
    const suggestions = this.getProperty('response.suggestions');
    return Array.isArray(suggestions) && suggestions.length > 0
      ? suggestions[0]
      : null;
  }
}

export default Response;
