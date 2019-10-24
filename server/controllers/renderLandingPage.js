const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const dotenv = require('dotenv');
dotenv.config();
const config = require('../../config');

module.exports = async (req, res) => {
    try {
        const gridItems = await accessSpreadsheet();
        return res.render('landing', { gridItems });
    } catch (err) {
        console.log('==================');
        console.log('render error', err);
        console.log('==================');
        return res.render('error'); //TODO
    };
};

async function accessSpreadsheet() {
    try {
        const doc = new GoogleSpreadsheet('1Khj2u55fpyr7pjKxJKu8HQzmj6UD5x2fTAxpsme0wcM');
        await promisify(doc.useServiceAccountAuth)(config);
        const info = await promisify(doc.getInfo)();
        const sheet = info.worksheets[0];
        const rows = await promisify(sheet.getRows)({
            "offset": 1,
            "limit": 300
        });
        const values = rows.reduce((acc, row) => {
            if (row.position) {
                acc.push({
                    isDecking: `${row.position}`.includes('17') || `${row.position}`.includes('18') || `${row.position}`.includes('19'),
                    position: row.position,
                    commonName: row.commonname,
                    latinName: row.latinname,
                    perennialAnnual: row.perennialannual,
                    plantedDate: row.planteddate,
                    floweringPeriod: row.floweringperiod,
                    colour: row.colour,
                    image: row.image,
                    link: row.link,
                    notes: row.notes
                });
            }
            return acc;
        }, [])
        console.log('==================');
        console.log('JSON.stringify(values)', JSON.stringify(values));
        console.log('==================');
        return values;
    } catch (err) {
        console.log('==================');
        console.log('error', err);
        console.log('==================');
    }
}