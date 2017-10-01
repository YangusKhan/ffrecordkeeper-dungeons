var spreadsheet_id = '16K1Zryyxrh7vdKVF1f7eRrUAOC5wuzvC3q2gFLch6LQ';
var API_key = 'AIzaSyDeDLSSUqXfAUyEClwceGUWPhbjJqU-IfM';
var decimal_places = 3;
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
dictRealmStrings["FFT"] = "T";
dictRealmStrings["CC:VII"] = "7";
dictRealmStrings["X-2"] = "10";
dictRealmStrings["XIII-2"] = "13";
dictRealmStrings["XIII-3"] = "13";
var arSortIndexDataAttributes = ['realm', 'costNormal', 'rewardNormal', 'ratioNormal', 'costElite', 'rewardElite', 'ratioElite'];

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
    var table = document.getElementById("dungeon-table");
    table.tBodies[0].innerHTML = "";
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
        var realm = dictRealmStrings[element[0]];
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

function runFilters() {
    var filterContainer = document.getElementById('container-filters');
    var filterSelectRealm = document.getElementById('filter-realm');
    var filterRealm = filterSelectRealm.children[filterSelectRealm.selectedIndex].value;
    
    var filterSelectOrb = document.getElementById('filter-orbs');
    var filterOrb = filterSelectOrb.children[filterSelectOrb.selectedIndex].value;
    
    var filterSelectMC = document.getElementById('filter-mc');
    var filterMC = filterSelectMC.children[filterSelectMC.selectedIndex].value;
    
    var filterSelectMaterial = document.getElementById('filter-materials');
    var filterMaterial = filterSelectMaterial.children[filterSelectMaterial.selectedIndex].value;
    
    var table = document.getElementById("dungeon-table");
    for (var i = 0, len = table.tBodies[0].rows.length; i < len; i++) {
        var row = table.tBodies[0].rows.item(i);
        if (filterRealm === 'any') {
            row.style.display = "table-row";
        } else {
            var rowRealm = row.dataset.realm;
            if (rowRealm !== filterRealm) {
                row.style.display = "none";
            } else {
                row.style.display = "table-row";
            }
        }
    }
}

function sortTable(table, index, bAscending) {
    var rows = table.tBodies[0].rows;
    rows = Array.prototype.slice.call(rows);
    rows.sort(function(a, b) {
       var left;
       var right;
       if (index == 3 || index == 6) {
           left = parseFloat(a.dataset[arSortIndexDataAttributes[index]]);
           right = parseFloat(b.dataset[arSortIndexDataAttributes[index]]);
       } else {
           left = parseInt(a.dataset[arSortIndexDataAttributes[index]]);
           right = parseInt(b.dataset[arSortIndexDataAttributes[index]]);
       }
       if (left < right) {
           if (bAscending) return -1;
           else return 1;
       } else if (left > right) {
           if (bAscending) return 1;
           else return -1;
       } else {
           return 0;
       }
    });
    for (var i = 0, len = rows.length; i < len; i++) {
        var parent = rows[i].parentNode;
        var detachedRow = parent.removeChild(rows[i]);
        parent.appendChild(detachedRow);
    }
}