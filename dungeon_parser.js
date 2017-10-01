var spreadsheet_id = '16K1Zryyxrh7vdKVF1f7eRrUAOC5wuzvC3q2gFLch6LQ';
var API_key = 'AIzaSyDeDLSSUqXfAUyEClwceGUWPhbjJqU-IfM';
var decimal_places = 3;
function initAuth(funcLoadSheet) {
    var master_list = localStorage.getItem('session');
    if (master_list === null) {
	    gapi.client.setApiKey(API_key);
	    gapi.client.load('sheets', 'v4').then(funcLoadSheet);
    } else {
	    var values = JSON.parse(master_list);
	    parseJSON(values);
    }
}
function reloadSheet(funcLoadSheet) {
    localStorage.removeItem('session');
    gapi.client.setApiKey(API_key);
	gapi.client.load('sheets', 'v4').then(funcLoadSheet);
}
function getDungeonSheet() {
    gapi.client.sheets.spreadsheets.values.get({
	    'spreadsheetId': spreadsheet_id,
	    'range': 'Dungeons!A2:L',
    }).then(parseGoogleResponse);
}
function parseGoogleResponse(response) {
    var values = response.result.values;
    parseArray(values);
}
function parseJSON(json) {
    var table = document.getElementById("dungeon-table");
    json.forEach(function(element, index, array) {
	    insertRow(table.tBodies[0], element);
    });
}
function parseArray(values) {
    var table = document.getElementById("dungeon-table");
    var master_list = [];
    values.forEach(function(element, index, array) {
        var realm = element[0];
        var name = element[1];
        var ClassicObj = { 'stamina': element[2], 'first_time': element[5], 'mastery': element[6], 'shards': 0, 'ratio': 0.0, 'rewards': "" };
        var EliteObj = { 'stamina': element[7], 'first_time': element[10], 'mastery': element[11], 'shards': 0, 'ratio': 0.0, 'rewards': "" };
        var check_elite = EliteObj['first_time'] + "," + EliteObj['mastery'];
        var check_normal = ClassicObj['first_time'] + "," + ClassicObj['mastery'];
        var expression = /(?:Stamina Shard x([0-9]))+/g;
        var match;
	    while ((match = expression.exec(check_normal)) !== null) {
	       for (var i = 1; i < match.length; i++) {
	           ClassicObj['shards'] += parseInt(match[i]);
	       }
	    }
	    while ((match = expression.exec(check_elite)) !== null) {
	       for (var i = 1; i < match.length; i++) {
	           EliteObj['shards'] += parseInt(match[i]);
	       }
	    }
      var ratio_normal = (ClassicObj['shards'] == 0) ? 0.000 :  (parseFloat(ClassicObj['shards']) / parseFloat(ClassicObj['stamina'])).toFixed(decimal_places);
      var ratio_elite = (EliteObj['shards'] == 0) ?  0.000: (parseFloat(EliteObj['shards']) / parseFloat(EliteObj['stamina'])).toFixed(decimal_places);
      ClassicObj['ratio'] = ratio_normal;
      EliteObj['ratio'] = ratio_elite;
	    var RowObj = { 'realm': realm, 'name': name, 'classic': ClassicObj, 'elite': EliteObj };
	    insertRow(table.tBodies[0], RowObj);
	    master_list.push(RowObj);
    });
    localStorage.setItem('session', JSON.stringify(master_list));
}

function insertCell(RowObj, cellText, cellClassName = "") {
    var newCell = RowObj.insertCell();
    var newText = document.createTextNode(cellText);
    if (cellClassName !== "") {
        newCell.className = cellClassName;
    }
    newCell.appendChild(newText);
}

function insertRow(table, RowObj) {
    var row = table.insertRow();
    // REFACTOR: iterate over the object's properties and insert a cell for each one
    insertCell(row, RowObj['realm']);
    insertCell(row, RowObj['name']);
    insertCell(row, RowObj['classic']['stamina'], 'classic-cell');
    insertCell(row, RowObj['classic']['shards'], 'classic-cell');
    insertCell(row, RowObj['classic']['ratio'], 'classic-cell');
    insertCell(row, RowObj['classic']['rewards'], 'classic-cell');
    insertCell(row, RowObj['elite']['stamina'], 'elite-cell');
    insertCell(row, RowObj['elite']['shards'], 'elite-cell');
    insertCell(row, RowObj['elite']['ratio'], 'elite-cell');
    insertCell(row, RowObj['elite']['rewards'], 'elite-cell');
}
