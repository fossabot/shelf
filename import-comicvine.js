// Import modules
const mongojs	= require('mongojs');
const request	= require('request');
const async		= require('async');

// Connect to database
const db = mongojs('shelf');

// Import config
const config = require('./config.json');
const comicvine = config.api.comicvine;

// Construct comicvine URL
const genComicVineURL = (resource, addURL) => comicvine.url.base + '/' + resource + (addURL ? '/' + addURL : '') + '?format=json&api_key=' + comicvine.key;

// Issue list getter function
const getIssues = (volumeID, callback) => {
	const url = genComicVineURL('issues') + '&field_list=id&filter=volume:' + volumeID;
	request.get({
		url,
		headers: {
			'User-Agent': comicvine.userAgent
		}
	}, (err, response, body) => {
		if (err) {
			callback(err);
		} else {
			callback(null, JSON.parse(body).results);
		}
	});
};

// Issue caching function
const cacheIssue = (issue, callback) => {
	db.issues.findOne({
		id: issue.id
	}, (err, doc) => {
		if (err) console.error(err);
		if (doc) console.error('Issue already cached');
		if (!doc) {
			db.issues.insert(issue, (err, doc) => {
				if (err) console.error(err);
				if (doc) console.log('Issue ' + issue.id + ' inserted');
				callback(err);
			});
		}
	});
};

// Issue getter function
const getIssue = (issueID, callback) => {
	const url = genComicVineURL('issue', '4000-' + issueID);
	request.get({
		url,
		headers: {
			'User-Agent': comicvine.userAgent
		}
	}, (err, response, body) => {
		if (err) {
			callback(err);
		} else if (body) {
			cacheIssue(JSON.parse(body).results, callback);
		}
	});
};

// Let's get going!
async.waterfall([
	(callback) => {
		// Volume IDs
		const volumes = [
			55330,	// Hickman's New Avengers run
			85076,	// Slott's current Amazing Spider-Man run
			86408,	// Totally Awesome Hulk
			95596,	// Invincible Iron Man
			85128		// Paper Girls
		];
		// Issue IDs array, to be populated later
		let issues = [];
		async.each(volumes, (volume, doneWithVolume) => {
			getIssues(volume, (err, issuesArr) => {
				if (err) {
					doneWithVolume(err);
				} else {
					async.each(issuesArr, (issue, doneWithIssue) => {
						issues.push(issue.id);
						doneWithIssue();
					}, doneWithVolume);
				}
			});
		}, (err) => {
			if (err) {
				callback(err);
			} else {
				callback(null, issues);
			}
		});
	},
	(issues, callback) => {
		async.each(issues, (issue, doneWithIssue) => {
			getIssue(issue);
			doneWithIssue();
		}, callback);
	}
], (err) => {
	if (err) console.error(err);
});
