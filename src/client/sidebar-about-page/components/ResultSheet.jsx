class ResultSheet {
  constructor(sheetName) {
    // Placeholder for sheet initialization
    this.sheetName = sheetName;
    this.setHeaders();
  }

  setHeaders() {
    throw new Error('Exception: Not implemented');
  }

  insertData(responses, inputReferences) {
    throw new Error('Exception: Not implemented');
  }

  getStatusValue(proposal) {
    let result = 'Unknown';

    switch (proposal) {
      case 'valid':
        result = '👍 Valid';
        break;

      case 'invalidWithCorrection':
        result = '🦊 Corrected';
        break;

      case 'invalidWithSuggestion':
        result = '👉 Invalid with suggestion';
        break;

      case 'invalid':
        result = '👎 Invalid';
        break;
    }

    return result;
  }

  getErrorValue(response) {
    const isValid = response.getResult('response.result.isValid');
    const proposal = response.getResult('response.result.proposal');

    if (isValid === false && proposal === 'invalid') {
      return 'Number does not exist.';
    }

    if (proposal === 'valid') {
      return 'No errors - number concatenated';
    }

    if (
      proposal === 'invalidWithCorrection' ||
      proposal === 'invalidWithCorrectionWithSuggestion'
    ) {
      const correctedErrors = response.getResult(
        'response.resultCorrected.errors'
      );
      if (correctedErrors && correctedErrors.length > 0) {
        const error = response.findErrorWithHighestSeverity(correctedErrors);
        if (error) {
          const severity = error.severity?.toUpperCase() ?? 'N/A';
          const description = error.description ?? 'N/A';
          return `${severity} - ${description}`;
        }
      }
      return 'No errors - number corrected';
    }

    if (proposal === 'invalid') {
      const resultErrors = response.getResult('response.result.errors');
      if (!Array.isArray(resultErrors)) {
        return resultErrors;
      }

      const error = response.findErrorWithHighestSeverity(resultErrors);
      if (!error) {
        return 'N/A';
      }

      const severity = error.severity?.toUpperCase() ?? 'N/A';
      const description = error.description ?? 'N/A';

      return `${severity} - ${description}`;
    }

    return 'N/A';
  }

  getSuggestionValue(response) {
    const proposal = response.getResult('response.result.proposal');

    if (
      proposal === 'invalidWithSuggestion' ||
      proposal === 'invalidWithCorrectionWithSuggestion'
    ) {
      const suggestion = response.getFirstSuggestion();
      if (suggestion) {
        const type = response.getType();
        const suggestionValue = suggestion.data[type] ?? 'N/A';
        return `Suggestion: ${suggestionValue}`;
      }
    }

    return 'N/A';
  }
}

export default ResultSheet;
