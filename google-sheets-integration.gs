// Google Apps Script Code
// Deploy this as a Web App to enable Google Sheets integration

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents);
    
    // Determine which sheet to write to based on category
    let sheetName;
    switch(data.category) {
      case 'weigh':
        sheetName = 'Reverse Weigh In';
        break;
      case 'push':
        sheetName = 'Push';
        break;
      case 'pull':
        sheetName = 'Pull';
        break;
      case 'legs':
        sheetName = 'Legs';
        break;
      case 'shoulders':
        sheetName = 'Shoulders + Arms';
        break;
      default:
        sheetName = 'Push';
    }
    
    const targetSheet = sheet.getSheetByName(sheetName);
    
    if (!targetSheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ 'error': 'Sheet not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Find the row for this exercise
    const exerciseName = data.exercise;
    const allData = targetSheet.getDataRange().getValues();
    let exerciseRow = -1;
    
    for (let i = 0; i < allData.length; i++) {
      if (allData[i][0] === exerciseName) {
        exerciseRow = i + 1;
        break;
      }
    }
    
    if (exerciseRow === -1) {
      return ContentService
        .createTextOutput(JSON.stringify({ 'error': 'Exercise not found' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Find the next empty column (starting from column E which is index 5)
    const exerciseRowData = allData[exerciseRow - 1];
    let nextColumn = 5; // Column E (index 4 is column E in 0-based indexing)
    
    for (let i = 4; i < exerciseRowData.length; i++) {
      if (!exerciseRowData[i] || exerciseRowData[i] === '') {
        nextColumn = i + 1;
        break;
      }
    }
    
    // Format the entry as "reps*weight"
    const entry = `${data.reps}*${data.weight}`;
    
    // Add notes if provided
    const finalEntry = data.notes ? `${entry} (${data.notes})` : entry;
    
    // Write to the sheet
    targetSheet.getRange(exerciseRow, nextColumn).setValue(finalEntry);
    
    // Also add date header if this is a new column
    const dateRow = 1;
    const currentDate = new Date();
    if (!allData[0][nextColumn - 1]) {
      targetSheet.getRange(dateRow, nextColumn).setValue(currentDate);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'success': true,
        'message': 'Workout logged successfully',
        'row': exerciseRow,
        'column': nextColumn,
        'entry': finalEntry
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        'error': error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Optional: Implement GET to retrieve workout history
  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const category = e.parameter.category || 'Push';
  
  let sheetName;
  switch(category) {
    case 'weigh':
      sheetName = 'Reverse Weigh In';
      break;
    case 'push':
      sheetName = 'Push';
      break;
    case 'pull':
      sheetName = 'Pull';
      break;
    case 'legs':
      sheetName = 'Legs';
      break;
    case 'shoulders':
      sheetName = 'Shoulders + Arms';
      break;
    default:
      sheetName = 'Push';
  }
  
  const targetSheet = sheet.getSheetByName(sheetName);
  const data = targetSheet.getDataRange().getValues();
  
  return ContentService
    .createTextOutput(JSON.stringify({ 
      'success': true,
      'data': data
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
