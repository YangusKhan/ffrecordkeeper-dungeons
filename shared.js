var spreadsheet_id = '16K1Zryyxrh7vdKVF1f7eRrUAOC5wuzvC3q2gFLch6LQ';
var API_key = 'AIzaSyDeDLSSUqXfAUyEClwceGUWPhbjJqU-IfM';
var bSheetIsLoaded = false;

function handleClientLoad(funcLoadSheet) {
    gapi.load('client:auth2', function() {
        initAuth(funcLoadSheet);
    });
}

function initAuth(funcLoadSheet) {
    var master_list = localStorage.getItem('session');
    if (master_list === null) {
	    gapi.client.init({
            apiKey: API_key,
            discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
        })
        .then(funcLoadSheet);
    } else {
	    var values = JSON.parse(master_list);
	    parseJSON(values);
        bSheetIsLoaded = true;
    }
}
function reloadSheet(funcLoadSheet) {
    localStorage.removeItem('session');
    var table = document.getElementById("dungeon-table");
    table.tBodies[0].innerHTML = "";
    gapi.client.init({
        apiKey: API_key,
        discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"]
    })
    .then(funcLoadSheet);
}