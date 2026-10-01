function doGet() {
  return textResponse('Signup endpoint is available. Submit the website form to subscribe.');
}

function doPost(event) {
  var parameters = event && event.parameter ? event.parameter : {};

  if (parameters.website) {
    return textResponse('OK');
  }

  var email = String(parameters.email || '').trim().toLowerCase();
  var phone = String(parameters.phone || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return textResponse('INVALID_EMAIL');
  }

  var spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('Set the SPREADSHEET_ID script property before deploying.');
  }

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    var sheet = spreadsheet.getSheetByName('Subscribers');

    if (!sheet) {
      sheet = spreadsheet.insertSheet('Subscribers');
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Email', 'Signed up at', 'Phone number']);
    } else if (sheet.getRange(1, 3).getValue() !== 'Phone number') {
      sheet.getRange(1, 3).setValue('Phone number');
    }

    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var existingEmails = sheet.getRange(2, 1, lastRow - 1, 1).getDisplayValues();
      var alreadySubscribed = existingEmails.some(function (row) {
        return String(row[0]).trim().toLowerCase() === email;
      });

      if (alreadySubscribed) {
        return textResponse('ALREADY_SUBSCRIBED');
      }
    }

    sheet.appendRow([email, new Date(), phone]);
    return textResponse('OK');
  } finally {
    lock.releaseLock();
  }
}

function textResponse(message) {
  return ContentService.createTextOutput(message)
    .setMimeType(ContentService.MimeType.TEXT);
}