import { RowID, RowElement } from './interface';
import * as CRUD from './crud.js';

const row: RowElement = {
    firstName: "Guillaume",
    lastName: "Salva"
};

const newRowID: RowID = CRUD.insertRow(row);
console.log(`Inserted new row ID: ${newRowID}`);

const updatedRow: RowElement = {
    firstName: "Guillaume",
    lastName: "Salva",
    age: 23
};

CRUD.updateRow(newRowID, updatedRow);
CRUD.deleteRow(newRowID);
