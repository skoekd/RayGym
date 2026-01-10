// Google Apps Script Web App (RayGym)
//
// Purpose
// - Append workouts from the app into an existing training log Google Sheet
// - Read historical workouts back for the app's History view
//
// Deployment
// 1) In your Google Sheet: Extensions → Apps Script
// 2) Paste this file
// 3) Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 4) Copy the Web app URL (ends with /exec) and paste it into the app Settings
//
// Notes
// - GitHub Pages / mobile browsers can block cross-origin POSTs (CORS). This script supports JSONP
//   so the app can call it via GET with a callback.

function respond_(obj, callback) {
  const json = JSON.stringify(obj);
  if (callback) {
    return ContentService.createTextOutput(`${callback}(${json});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(body);

    if (data.action === 'append_workout') {
      const result = appendWorkout_(data);
      return respond_(result, null);
    }

    return respond_({ success: false, error: 'Unknown action' }, null);
  } catch (err) {
    return respond_({ success: false, error: String(err) }, null);
  }
}

function doGet(e) {
  try {
    const params = (e && e.parameter) ? e.parameter : {};
    const action = String(params.action || 'ping');
    const callback = params.callback ? String(params.callback) : '';

    if (action === 'ping') {
      return respond_({ success: true, message: 'OK' }, callback);
    }

    if (action === 'history') {
      const spreadsheetId = String(params.spreadsheetId || '');
      if (!spreadsheetId) return respond_({ success: false, error: 'Missing spreadsheetId' }, callback);
      const items = buildHistory_(spreadsheetId);
      return respond_({ success: true, items }, callback);
    }

    // JSONP append (used by the app to avoid CORS)
    if (action === 'append_workout') {
      const spreadsheetId = String(params.spreadsheetId || '');
      const payloadStr = String(params.payload || '');
      if (!spreadsheetId) return respond_({ success: false, error: 'Missing spreadsheetId' }, callback);
      if (!payloadStr) return respond_({ success: false, error: 'Missing payload' }, callback);

      const payload = JSON.parse(decodeURIComponent(payloadStr));
      const result = appendWorkout_({ ...payload, spreadsheetId });
      return respond_(result, callback);
    }

    return respond_({ success: false, error: 'Unknown action' }, callback);
  } catch (err) {
    const cb = (e && e.parameter && e.parameter.callback) ? String(e.parameter.callback) : '';
    return respond_({ success: false, error: String(err) }, cb);
  }
}

// -----------------------------
// Core: Append workout
// -----------------------------

function appendWorkout_(payload) {
  const spreadsheetId = payload.spreadsheetId || extractSpreadsheetId_(payload.spreadsheetUrl);
  if (!spreadsheetId) return { success: false, error: 'Invalid spreadsheetId or spreadsheetUrl' };

  const ss = SpreadsheetApp.openById(String(spreadsheetId));
  const program = String(payload.program || 'push');
  const sheetName = mapProgramToSheetName_(program);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return { success: false, error: `Sheet not found: ${sheetName}` };

  // Determine the workout column (date columns start at E)
  const targetCol = getOrCreateWorkoutColumn_(sheet, payload.timestamp);

  // Write workout data per exercise per set row
  const exercises = Array.isArray(payload.exercises) ? payload.exercises : [];
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  const maxRows = values.length;

  const missingExercises = [];
  const writes = [];

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i] || {};
    const nameToFind = String(ex.originalName || ex.name || '').trim();
    if (!nameToFind) continue;

    const startRow = findExerciseStartRow_(values, nameToFind);
    if (startRow === -1) {
      missingExercises.push(nameToFind);
      continue;
    }

    const targetSets = clamp_(Number(ex.targetSets || 0) || 0, 1, 12);
    const setMap = ex.sets || {};

    for (let setNum = 1; setNum <= targetSets; setNum++) {
      const r = startRow + (setNum - 1);
      if (r > maxRows) break;

      const setData = setMap[String(setNum)] || setMap[setNum] || null;
      const formatted = formatSet_(setData);
      // Only write if there is something to write (avoid clobbering existing data with blanks)
      if (formatted === null) continue;

      writes.push({ row: r, col: targetCol, value: formatted });
    }
  }

  // Perform batched writes
  for (let j = 0; j < writes.length; j++) {
    const w = writes[j];
    sheet.getRange(w.row, w.col).setValue(w.value);
  }

  return {
    success: missingExercises.length === 0,
    message: missingExercises.length === 0 ? 'Workout appended' : 'Workout appended with missing exercises',
    sheetName,
    column: targetCol,
    missingExercises
  };
}

function getOrCreateWorkoutColumn_(sheet, isoTimestamp) {
  const headerRow = 1;
  const startCol = 5; // E

  const now = isoTimestamp ? new Date(isoTimestamp) : new Date();
  const ymd = ymd_(now);

  const lastCol = sheet.getLastColumn();
  const headerValues = sheet.getRange(headerRow, startCol, 1, Math.max(1, lastCol - startCol + 1)).getValues()[0];

  // Try to find an existing matching date column
  for (let i = 0; i < headerValues.length; i++) {
    const cell = headerValues[i];
    if (cell instanceof Date && ymd_(cell) === ymd) {
      return startCol + i;
    }
  }

  // Otherwise use next empty header column
  for (let i = 0; i < headerValues.length; i++) {
    if (!headerValues[i]) {
      const col = startCol + i;
      sheet.getRange(headerRow, col).setValue(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
      return col;
    }
  }

  // Or append a new column at the end
  const newCol = lastCol + 1;
  sheet.getRange(headerRow, newCol).setValue(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  return newCol;
}

function findExerciseStartRow_(values, exerciseName) {
  // values is 2D array from getDataRange().getValues() (1-indexed rows in sheet, 0-indexed here)
  for (let r = 1; r < values.length; r++) {
    const a = values[r][0];
    if (a && String(a).trim() === String(exerciseName).trim()) {
      return r + 1; // convert to 1-indexed sheet row
    }
  }
  return -1;
}

function formatSet_(setData) {
  if (!setData) return null;
  const reps = setData.reps;
  const weight = setData.weight;
  if (reps === '' || reps === null || reps === undefined) return null;
  if (weight === '' || weight === null || weight === undefined) return null;

  const r = Number(reps);
  const w = Number(weight);
  if (!isFinite(r) || !isFinite(w)) return null;
  // Existing sheet format: reps*weight
  return `${Math.trunc(r)}*${stripTrailingZeros_(w)}`;
}

// -----------------------------
// Core: History
// -----------------------------

function buildHistory_(spreadsheetId) {
  const ss = SpreadsheetApp.openById(String(spreadsheetId));
  const programSheets = [
    { program: 'push', sheetName: 'Push' },
    { program: 'pull', sheetName: 'Pull' },
    { program: 'legs', sheetName: 'Legs' },
    { program: 'shoulders', sheetName: 'Shoulders + Arms' },
    { program: 'weigh', sheetName: 'Reverse Weigh In' }
  ];

  const items = [];
  for (let i = 0; i < programSheets.length; i++) {
    const ps = programSheets[i];
    const sheet = ss.getSheetByName(ps.sheetName);
    if (!sheet) continue;
    items.push.apply(items, buildHistoryForSheet_(sheet, ps.program, ps.sheetName));
  }

  // Sort newest first
  items.sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    return db - da;
  });

  return items;
}

function buildHistoryForSheet_(sheet, program, sheetName) {
  const startCol = 5; // E
  const values = sheet.getDataRange().getValues();
  if (!values || values.length < 2) return [];

  const header = values[0];
  const dateCols = [];
  for (let c = startCol - 1; c < header.length; c++) {
    if (header[c] instanceof Date) dateCols.push(c);
  }
  if (dateCols.length === 0) return [];

  // Build exercise groups (start row indices in values)
  const groups = [];
  for (let r = 1; r < values.length; r++) {
    const name = values[r][0];
    if (name && String(name).trim() !== '') {
      groups.push({ start: r, name: String(name).trim() });
    }
  }
  // Determine end boundaries
  for (let i = 0; i < groups.length; i++) {
    groups[i].end = (i < groups.length - 1) ? (groups[i + 1].start - 1) : (values.length - 1);
  }

  const workouts = [];
  for (let i = 0; i < dateCols.length; i++) {
    const col = dateCols[i];
    const date = header[col];

    const exList = [];
    let totalSets = 0;
    for (let g = 0; g < groups.length; g++) {
      const grp = groups[g];
      let setsLogged = 0;
      for (let r = grp.start; r <= grp.end; r++) {
        const v = values[r][col];
        if (v !== null && v !== undefined && String(v).trim() !== '') setsLogged++;
      }
      if (setsLogged > 0) {
        exList.push({ name: grp.name, setsLogged });
        totalSets += setsLogged;
      }
    }

    if (totalSets > 0) {
      workouts.push({
        date: new Date(date).toISOString(),
        program,
        programName: sheetName,
        totalSets,
        exercises: exList
      });
    }
  }

  return workouts;
}

// -----------------------------
// Helpers
// -----------------------------

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function mapProgramToSheetName_(program) {
  switch (String(program).toLowerCase()) {
    case 'weigh': return 'Reverse Weigh In';
    case 'push': return 'Push';
    case 'pull': return 'Pull';
    case 'legs': return 'Legs';
    case 'shoulders': return 'Shoulders + Arms';
    default: return 'Push';
  }
}

function extractSpreadsheetId_(url) {
  if (!url) return '';
  const m = String(url).match(/\/d\/([a-zA-Z0-9-_]+)/);
  return m ? m[1] : '';
}

function ymd_(d) {
  return [d.getFullYear(), pad2_(d.getMonth() + 1), pad2_(d.getDate())].join('-');
}

function pad2_(n) {
  const s = String(n);
  return s.length === 1 ? '0' + s : s;
}

function clamp_(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

function stripTrailingZeros_(num) {
  const s = String(num);
  if (s.indexOf('.') === -1) return s;
  return s.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
}
