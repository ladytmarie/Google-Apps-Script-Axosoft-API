
/** 
 * Axosoft API
 * @license MIT License
 * @author Rutger Meekers
 *
 */

/*
 * Get all items for the given release
 */
function getItemsForRelease() {
  var ui = SpreadsheetApp.getUi();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Show dialog to request sheet name on which the data should be outputted
  var input = ui.prompt('On which sheet would you like to output the results? If the sheet does not exist, it will be created.');
  var sheet_name = input.getResponseText();
  
  // If the sheet already exists, set it as the active sheet. Otherwise first create it and set it active afterwards.
  if (SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name)) {
    ss.setActiveSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name));
  }
  else {  
    ss.insertSheet(sheet_name);
    ss.setActiveSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheet_name));
  }
  
  // Show dialog to request release ID
  var input = ui.prompt('For which release do you want to list the items? Please enter the ID:');
  var release_id = input.getResponseText();

  // Fetch and process results
  if (authorizationStatus()) {
    var url = 'https://your_implementation.axosoft.com/api/v5/items?include_sub_releases_items=true&columns=name,id,item_type,workflow_step,release_id&sort_fields=rank&release_id='+release_id;
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
  
    var dataAll = JSON.parse(response.getContentText());
    var dataSet = dataAll.data;
    var rows = [],data;


    for (i = 0; i < dataSet.length; i++) {
      data = dataSet[i];
      rows.push([data.id, data.name, data.item_type, data.workflow_step.name]); //your JSON entities here
    }
    
    // write the data to the active sheet
    dataRange = ss.getActiveSheet().getRange(2, 1, rows.length, rows[0].length);
    dataRange.setValues(rows);
  }
}

/*
 * Retrieve releases from Axosoft
 */
function getReleaseOverview() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheet = ss.getActiveSheet();
  var service = getService();
  
  var url = 'https://your_implementation.axosoft.com/api/v5/releases';
  
  if (authorizationStatus()) {
    var response = UrlFetchApp.fetch(url, {
      headers: {
        Authorization: 'Bearer ' + service.getAccessToken()
      }
    });
  
    var dataAll = JSON.parse(response.getContentText());
    var dataSet = dataAll.data;
    var rows = [],data;


    for (i = 0; i < dataSet.length; i++) {
      data = dataSet[i];
      rows.push([data.id, data.name]); //your JSON entities here
    }
    
    dataRange = sheet.getRange(2, 1, rows.length, rows[0].length);
    dataRange.setValues(rows);
  }
}

/*
 * Create a custom menu
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('Axosoft')
      .addItem('List Items for Release', 'getItemsForRelease')
      .addSeparator()
      .addToUi();
}
