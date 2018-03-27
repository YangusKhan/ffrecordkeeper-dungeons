function Table(TableDOMElement) {
    this._table = TableDOMElement;
    this.rows = [];

    this.addCell = function(RowObj, cell, cellClassName = "") {
        var newCell = RowObj.insertCell();
        var newText = document.createTextNode(cellText);
        if (cellClassName !== "") {
            newCell.className = cellClassName;
        }
        newCell.appendChild(newText);
    };

    this.addRow = function(RowObj) {
        var newRow = this._table.tbodies[0].insertRow();
        // REFACTOR: iterate over the object's properties and insert a cell for each one
        this.addCell(newRow, RowObj['realm']);
        this.addCell(newRow, RowObj['name']);
        this.addCell(newRow, RowObj['classic']['stamina'], 'classic-cell');
        this.addCell(newRow, RowObj['classic']['shards'], 'classic-cell');
        this.addCell(newRow, RowObj['classic']['ratio'], 'classic-cell');
        this.addCell(newRow, RowObj['classic']['rewards'], 'classic-cell');
        this.addCell(newRow, RowObj['elite']['stamina'], 'elite-cell');
        this.addCell(newRow, RowObj['elite']['shards'], 'elite-cell');
        this.addCell(newRow, RowObj['elite']['ratio'], 'elite-cell');
        this.addCell(newRow, RowObj['elite']['rewards'], 'elite-cell');
        this.rows.push(newRow);
    };
}