var spreadsheet_id = '16K1Zryyxrh7vdKVF1f7eRrUAOC5wuzvC3q2gFLch6LQ';
var sheet_id = '1319409797';
var API_key = 'AIzaSyDeDLSSUqXfAUyEClwceGUWPhbjJqU-IfM';
function initAuth() {
    var master_list = localStorage.getItem('session');
    if (master_list === null) {
	gapi.client.setApiKey(API_key);
	gapi.client.load('sheets', 'v4').then(getSheet);
    } else {
	var values = JSON.parse(master_list);
	parseJSON(values);
    }
}
function getSheet() {
    gapi.client.sheets.spreadsheets.values.get({
	'spreadsheetId': spreadsheet_id,
	'range': 'Dungeons!A2:L324',
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
	var ClassicObj = { 'stamina': element[2], 'first_time': element[5], 'mastery': element[6], 'reward': 0 };
	var EliteObj = { 'stamina': element[7], 'first_time': element[10], 'mastery': element[11], 'reward': 0 };
	var check_elite = EliteObj['first_time'] + "," + EliteObj['mastery'];
        var check_normal = ClassicObj['first_time'] + "," + ClassicObj['mastery'];
        var expression = /(?:Stamina Shard x([0-9]))+/g;
        var match;
	while ((match = expression.exec(check_normal)) !== null) {
	   for (var i = 1; i < match.length; i++) {
	       ClassicObj['reward'] += parseInt(match[i]);
	   }
	}
	while ((match = expression.exec(check_elite)) !== null) {
	   for (var i = 1; i < match.length; i++) {
	       EliteObj['reward'] += parseInt(match[i]);
	   }
	}
        var ratio_normal = (ClassicObj['reward'] == 0) ? 0.0 :  (parseFloat(ClassicObj['reward']) / parseFloat(ClassicObj['stamina']));
        var ratio_elite = (EliteObj['reward'] == 0) ?  0.0: (parseFloat(EliteObj['reward']) / parseFloat(EliteObj['stamina']));
	var RowObj = { 'realm': realm, 'name': name, 'classic': ClassicObj, 'elite': EliteObj };
	insertRow(table.tBodies[0], RowObj);
	master_list.push(RowObj);
    });
    localStorage.setItem('session', JSON.stringify(master_list));
}

function insertRow(table, RowObj) {
    var row = table.insertRow();
    // REFACTOR: iterate over the object's properties and insert a cell for each one
    var newCell = row.insertCell();
    var realmText = document.createTextNode(RowObj['realm']);
    newCell.appendChild(realmText);

    newCell = row.insertCell();
    var nameText = document.createTextNode(RowObj['name']);
    newCell.appendChild(nameText);

    newCell = row.insertCell();
    var costText = document.createTextNode(RowObj['classic']['stamina']);
    newCell.className = "classic-cell";
    newCell.appendChild(costText);

    newCell = row.insertCell();
    var rewardText = document.createTextNode(RowObj['classic']['reward']);
    newCell.className = "classic-cell";
    newCell.appendChild(rewardText);

    newCell = row.insertCell();
    var costTextElite = document.createTextNode(RowObj['elite']['stamina']);
    newCell.className = "elite-cell";
    newCell.appendChild(costTextElite);

    newCell = row.insertCell();
    var rewardTextElite = document.createTextNode(RowObj['elite']['reward']);
    newCell.className = "elite-cell";
    newCell.appendChild(rewardTextElite);
}
