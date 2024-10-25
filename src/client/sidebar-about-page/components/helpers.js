/**
 * A helper function to display messages to the user.
 *
 * @param {string} message - Message to be displayed.
 * @param {string} caller - {Optional} text to append to the title.
 */
function showMessage(message, caller) {
  // Sets the title using the APP_TITLE constant; adds optional caller string.
  let title = APP_TITLE;
  if (caller != null) {
    title += ` : ${caller}`;
  }

  const ui = SpreadsheetApp.getUi();
  ui.alert(title, message, ui.ButtonSet.OK);
}

/**
 * Displays a message box with the given value.
 *
 * @param {string} value - Value to be displayed in a message box.
 */
function showMessageBox(value) {
  Browser.msgBox(value);
}

/**
 * Retrieves values from the active spreadsheet range and displays them in a message box.
 */
function getRangeValues() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheetValues = sheet.getActiveRange().getValues();

  showMessageBox(sheetValues);
}

/** Function to pick the selected range from the Google Sheet
 * This returns the picked range, so that the client-side JS
 * function (in HTML file) can populate it in the text field **/
function getSelectedRange() {
  var selected = SpreadsheetApp.getActiveSheet().getActiveRange(); // Gets the selected range
  var rangeString = selected.getA1Notation(); // converts it to the A1 type notation
  return rangeString;
}
