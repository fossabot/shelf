const mongojs = require('mongojs');
const db = mongojs('shelf');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const async = require('async');

function getPublisherID (object, callback) {
	db.publishers.findOne({
		'slug': object.publisher.slug
	}, (err, doc) => {
		if (err) {
			// There was an error
			object.publisher._id = -1;
			callback(object, err);
		} else if (doc) {
			// Grab the existing id
			object.publisher._id = mongojs.ObjectId(doc._id);
			callback(object);
		} else {
			// Insert and use the new id
			db.publishers.insert({
				'slug': object.publisher.slug,
				'name': object.publisher.name
			}, (err, doc) => {
				if (err) {
					object.publisher._id = -1;
					callback(object, err);
				} else {
					object.publisher._id = mongojs.ObjectId(doc._id);
					callback(object);
				}
			});
		}
	});
}

function getSeriesID (object, callback) {
	db.series.findOne({
		'slug': object.series.slug
	}, (err, doc) => {
		if (err) {
			// There was an error
			object.series._id = -1;
			callback(err);
		} else if (doc) {
			// Grab the existing id
			object.series._id = mongojs.ObjectId(doc._id);
			callback();
		} else {
			// Insert and use the new id
			db.series.insert({
				'slug': object.series.slug,
				'title': object.series.title,
				'publisher': {
					'_id': mongojs.ObjectId(object.publisher._id),
					'slug': object.publisher.slug,
					'name': object.publisher.name
				}
			}, (err, doc) => {
				if (err) {
					object.series._id = -1;
					callback(err);
				} else {
					object.series._id = mongojs.ObjectId(doc._id);
					callback();
				}
			});
		}
	});
}

module.exports = function (site) {
	const express = require('express');
	const router = express.Router();

	router.get('/', (req, res) => {
		var wantArray = [];
		var ownArray = [];
		db.issues.find({
			$or: [
				{
					'collectionStatus': 'own'
				},
				{
					'collectionStatus': 'want'
				}
			]
		}).sort({ 'publicationDate': 1 }).limit(100, (err, docs) => {
			if (err) {
				console.log(err);
				res.send(JSON.stringify(err));
			} else if (docs.length < 1) {
				res.send('no issues found');
			} else {
				var iteration = 0;
				docs.forEach((issue, index, array) => {
					if (issue.collectionStatus === 'own') {
						ownArray.push(issue);
					} else if (issue.collectionStatus === 'want') {
						wantArray.push(issue);
					}
					++iteration;
					if (iteration === docs.length) {
						res.render('collection/list.njk', {
							site: site,
							page: {
								title: 'Collection'
							},
							collection: {
								want: wantArray,
								own: ownArray
							}
						});
					}
				});
			}
		});
	});

	router.post('/', urlEncodedParser, (req, res) => {
		if (typeof req.body.seriesName === 'string') {
			req.body.seriesName = [req.body.seriesName];
			req.body.seriesVolume = [req.body.seriesVolume];
			req.body.seriesPublisher = [req.body.seriesPublisher];
			req.body.issueNumbers = [req.body.issueNumbers];
			req.body.collectionStatus = [req.body.collectionStatus];
		}
		var objsArray = [];
		var finalObjsArray = [];
		for (var i = 0; i < req.body.seriesName.length; ++i) {
			objsArray.push({
				'numbers': req.body.issueNumbers[i],
				'series': {
					'slug': req.body.seriesName[i].toLowerCase().replace(/[:!]/g, '').replace(/\s/g, '-'),
					'title': req.body.seriesName[i],
					'volume': Number(req.body.seriesVolume[i])
				},
				'publisher': {
					'slug': req.body.seriesPublisher[i].toLowerCase().replace(' comics', '').replace(/\s/g, '-'),
					'name': req.body.seriesPublisher[i]
				},
				'collectionStatus': req.body.collectionStatus[i]
			});
		}
		async.each(objsArray, (object, outerCallback) => {
			getPublisherID(object, (object, err) => {
				if (err) {
					outerCallback(err);
				} else {
					getSeriesID(object, (err) => {
						if (err) {
							outerCallback(err);
						} else {
							var numsArr = object.numbers.split(',');
							async.each(numsArr, (nums, innerCallback) => {
								var start, end;
								if (nums.indexOf('-') !== -1) {
									start = Number(nums.split('-')[0]);
									end = Number(nums.split('-')[1]);
								} else {
									start = Number(nums);
									end = Number(nums);
								}
								for (var i = start; i <= end; ++i) {
									finalObjsArray.push({
										'series': object.series,
										'publisher': object.publisher,
										'collectionStatus': object.collectionStatus,
										'number': i
									});
									if (i === end) innerCallback();
								}
							}, (err) => {
								outerCallback(err);
							});
						}
					});
				}
			});
		}, (err) => {
			if (err) {
				console.log(err);
				res.redirect('/error');
			} else {
				db.issues.insert(finalObjsArray, (err) => {
					if (err) {
						res.redirect('/error');
					} else {
						res.redirect('/');
					}
				});
			}
		});
		// res.send('<pre>' + JSON.stringify(req.body, null, 2) + '</pre>');
		// res.redirect('/');
	});

	return router;
};
