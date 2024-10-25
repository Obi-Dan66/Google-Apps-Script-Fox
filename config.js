const APP_TITLE = 'Email and Phone validation by Foxentry';

/**
 * Creates a custom dropdown menu in Google Sheets with specified list items.
 */
function onOpen() {
  // Access the UI service of the Spreadsheet
  SpreadsheetApp.getUi()
    .createMenu('E-mail and phone validation by Foxentry')
    .addItem('Set API key', 'setApiKey')
    .addItem('Show sidebar', 'showSidebar')
    // Add the created menu to the Spreadsheet UI
    .addToUi();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initialization work.
 *
 * @param {object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(); // Call onOpen() to create the menu and perform initialization tasks
}
