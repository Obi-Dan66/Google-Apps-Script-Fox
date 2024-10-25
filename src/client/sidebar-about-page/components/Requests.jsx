import axios from 'axios';

class Request {
  /**
   * Constructs a Request object.
   *
   * @param {string} endpoint - The API endpoint.
   * @param {object} additionalHeaders - {Optional} Additional headers for the request.
   */
  constructor(endpoint, additionalHeaders = {}) {
    this.apiKey = localStorage.getItem('API_KEY'); // Retrieve the API key from local storage
    this.apiUrl = 'https://api.foxentry.com/';
    this.endpoint = endpoint;
    this.requestUrl = this.apiUrl + this.endpoint;
    this.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Bearer ' + this.apiKey,
      'Foxentry-Include-Request-Details': true,
      ...additionalHeaders,
    };
    this.queryQueue = [];
  }

  /**
   * Sends a request to the API.
   *
   * @param {string} query - The query for the request.
   * @param {object} options - Options for the request.
   * @return {Promise<string>} - The response data or error message.
   */
  async send(query, options) {
    try {
      // Check if the API key is set
      if (!this.apiKey) {
        throw new Error(
          'API key not set. Set the API key under the extension menu.'
        );
      }

      // Build the payload
      const payload = this.buildBody(query, options);

      // Make the request and get the response
      const response = await axios.post(this.requestUrl, payload, {
        headers: this.headers,
      });

      // Get and return the response data
      return response.data;
    } catch (error) {
      return error.message; // Return the error message
    }
  }

  getQueue() {
    return this.queryQueue;
  }

  addToQueue(query, options) {
    const payload = JSON.stringify(this.buildBody(query, options));
    const q = {
      url: this.requestUrl,
      headers: this.headers,
      data: payload,
    };

    this.queryQueue.push(q);
  }

  async sendQueue() {
    try {
      // Check if the API key is set
      if (!this.apiKey) {
        throw new Error(
          'API key not set. Set the API key under the extension menu.'
        );
      }

      const requests = this.queryQueue;
      const responses = [];

      // Send requests in chunks to avoid hitting API limits
      let temp = requests;
      while (temp.length > 0) {
        const chunk = temp.slice(0, 100); // Get first n elems
        const res = await Promise.all(
          chunk.map((req) =>
            axios.post(req.url, req.data, { headers: req.headers })
          )
        );
        responses.push(...res.map((r) => r.data));
        temp = temp.slice(100); // Remove first n elems
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Sleep for 1 second
      }

      this.queryQueue = []; // Empty the requests queue
      return responses;
    } catch (error) {
      alert(error.message); // Show error message
      return;
    }
  }

  reloadValue(cell) {
    try {
      const displayValue = cell.getDisplayValue();
      if (
        displayValue[0] === '{' &&
        displayValue[displayValue.length - 1] === '}' &&
        displayValue.length >= 5
      ) {
        const res = JSON.parse(displayValue);
        if (res.status && res.status === 200) {
          return JSON.stringify(res);
        }
      }
    } catch (error) {
      return false;
    }

    return false;
  }

  /**
   * Builds the request body.
   *
   * @param {string} query - The query for the request.
   * @param {object} options - Options for the request.
   * @return {object} - The request body.
   */
  buildBody(query, options) {
    return {
      request: {
        query,
        options,
      },
    };
  }
}

export default Request;
