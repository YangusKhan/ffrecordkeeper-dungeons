function getAbilitySheet() {
    gapi.client.sheets.spreadsheets.values.get({
	    'spreadsheetId': spreadsheet_id,
	    'range': 'Abilities!A2:L',
    }).then(parseGoogleResponse);
}