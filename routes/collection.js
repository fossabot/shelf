const mongojs = require('mongojs');
const db = mongojs('shelf');
const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({ extended: false });

function populateSeriesIDs (formObject, callback) {
	formObject.seriesID = [];
	for (var i = 0; i < formObject.seriesName.length; ++i) {
		console.log(i);
		db.series.findOne({
			title: formObject.seriesName[i]
		}, (err, doc) => {
			if (err) {
				callback(err);
			} else if (doc !== null) {
				console.log('series found');
				// Series already exists
				formObject.seriesID.push(doc._id);
				if (i === formObject.seriesName.length - 1) {
					callback(null, formObject);
				}
			} else {
				console.log('series not found');
				// Series does not yet exist
				formObject.seriesID.push(-1);
				// TODO FILL OUT LATER
				if (i === formObject.seriesName.length - 1) {
					callback(null, formObject);
				}
			}
		});
	}
}

function populatePublisherIDs (formObject, callback) {
	formObject.publisherID = [];
	for (var i = 0; i < formObject.seriesPublisher.length; ++i) {
		db.publishers.findOne({
			name: formObject.seriesPublisher[i]
		}, (err, doc) => {
			if (err) {
				callback(err);
			} else if (doc !== null) {
				console.log('publisher found');
				// Publisher already exists
				formObject.publisherID.push(doc._id);
				if (i === formObject.seriesPublisher.length - 1) {
					callback(null, formObject);
				}
			} else {
				console.log('publisher not found');
				// Publisher does not yet exist
				formObject.publisherID.push(-1);
				// TODO FILL OUT LATER
				if (i === formObject.seriesPublisher.length - 1) {
					callback(null, formObject);
				}
			}
		});
	}
}

function populateObjects (formObject, callback) {
	var objsArr = [];
	for (var i = 0; i < formObject.seriesName.length; ++i) {
		var numsArr = formObject.issueNumbers[i].split(',');
		for (var j = 0; j < numsArr.length; ++j) {
			var rangeArr = numsArr[j].split('-');
			for (var k = rangeArr[0]; k <= rangeArr[rangeArr.length - 1]; ++k) {
				objsArr.push({
					series: {
						slug: formObject.seriesName[i].toLowerCase().replace(' ', '-'),
						title: formObject.seriesName[i],
						volume: formObject.seriesVolume[i]
					},
					publisher: {
						name: formObject.seriesPublisher[i]
					},
					number: k,
					collectionStatus: formObject.collectionStatus[i]
				});
				if (i === formObject.seriesName.length - 1 && j === numsArr.length - 1 && k === Number(rangeArr[rangeArr.length - 1])) {
					callback(objsArr);
				}
			}
		}
	}
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
			// Single entry
			res.send('single');
		} else {
			populateSeriesIDs(req.body, (err, objsArr) => {
				if (err) {
					res.send('error finding series');
					console.log(err);
				} else {
					populatePublisherIDs(objsArr, (err, objsArr) => {
						if (err) {
							res.send('error finding publishers');
							console.log(err);
						} else {
							populateObjects(objsArr, (objsArr) => {
								res.send('<pre>' + JSON.stringify(objsArr, null, 2) + '</pre>');
							});
						}
					});
				}
			});
		}
		// res.send('<pre>' + JSON.stringify(req.body, null, 2) + '</pre>');
		// res.redirect('/');
	});

	return router;
};
