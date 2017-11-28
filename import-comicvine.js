// Import config
const config = require('./config.json');

// Import modules
const mongojs	= require('mongojs');
const comicvine	= require('./modules/comicvine')(config.api.comicvine);

// Connect to database
const db = mongojs('shelf');

// Caching function
const cache = (collection, object, callback = () => {}) => {
	db.collection(collection).findOne({
		id: object.id
	}, (err, doc) => {
		if (err) console.error(err);
		if (doc) console.error(collection + ' already cached');
		if (!doc) {
			db.collection(collection).insert(object, (err, doc) => {
				if (err) console.error(err);
				if (doc) console.log(collection + ' ' + object.id + ' inserted');
				callback(err);
			});
		}
	});
};

// Let's get going!
// Volume IDs
const volumeIDs = [
	3519,		// Web of Spider-Man
	2045,		// Fantastic Four
	18937,	// Star Wars: Knights of the Old Republic
	85128,	// Paper Girls
	95402		// Avengers
];
// Loop through each ID
volumeIDs.forEach((volumeID) => {
	// Get the volume
	comicvine.getVolumeByID(volumeID, (err, volume) => {
		if (err) {
			console.error(err);
		} else {
			// Cache the volume
			cache('volumes', volume);
			// Get the volume's publisher
			comicvine.getPublisherByID(volume.publisher.id, (err, publisher) => {
				if (err) {
					console.error(err);
				} else {
					// Cache the publisher
					cache('publishers', publisher);
				}
			});
		}
	});
	// Get the Issue IDs
	comicvine.getIssues({
		limit: 35,
		sort: 'cover_date:asc',
		fieldList: 'id',
		format: 'json',
		filter: 'volume:' + volumeID
	}, (err, issues) => {
		if (err) {
			console.error(err);
		} else {
			// Loop through each of the issue IDs
			issues.forEach((issue) => {
				// Check if we have the issue already
				db.issues.findOne({ id: issue.id }, (err, doc) => {
					if (err) console.log('problem searching DB for issue ' + issue.id);
					if (!doc) {
						// If it's not in the DB, get the issue
						comicvine.getIssueByID(issue.id, (err, issue) => {
							if (err) {
								console.error(err);
							} else {
								// Cache the issue
								cache('issues', issue);
							}
						});
					}
				});
			});
		}
	});
});
