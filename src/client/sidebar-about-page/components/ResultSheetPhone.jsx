import ResultSheet from './ResultSheet';
import Response from './Response';

class ResultSheetPhone extends ResultSheet {
  setHeaders() {
    const headers = [
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

  insertData(responses, inputReferences) {
    const result = [];

    try {
      if (responses.length <= 0) {
        alert('No data to process');
        return;
      }

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
          // ["Phone", "Corrected", "Formatted", "Suggestion", "Status", "Error", "API Response"]
          arr[1] = numberToFormat; // Corrected
          arr[2] = this.getFormattedNumber(res); // Formatted
          arr[3] = this.getSuggestionValue(res); // Suggestion
          arr[4] = this.getStatusValue(
            res.getProperty('response.result.proposal')
          ); // Status
        }

        arr[5] = this.getErrorValue(res); // Error
        arr[6] = jsonRes; // API Response

        result.push(arr);
      });

      // Assuming a method to handle inserting data in a generic way
      this.insertSheetData(result, inputReferences);
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

  insertSheetData(data, inputReferences) {
    console.log('Inserting data:', data);
    console.log('Input references:', inputReferences);
    // Implement logic to handle data insertion in your environment
  }

  getFormattedNumber(response) {
    // Implement logic to format the number based on your requirements
    return 'Formatted Number'; // Placeholder
  }
}

export default ResultSheetPhone;
