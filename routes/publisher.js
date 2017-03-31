const mongojs = require('mongojs');
const db = mongojs('shelf');
const async = require('async');

module.exports = function (site) {
	const express = require('express');
	const router = express.Router();

	router.get('/', (req, res) => {
		db.publishers.find({}).sort({
			'name': 1
		}, (err, docs) => {
			if (err) {
				res.redirect('/error');
			} else {
				async.each(docs, (publisher, callback) => {
					db.issues.find({
						'publisher._id': publisher._id
					}).sort({ '_id': -1 }).limit(10, (err, docs) => {
						if (!err) {
							publisher.issues = docs;
							callback();
						}
					});
				}, (err) => {
					if (err) {
						res.render('publisher/index.njk', {
							site: site,
							page: {
								title: 'Publishers'
							},
							publishers: docs
						});
					} else {
						res.render('error.njk');
					}
				});
			}
		});
	});

	return router;
};
