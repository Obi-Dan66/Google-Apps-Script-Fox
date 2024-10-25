import Request from './Request';
import ResultSheetEmail from './ResultSheetEmail';
import ResultSheetPhone from './ResultSheetPhone';
import ResultSheetPhonePrefix from './ResultSheetPhonePrefix';

function showSidebar() {
  // Implement logic to show a sidebar in your React app
  console.log('Showing sidebar');
}

function validate(source, data) {
  const range = [data.range];
  const inputValues = getInputValues(data.range);
  let prefixValues = [];

  if (source === 'phone' && data.prefixRange.length > 0) {
    prefixValues = getInputValues(data.prefixRange);

    if (inputValues.length !== prefixValues.length) {
      alert('Numbers and prefixes count must match!');
      return;
    }

    range.push(data.prefixRange);
  }

  const request = new Request(`${source}/validate`);
  let options = {};
  let queryKey = null;

  switch (source) {
    case 'email':
      queryKey = 'email';
      options = {
        validationType: data.validationType,
        acceptDisposableEmails: data.acceptDisposableEmails,
        acceptFreemails: data.acceptFreemails,
      };
      break;

    case 'phone':
      queryKey = 'numberWithPrefix';
      options = {
        validationType: data.validationType,
        formatNumber: data.formatNumber,
      };
      break;
  }

  inputValues.forEach((input, i) => {
    if (Array.isArray(input)) input = input[0];
    if (input.length <= 0) return;

    input = input.toString();
    const query = {};

    if (source === 'phone' && prefixValues.length > 0) {
      let prefix = prefixValues[i];
      if (Array.isArray(prefix)) prefix = prefix[0];
      if (prefix.length <= 0) return;

      if (/^\d/.test(prefix)) prefix = '+' + prefix;
      if (prefix.startsWith("'")) prefix = prefix.substring(1);
      if (prefix.startsWith("'+")) prefix = prefix.substring(1);

      query['prefix'] = prefix;
      query['number'] = input;
    } else {
      query[queryKey] = input;
    }

    request.addToQueue(query, options);
  });

  if (request.getQueue().length <= 0) {
    alert('No data to process!');
    return;
  }

  const responses = request.sendQueue();

  if (!responses || responses.length <= 0) {
    alert('No response was returned!');
    showSidebar();
    return;
  }

  insertValidationSheet(source, range, responses);
}

function getInputValues(range) {
  // Implement logic to get input values from your data source
  console.log(`Getting input values for range: ${range}`);
  return []; // Placeholder
}

function getInputReferences(range, inputSheet) {
  const result = [];
  const inputRange = getInputValues(range);

  if (Array.isArray(range)) {
    range = range[0];
  }

  const rangeStartLetter = range[0];
  const rangeStartIndex = parseInt(range.slice(1, range.length).split(':')[0]);

  inputRange.forEach((val, i) => {
    if (val.length <= 0) return;

    result.push(
      `=HYPERLINK("#gid=${inputSheet.getSheetId()}&range=${rangeStartLetter}${
        rangeStartIndex + i
      }";"${val}")`
    );
  });

  return result;
}

function insertValidationSheet(source, range, responses) {
  try {
    if (responses.length <= 0) {
      alert('No responses returned');
      return;
    }

    if (range.length <= 0) {
      alert('Empty range was passed');
      return;
    }

    const inputSheet = { getSheetId: () => 123 }; // Placeholder for input sheet
    const newSheetName = `Foxentry - ${new Date().toISOString()}`;

    let resultSheet = null;
    switch (source) {
      case 'email':
        resultSheet = new ResultSheetEmail(newSheetName);
        const inputReferences = getInputReferences(range, inputSheet);
        resultSheet.insertData(responses, inputReferences);
        break;

      case 'phone':
        if (range.length === 2) {
          resultSheet = new ResultSheetPhonePrefix(newSheetName);
          const prefixReferences = getInputReferences(range[0], inputSheet);
          const inputReferences = getInputReferences(range[1], inputSheet);
          resultSheet.insertData(responses, prefixReferences, inputReferences);
        } else {
          resultSheet = new ResultSheetPhone(newSheetName);
          const inputReferences = getInputReferences(range, inputSheet);
          resultSheet.insertData(responses, inputReferences);
        }
        break;
    }

    showSidebar();
  } catch (error) {
    alert(error.message);
    showSidebar();
    return error.message;
  }
}

export { showSidebar, validate, getInputReferences, insertValidationSheet };
