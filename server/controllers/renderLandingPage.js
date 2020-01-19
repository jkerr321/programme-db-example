const dotenv = require('dotenv');
dotenv.config();
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const config = require('../../config');

const updateSpreadsheet = async (rows, reqBody) => {
	try {
		rows.forEach(async row => {
			if (row.id === reqBody.id) {
				Object.keys(reqBody).forEach(key => {
					if (reqBody[key]) {
						// e.g. if (reqBody.colour) {row.colour = reqBody.colour};
						row[key] = reqBody[key];
					}
				});
				await row.save();
			}
		});
		return;

	} catch (err) {
		console.error('updateSpreadsheet error', err);
	}
};

const getRows = async (sheetName) => {
	const doc = new GoogleSpreadsheet('1iljvKD16jiAuYatLvRpmpc6lYwIOXqYevYlK0YZKOk0');
	await promisify(doc.useServiceAccountAuth)(config);
	const info = await promisify(doc.getInfo)();

    const rows = await promisify(info.worksheets[0].getRows)({
		'offset': 1,
		'limit': 5000
	});
	return rows;
};

const getUniqueList = (rows, value) => {
	return rows.reduce((acc, row) => {
		if (row[value]) {
			acc.includes(row[value]) ? '' : acc.push(row[value]);
		}
		return acc;
	}, []);
};

const getFullListData = (rows) => {
	try {
		const seasons = getUniqueList(rows, 'season');
		// create empty array / objects for each season:
		// {
		//     season: 1998/99,
		//     season_string: 199899, // eg 200102 rather than 2001/02 - so that this can be inserted into html class and searched on later
		//     matches: []
		// }
		const seasonsArray = seasons.reduce((acc, season) => {
			const obj = {};
			obj.season = season;
			obj.season_string = season.substring(0, 4) + season.substring(5);
			obj.matches = [];
			acc.push(obj);
			return acc;
		}, []);

		const values = rows.reduce((seasonsArray, row) => {
			seasonsArray.forEach(obj => {
				if (row.season === obj.season) {
					if (row.gotwant === 'Want' && !obj.isNotComplete) {
						obj.isNotComplete = true;
					}
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
						notes: row.programmenotes,
						id: row.id
					});
				}
			});
			return seasonsArray;
		}, seasonsArray);

		return values;
	} catch (err) {
		console.error('getData error', err);
	}
};

const filterRows = async (rows, reqBody) => {
	return rows.filter(row => {
		let result = true;
		if (reqBody.seasonFilter && !reqBody.seasonFilter.includes(row.season)) {result = false;}
		if (reqBody.opponentFilter && !reqBody.opponentFilter.includes(row.opponent)) {result = false;}
		if (reqBody.gotWantFilter && row.gotwant !== reqBody.gotWantFilter) {result = false;}
		if (reqBody.homeAwayFilter && row.homeaway !== reqBody.homeAwayFilter) {result = false;}
		return result;
	});
};

const getFilterString = (reqBody) => {
    let result = [];
    if (reqBody.seasonFilter) { result.push(`${reqBody.seasonFilter}`); }
    if (reqBody.opponentFilter) { result.push(`${reqBody.opponentFilter}`); }
    if (reqBody.gotWantFilter) { result.push(`${reqBody.gotWantFilter}`); }
    if (reqBody.homeAwayFilter) { result.push(`${reqBody.homeAwayFilter}`); }
    return result;
}

module.exports = async (req, res) => {
	try {
		const rows = await getRows('FullList');
		const seasonData = getUniqueList(rows, 'season');
		const opponentData = getUniqueList(rows, 'opponent').sort();
		let renderData;

		if (req.method === 'POST') {
			if (req.body.filter) {
				const filteredRows = await filterRows(rows, req.body);
				const allData = await getFullListData(filteredRows);
                const isFiltered = true;
                const appliedFilter = getFilterString(req.body);
				renderData = { seasonData, opponentData, allData, isFiltered, appliedFilter };
			} else {
				await updateSpreadsheet(rows, req.body);
				const updatedRows = await getRows('FullList');
				const allData = await getFullListData(updatedRows);
				renderData = { seasonData, opponentData, allData };
			}
		} else {
			const allData = await getFullListData(rows, seasonData);
			renderData = { seasonData, opponentData, allData };
		}
		return res.render('landing', renderData);
	} catch (err) {
		console.error('render error', err);
	}
};
