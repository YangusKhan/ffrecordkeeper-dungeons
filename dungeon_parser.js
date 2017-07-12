var spreadsheet_id = '16K1Zryyxrh7vdKVF1f7eRrUAOC5wuzvC3q2gFLch6LQ';
var sheet_id = '1319409797';
var API_key = 'AIzaSyDeDLSSUqXfAUyEClwceGUWPhbjJqU-IfM';
var dictRealmStrings = {};
dictRealmStrings["I"] = "1";
dictRealmStrings["II"] = "2";
dictRealmStrings["III"] = "3";
dictRealmStrings["IV"] = "4";
dictRealmStrings["V"] = "5";
dictRealmStrings["VI"] = "6";
dictRealmStrings["VII"] = "7";
dictRealmStrings["VIII"] = "8";
dictRealmStrings["IX"] = "9";
dictRealmStrings["X"] = "10";
dictRealmStrings["XI"] = "11";
dictRealmStrings["XII"] = "12";
dictRealmStrings["XIII"] = "13";
dictRealmStrings["XIV"] = "14";
dictRealmStrings["XV"] = "15";
dictRealmStrings["T"] = "t";
dictRealmStrings["CC:VII"] = "7";

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
function reloadSheet() {
    localStorage.removeItem('session');
    gapi.client.setApiKey(API_key);
	gapi.client.load('sheets', 'v4').then(getSheet);
}
function getSheet() {
    gapi.client.sheets.spreadsheets.values.get({
	    'spreadsheetId': spreadsheet_id,
	    'range': 'Dungeons!A2:L436',
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
      var realm = dictRealmStrings[element[0]];
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
      ClassicObj['ratio'] = ratio_normal.toFixed(4);
      EliteObj['ratio'] = ratio_elite.toFixed(4);
	    var RowObj = { 'realm': realm, 'name': name, 'classic': ClassicObj, 'elite': EliteObj };
	    insertRow(table.tBodies[0], RowObj);
	    master_list.push(RowObj);
    });
    localStorage.setItem('session', JSON.stringify(master_list));
}

function insertRow(table, RowObj) {
    var row = table.insertRow();
    row.dataset.realm = RowObj['realm'];
    
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
    var rewardText = document.createTextNode(RowObj['classic']['ratio']);
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
    
    newCell = row.insertCell();
    var rewardTextElite = document.createTextNode(RowObj['elite']['ratio']);
    newCell.className = "elite-cell";
    newCell.appendChild(rewardTextElite);
}

function runFilters() {
    var filterContainer = document.getElementById('container-filter');
    var filterSelectRealm = document.getElementById('filter-realm');
    var filterRealm = filterSelectRealm.children[filterSelectRealm.selectedIndex].value;
    
    var filterSelectOrb = document.getElementById('filter-orbs');
    var filterOrb = filterSelectOrb.children[filterSelectOrb.selectedIndex].value;
    
    var filterSelectMC = document.getElementById('filter-mc');
    var filterMC = filterSelectMC.children[filterSelectMC.selectedIndex].value;
    
    var filterSelectMaterial = document.getElementById('filter-materials');
    var filterMaterial = filterSelectMaterial.children[filterSelectMaterial.selectedIndex].value;
    
    var table = document.getElementById("dungeon-table");
    table.tBodies[0].rows.foreach(function(element, index, array) {
        if (filterRealm !== 'any') {
            var rowRealm = element.dataset.realm;
            if (rowRealm !== filterRealm) {
                element.style.display = "none";
            } else {
                element.style.display = "table-row";
            }
        }
    });
}