var spreadsheet_id = '16K1Zryyxrh7vdKVF1f7eRrUAOC5wuzvC3q2gFLch6LQ';
var sheet_id = '1319409797';
var API_key = 'AIzaSyDeDLSSUqXfAUyEClwceGUWPhbjJqU-IfM';
function initAuth() {
    gapi.client.setApiKey(API_key);
    gapi.client.load('sheets', 'v4').then(getSheet);
}
function getSheet() {
    gapi.client.sheets.spreadsheets.values.get({
	'spreadsheetId': spreadsheet_id,
	'range': 'Dungeons!A2:L324',
    }).then(parseSheet);
}
function parseSheet(response) {
    var values = response.result.values;
    console.log(values);
}
