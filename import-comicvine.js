// Import modules
const mongojs	= require('mongojs');
const request	= require('request');

// Connect to database
const db = mongojs('shelf');

// Import config
const config = require('./config.json');
const comicvine = config.api.comicvine;

// Construct comicvine URL
const genComicVineURL = (resource) => comicvine.url.base + '/' + resource + '?format=json&api_key=' + comicvine.key;

let numRequests = 1;

for (let i = 0; i < numRequests; ++i) {
	console.log('Request #' + i);
	const url = genComicVineURL('issues') + '&filter=volume:2127';
	request.get({
		url,
		headers: {
			'User-Agent': 'shelf'
		}
	}, (err, response, body) => {
		if (err) {
			console.error(err);
		} else {
			const data = JSON.parse(body);
			const issues = data.results;
			numRequests = Math.ceil(data.number_of_total_results / 100);
			for (let issue of issues) {
				console.log('Inserting Issue #' + issue.issue_number);
				db.issues.insert(issue, (err) => {
					if (err) console.error(err);
				});
			}
		}
	});
}
