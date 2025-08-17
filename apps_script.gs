/**
 * Google Apps Script backend for CGMMA form (Web App)
 * - Saves files to Drive (optional FOLDER_ID)
 * - Appends a row to Google Sheet
 * Deploy: New Deployment → Web app → Execute as: Me, Access: Anyone
 */

const SHEET_NAME = 'Sheet1';
const FOLDER_ID = ''; // optional: put your Google Drive folder ID to store uploads

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const params = body.params || {};
    const members = body.members || [];
    const files = body.files || [];

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    let folder = null;
    if (FOLDER_ID) {
      folder = DriveApp.getFolderById(FOLDER_ID);
    } else {
      folder = DriveApp.getRootFolder();
    }

    // Save files to Drive and collect links
    const saved = [];
    files.forEach(f => {
      const blob = Utilities.newBlob(Utilities.base64Decode(f.dataBase64), f.mimeType, f.filename);
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      saved.push({
        category: f.category,
        docType: f.docType,
        name: file.getName(),
        url: file.getUrl(),
        id: file.getId(),
        mimeType: f.mimeType
      });
    });

    const row = [
      new Date(),
      params.formType || '',
      (params.formType === 'family' ? 'Family Service Card' : 'Practice cum Trainee'),
      JSON.stringify(params),
      JSON.stringify(members),
      JSON.stringify(saved)
    ];
    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({status:'ok', count: saved.length}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({status:'error', message: String(err)}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
