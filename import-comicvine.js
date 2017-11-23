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

// Volume IDs
const volumes = [
	2127,	// Amazing Spider-Man
	2407,	// Iron Man
	2406	// Hulk
];

const getIssues = (volumeID, offset, callback) => {
	let url = genComicVineURL('issues') + '&filter=volume:' + volumeID + '&offset=' + offset;
	request.get({
		url,
		headers: {
			'User-Agent': comicvine.userAgent
		}
	}, (err, response, body) => {
		if (err) {
			callback(err);
		} else {
			callback(null, JSON.parse(body));
		}
	});
};

const insertIssue = (issue) => {
	db.issues.findOne({
		id: issue.id
	}, (err, doc) => {
		if (err) console.error(err);
		if (doc) console.error('issue already imported');
		if (!doc) {
			db.issues.insert(issue, (err) => {
				if (err) console.error(err);
				if (!err) console.log('Inserted Issue #' + issue.issue_number);
			});
		}
	});
};

let totalImported = 0;

volumes.forEach((volume) => {
	console.log('Getting ' + volume);
	let offset = 0;
	let numRequests = 0;
	getIssues(volume, offset, (err, data) => {
		if (err) {
			console.error(err);
			process.exit(1);
		} else {
			offset += 100;
			numRequests = Math.ceil(data.number_of_total_results / 100);
			const issues = data.results;
			totalImported += issues.length;
			for (let issue of issues) insertIssue(issue);
			for (let i = 1; i < numRequests; ++i) {
				getIssues(volume, offset, (err, data) => {
					if (err) {
						console.error(err);
						process.exit(1);
					} else {
						offset += 100;
						const issues = data.results;
						totalImported += issues.length;
						for (let issue of issues) insertIssue(issue);
						console.log(totalImported);
					}
				});
			}
		}
	});
});
