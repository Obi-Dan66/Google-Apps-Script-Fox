import ResultSheet from './ResultSheet';
import Response from './Response';

class ResultSheetPhonePrefix extends ResultSheet {
  setHeaders() {
    const headers = [
      'Prefix',
      'Phone',
      'Corrected',
      `Formatted (${this.formatOption})`,
      'Suggestion',
      'Status',
      'Error',
      'API Response',
    ];

    // Assuming a method to handle setting headers in a generic way
    this.setSheetHeaders(headers);
  }

  insertData(responses, prefixReferences, inputReferences) {
    const result = [];

    try {
      responses.forEach((res) => {
        const arr = new Array(8);
        const jsonRes = res;

        res = new Response(res);

        if (res.data.status === 200) {
          const proposal = res.getProperty('response.result.proposal');
          let numberToFormat;

          if (proposal === 'valid') {
            numberToFormat = res.getProperty(
              'response.result.data.numberWithPrefix'
            );
          } else if (proposal === 'invalidWithCorrection') {
            numberToFormat = res.getProperty(
              'response.resultCorrected.data.numberWithPrefix'
            );
          } else {
            numberToFormat = '';
          }

          // Match the order from setHeaders:
          // ["Prefix", "Phone", "Corrected", "Formatted", "Suggestion", "Status", "Error", "API Response"]
          arr[2] = numberToFormat; // Corrected
          arr[3] = this.getFormattedNumber(res); // Formatted
          arr[4] = this.getSuggestionValue(res); // Suggestion
          arr[5] = this.getStatusValue(
            res.getProperty('response.result.proposal')
          ); // Status
        }

        arr[6] = this.getErrorValue(res); // Error
        arr[7] = jsonRes; // API Response

        result.push(arr);
      });

      // Assuming a method to handle inserting data in a generic way
      this.insertSheetData(result, prefixReferences, inputReferences);
    } catch (error) {
      alert(error.message);
      return error.message; // Return the error message
    }
  }

  // Placeholder methods for setting headers and inserting data
  setSheetHeaders(headers) {
    console.log('Setting headers:', headers);
    // Implement logic to handle headers in your environment
  }

  insertSheetData(data, prefixReferences, inputReferences) {
    console.log('Inserting data:', data);
    console.log('Prefix references:', prefixReferences);
    console.log('Input references:', inputReferences);
    // Implement logic to handle data insertion in your environment
  }

  getFormattedNumber(response) {
    // Implement logic to format the number based on your requirements
    return 'Formatted Number'; // Placeholder
  }
}

export default ResultSheetPhonePrefix;
