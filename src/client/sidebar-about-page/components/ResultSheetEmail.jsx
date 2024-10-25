import ResultSheet from './ResultSheet';
import Response from './Response';

class ResultSheetEmail extends ResultSheet {
  setHeaders() {
    const headers = [
      'E-mail',
      'Corrected',
      'Suggestion',
      'Status',
      'Freemail',
      'Disposable',
      'Catch all',
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
        const arr = [];
        const jsonRes = res;

        res = new Response(res);

        if (res.data.status === 200) {
          // Corrected
          arr[0] = res.getProperty('response.resultCorrected.data.email');

          // Suggestion
          arr[1] = this.getSuggestionValue(res);

          // Status
          arr[2] = this.getStatusValue(
            res.getProperty('response.result.proposal')
          );

          // Freemail
          arr[3] = res.getProperty('response.result.flags.isFreemail');

          // Disposable
          arr[4] = res.getProperty(
            'response.result.flags.isDisposableEmailAddress'
          );

          // Catch all
          arr[5] = res.getProperty('response.result.flags.isCatchAllServer');
        }

        // Error
        arr[6] = this.getErrorValue(res);

        // JSON response
        arr[7] = jsonRes;

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
}

export default ResultSheetEmail;
