// ============================================================================
// GOOGLE APPS SCRIPT - WEDDING INVITATION (RSVP + LIVE PHOTO SHARING PNG)
// Folder ID Target: 10VPVOU3KRLyrHAyxUUFLO67C68ICidWm
// ============================================================================

const FOLDER_ID = '10VPVOU3KRLyrHAyxUUFLO67C68ICidWm';
const SHEET_RSVP = 'Ucapan';
const SHEET_GALERI = 'LiveGaleri';

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? e.parameter.action : 'rsvp';
  
  if (action === 'gallery') {
    return getGalleryPhotos();
  }
  return getRsvpComments();
}

function doPost(e) {
  try {
    const rawData = e.postData.contents;
    const payload = JSON.parse(rawData);
    
    if (payload.action === 'uploadPhoto') {
      return uploadLivePhoto(payload);
    } else {
      return saveRsvpComment(payload);
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// --- 1. FUNGSI UPLOAD FOTO PNG KE GOOGLE DRIVE & CATAT DI SPREADSHEET ---
function uploadLivePhoto(payload) {
  const folder = DriveApp.getFolderById(FOLDER_ID);
  
  // Hapus prefix data URL (data:image/png;base64,) jika ada
  const base64Data = payload.image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
  const decodedBytes = Utilities.base64Decode(base64Data);
  
  const guestName = (payload.guestName || 'Tamu').replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'Tamu';
  const timestamp = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'yyyyMMdd_HHmmss');
  const fileName = 'Wedding_' + guestName.replace(/\s+/g, '_') + '_' + timestamp + '.png';
  
  // Simpan sebagai PNG berkualitas penuh di Google Drive
  const blob = Utilities.newBlob(decodedBytes, 'image/png', fileName);
  const file = folder.createFile(blob);
  
  // Set izin akses agar foto bisa langsung tampil di galeri undangan semua tamu
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  const fileId = file.getId();
  // URL langsung yang stabil untuk ditampilkan di tag <img>
  const imageUrl = 'https://lh3.googleusercontent.com/d/' + fileId + '=w1200';
  const driveUrl = file.getUrl();
  
  // Simpan log ke Spreadsheet sheet "LiveGaleri"
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_GALERI);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_GALERI);
    sheet.appendRow(['ID', 'Waktu', 'Nama Tamu', 'Nama File', 'Image URL', 'Drive Link']);
  }
  
  const photoId = new Date().getTime();
  const formattedDate = Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm:ss');
  sheet.appendRow([photoId, formattedDate, guestName, fileName, imageUrl, driveUrl]);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    photo: {
      id: photoId,
      guestName: guestName,
      image: imageUrl,
      driveUrl: driveUrl,
      date: formattedDate
    }
  })).setMimeType(ContentService.MimeType.JSON);
}

// --- 2. FUNGSI AMBIL DAFTAR FOTO LIVE GALLERY ---
function getGalleryPhotos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_GALERI);
  
  if (!sheet) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      photos: []
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  const rows = sheet.getDataRange().getValues();
  const photos = [];
  
  // Mulai dari baris ke-2 (index 1) melewati header, urutkan dari terbaru
  for (let i = rows.length - 1; i >= 1; i--) {
    if (rows[i][4]) {
      photos.push({
        id: rows[i][0],
        date: rows[i][1],
        guestName: rows[i][2],
        fileName: rows[i][3],
        image: rows[i][4],
        driveUrl: rows[i][5]
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success',
    photos: photos
  })).setMimeType(ContentService.MimeType.JSON);
}

// --- 3. FUNGSI UCAPAN & DOA (RSVP) ---
function saveRsvpComment(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_RSVP);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_RSVP);
    sheet.appendRow(['id', 'name', 'status', 'message', 'date', 'color']);
  }
  
  sheet.appendRow([
    payload.id || new Date().getTime(),
    payload.name || '',
    payload.status || '',
    payload.message || '',
    payload.date || '',
    payload.color || '#000000'
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({
    status: 'success'
  })).setMimeType(ContentService.MimeType.JSON);
}

function getRsvpComments() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_RSVP);
  if (!sheet) {
    sheet = ss.getSheets()[0];
  }
  
  const rows = sheet.getDataRange().getValues();
  const comentar = [];
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][1]) {
      comentar.push({
        id: rows[i][0],
        name: rows[i][1],
        status: rows[i][2],
        message: rows[i][3],
        date: rows[i][4],
        color: rows[i][5]
      });
    }
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    comentar: comentar
  })).setMimeType(ContentService.MimeType.JSON);
}
