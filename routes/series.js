const mongojs = require('mongojs');
const db = mongojs('shelf');

module.exports = function (site) {
	const express = require('express');
	const router = express.Router();

	router.get('/', (req, res) => {
		db.series.find({}, (err, records) => {
			if (err) {
				console.log(err);
				res.send(JSON.stringify(err));
			} else {
				res.render('series/list.njk', {
					site: site,
					page: {
						title: 'Series'
					},
					series: records
				});
			}
		});
	});

	router.get('/[a-z0-9-]+(?:\/vol\/?)?', (req, res) => {
		const seriesTitle = req.url.split('/')[1];
		db.series.findOne({
			'slug': seriesTitle
		}, (err, series) => {
			if (err) {
				console.log(err);
				res.send(JSON.stringify(err));
			} else if (series !== null) {
				db.issues.find({
					'series._id': series._id
				}, (err, issues) => {
					if (err) {
						console.log(err);
						res.send(JSON.stringify(err));
					} else {
						res.render('series/detail.njk', {
							site: site,
							page: {
								title: series.title
							},
							series: series,
							issues: issues
						});
					}
				});
			} else {
				res.send('series not found: ' + seriesTitle);
			}
		});
	});

	router.get('/[a-z0-9-]+/vol/[0-9]+/[0-9]+', (req, res) => {
		const seriesSlug = req.url.split('/')[1];
		const volNum = Number(req.url.split('/')[3]);
		const issueNum = Number(req.url.split('/')[4]);
		db.issues.findOne({
			'series.slug': seriesSlug,
			'series.volume': volNum,
			'number': issueNum
		}, (err, issue) => {
			if (err) {
				console.log(err);
				res.send(JSON.stringify(err));
			} else if (issue === null) {
				res.send('issue not found: ' + seriesSlug + ' Vol. ' + volNum + ' #' + issueNum);
			} else {
				res.render('issue/detail.njk', {
					site: site,
					page: {
						title: issue.title
					},
					issue: issue
				});
			}
		});
	});

	return router;
};
