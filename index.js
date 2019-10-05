const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

const creds = require('./client_secret.json');

async function accessSpreadsheet () {
    const doc = new GoogleSpreadsheet('1Khj2u55fpyr7pjKxJKu8HQzmj6UD5x2fTAxpsme0wcM');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[0];
    const cells = await promisify(sheet.getCells)({
        "min-row": 2,
        "max-row": 300,
        "min-col": 19,
        "max-col": 27 
    });
    console.log(cells);
}

accessSpreadsheet();