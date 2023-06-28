function getData(sheetName) {   // Function to extract data from a given subsheet in the sheet
  let data = SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(sheetName)
    .getDataRange()
    .getValues();
  return data;
}

function createObjectfromdata(headers, row) {   // Function takes the data extracted and makes it into an object with the headers as keys
  row_object = {};
  for (let i = 0; i < headers.length; i++) {
    row_object[headers[i]] = row[i];
  }
  return row_object;
}

function mergeText(row_object, text) {    // Used to merge text in each string
  text = text.replace("{{Name}}", row_object["Enter Full Name"]);
  text = text.replace("{{Place}}", row_object["Where are you from?"]);
  return text;
}

function main() {   // Main function to be run
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.getRange("e1").setValue("Sent_Status");   // Creates a new column called Sent_Status
  let data = getData("Form Responses 1");   // Gets the form Responses
  let template = getData("Contents");   // Gets the template text from the second sheet as well
  subject = template[1][0];   
  body = template[4][0];
  headers = data.shift();   // Removes column headers from data
  for (let i = 0; i < data.length; i++) {     // Goes through each row
    row = data[i];
    if (row[4] == "") {   // If a mail hasn't been sent for a particular row
      row_object = createObjectfromdata(headers, row);
      subject_text = mergeText(row_object, subject);
      body_text = mergeText(row_object, body);
      MailApp.sendEmail(row_object["Enter Email Address"], subject_text, body_text);
      sheet.getRange(`e${i + 2}`).setValue("Sent");     // Set the last column to Sent, so that there is feedback
    }
  }
}

function createFormTrigger() {    // Function creates form triggers; should be run initially
  ScriptApp.newTrigger("main")
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onFormSubmit()
    .create();
}
