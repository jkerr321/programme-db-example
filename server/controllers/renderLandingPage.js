const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const dotenv = require('dotenv');
dotenv.config();
const config = require('../../config');

module.exports = async (req, res, seasonName) => {
    try {
        const seasonPath = req.path.substr(1);
        const gridItems = await accessSpreadsheet(seasonPath);
        return res.render('landing', { gridItems, seasonName, seasonPath });
    } catch (err) {
        console.log('==================');
        console.log('render error', err);
        console.log('==================');        
        // return res.render('error'); //TODO
    };
};

async function accessSpreadsheet(season) {
    try {
        const doc = new GoogleSpreadsheet('1Khj2u55fpyr7pjKxJKu8HQzmj6UD5x2fTAxpsme0wcM');
        await promisify(doc.useServiceAccountAuth)(config);
        const info = await promisify(doc.getInfo)();
        let seasonSheet = {};
        info.worksheets.forEach(sheet => { //this could be much nicer!
            if (sheet.title.toLowerCase() === season.toLowerCase()) {
                seasonSheet = sheet;
            }
            return sheet;
        })
        // const sheet = info.worksheets[0];
        // info.worksheets[0].title); //==sheet name
        const rows = await promisify(seasonSheet.getRows)({
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
                    perennialAnnual: `${row.perennialannual}`.substr(0,1),
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
        return values;
    } catch (err) {
        console.log('==================');
        console.log('error', err);
        console.log('==================');
    }
}