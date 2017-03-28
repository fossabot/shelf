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
		const seriesSlug = req.url.split('/')[1];
		db.series.findOne({
			'slug': seriesSlug
		}, (err, series) => {
			if (err) {
				console.log(err);
				res.send(JSON.stringify(err));
			} else if (series !== null) {
				db.issues.find({
					'series._id': series._id
				}).sort({ publicationDate: 1 }).limit(25, (err, issues) => {
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
				res.send('series not found: ' + seriesSlug);
			}
		});
	});

	router.get('/[a-z0-9-]+/vol/[0-9]+/?', (req, res) => {
		const seriesSlug = req.url.split('/')[1];
		const volNum = Number(req.url.split('/')[3]);
		db.issues.find({
			'series.slug': seriesSlug,
			'series.volume': volNum
		}).sort({ publicationDate: 1 }).limit(25, (err, docs) => {
			if (err) {
				console.log(err);
				res.send(JSON.stringify(err));
			} else if (docs.length < 1) {
				res.send('no issues found');
			} else {
				res.render('series/volume-detail.njk', {
					site: site,
					page: {
						title: docs[0].series.title
					},
					series: {
						title: docs[0].series.title,
						volume: docs[0].series.volume
					},
					issues: docs
				});
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
