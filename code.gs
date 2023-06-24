function getData(sheetName) {
  let data = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(sheetName)
    .getDataRange()
    .getValues();
  return data;
}

function createObjectfromdata(headers, row) {
  row_object = {};
  for (let i = 0; i < headers.length; i++) {
    row_object[headers[i]] = row[i];
  }
  return row_object;
}

function mergeText(row_object, text) {
  text = text.replace("{{Name}}", row_object.Name);
  text = text.replace("{{Priority}}", row_object.Priority);
  return text;
}

function test() {
  var data = getData("Form Responses 1");
  console.log(data);
  console.log(data[1][4]);
}

function main() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.getRange("e1").setValue("Sent_Status");
  let data = getData("Form Responses 1");
  let template = getData("Contents");
  subject = template[1][0];
  body = template[4][0];
  headers = data.shift();
  for (let i = 0; i < data.length; i++) {
    row = data[i];
    if (row[4] == "") {
      row_object = createObjectfromdata(headers, row);
      subject_text = mergeText(row_object, subject);
      body_text = mergeText(row_object, body);
      MailApp.sendEmail(row_object["Email ID"], subject_text, body_text);
      sheet.getRange(`e${i + 2}`).setValue("Sent");
    }
  }
}

function createFormTrigger() {
  ScriptApp.newTrigger("main")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();
}
