const mongojs = require('mongojs');
const db = mongojs('shelf');

module.exports = function (site) {
	const express = require('express');
	const router = express.Router();

	// Root series request, serves up list of series
	router.get('/', (req, res) => {
		db.series.find({}, (err, records) => {
			if (err) {
				res.render('error.njk');
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

	// Series volume request, serves up list of series' volumes
	router.get('/[a-z0-9-]+(?:/vol/?)?', (req, res) => {
		const seriesSlug = req.url.split('/')[1];
		db.series.findOne({
			'slug': seriesSlug
		}, (err, series) => {
			if (err) {
				res.render('error.njk');
			} else if (series !== null) {
				db.issues.find({
					'series._id': series._id
				}).sort({ number: 1 }, (err, issues) => {
					if (err) {
						res.render('error.njk');
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
				// TODO
				res.send('series not found: ' + seriesSlug);
			}
		});
	});

	// Series volume detail request, serves up list of issues in series' volume
	router.get('/[a-z0-9-]+/vol/[0-9]+/?', (req, res) => {
		const seriesSlug = req.url.split('/')[1];
		const volNum = Number(req.url.split('/')[3]);
		db.issues.find({
			'series.slug': seriesSlug,
			'series.volume': volNum
		}).sort({ number: 1 }, (err, docs) => {
			if (err) {
				res.render('error.njk');
			} else if (docs.length < 1) {
				// TODO
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

	// Series issue request, serves up issue detail
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
				res.render('error.njk');
			} else if (issue === null) {
				// TODO
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
