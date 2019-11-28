const dotenv = require('dotenv');
dotenv.config();
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const config = require('../../config');
const colours = require('../colours');

// const getRows = async (season) => {
//     try {
//         const doc = new GoogleSpreadsheet('1igrPkooUEO7EhljF3tjjuuZf67smjO9obRVngghhYu8');
//         await promisify(doc.useServiceAccountAuth)(config);
//         const info = await promisify(doc.getInfo)();

//         const sheet = info.worksheets.reduce((acc, worksheet, i) => {
//             if (worksheet.title.toLowerCase() === season.toLowerCase()) {
//                 acc = worksheet;
//             }
//             return acc;
//         }, {});

//         const rows = await promisify(sheet.getRows)({
//             "offset": 1,
//             "limit": 300
//         });        
//         return rows;

//     } catch (err) {
//         console.log('accessSpreadsheet error', err);
//     }
// }

// const updateSpreadsheet = async (rows, reqBody) => {
//     try {
//         rows.forEach(async row => {
//             if (row.position === reqBody.position) {
//                 Object.keys(reqBody).forEach(key => {
//                     if (reqBody.removePlant) {
//                         // remove all values, then put position value back so it still renders as an empty spot on the grid next time round
//                         row[key] = '';
//                         row.position = reqBody.position;
//                     } else if (reqBody[key]) {
//                         // e.g. if (reqBody.colour) {row.colour = reqBody.colour};
//                         row[key] = reqBody[key]
//                     }
//                 });
//                 await row.save();
//             }
//         })
//         return 
        
//     } catch (err) {
//         console.log('updateSpreadsheet error', err);
//     }
// }

// module.exports = async (req, res, seasonName) => {
//     try {
//         const seasonPath = req.path.substr(1); // e.g. 'summer19'
//         const rows = await getRows('Full List');
//         let gridItems;
//         if (req.method === "POST") {
//             await updateSpreadsheet(rows, req.body);
//             const updatedRows = await getRows(seasonPath)
//             gridItems = await getPlantData(updatedRows);
//         } else {
//             gridItems = await getPlantData(rows);
//         }
//         return res.render('landing', { rows });
//     } catch (err) {
//         console.log('render error', err);
//     };
// };

const getData = (rows) => {
    try {

        //remove duplicate values for seasons
        const seasons = rows.reduce((acc, row) => {
            if (row.season) {
                acc.includes(row.season) ? '' : acc.push(row.season);
            }
            return acc;
        }, []);

        // create empty array / objects for each season:
        // [{
        //     season: 1998/99,
        //     matches: []
        // },
        // {
        //     season: 1999/00,
        //     matches: []
        // }]
        const seasonsArray = seasons.reduce((acc, season) => {
            const obj = {}
            obj.season = season;
            obj.matches = [];
            acc.push(obj);
            return acc;
        }, []);

        const values = rows.reduce((seasonsArray, row) => {
            seasonsArray.forEach(obj => {
                if (row.season === obj.season) {
                    obj.matches.push({
                        season: row.season,
                        league: row.league,
                        tier: row.leaguetier,
                        date: row.date,
                        opponent: row.opponent,
                        home_away: row.homeaway,
                        score: row.score,
                        result: row.result,
                        position: row.position,
                        points: row.points,
                        competition: row.competition,
                        match_notes: row.matchnotes,
                        got_want: row.gotwant,
                        price: row.programmeprice,
                        notes: row.programmenotes
                    })
                }
            });
            return seasonsArray;
        }, seasonsArray);

        return values;
    } catch (err) {
        console.log('getData error', err);
    }
}


module.exports = async (req, res, seasonName) => {
    try {
        const doc = new GoogleSpreadsheet('1igrPkooUEO7EhljF3tjjuuZf67smjO9obRVngghhYu8');
        await promisify(doc.useServiceAccountAuth)(config);
        const info = await promisify(doc.getInfo)();

        //TODO delete other sheets so this is the only one we have so we can delete this code
        const sheet = info.worksheets.reduce((acc, worksheet, i) => {
            if (worksheet.title === 'FullList') {
                acc = worksheet;
            }
            return acc;
        }, {});

        const rows = await promisify(sheet.getRows)({
            "offset": 1,
            "limit": 5000
        });

        const data = await getData(rows);
        // console.log('==================');
        // console.log('data[0], data[1]', data[0], data[1]);
        // console.log('==================');

        const data1 = JSON.stringify(data)
        
        
        return res.render('landing', { data });
    } catch (err) {
        console.log('render error', err);
    };
};