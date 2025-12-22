const SPREADSHEET_ID = '1lBAdWfHLugUOiBY0HFtdeCwd-SVGh8dsZ6q4xbQTFts';

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  return saveData(data.sheet, data.data);
}

function doGet(e) {
  if (!e.parameter.sheet) {
    return ContentService.createTextOutput('Celébralo pe API OK');
  }
  return saveData(e.parameter.sheet, e.parameter);
}

function saveData(sheetName, data) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(Object.keys(data));
  }
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var row = [];
  for (var i = 0; i < headers.length; i++) {
    row.push(data[headers[i]] || '');
  }
  sheet.appendRow(row);
  return ContentService.createTextOutput('OK');
}
