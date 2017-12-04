module.exports = (config) => {
	// Needed modules
	const express	= require('express');
	const mongojs	= require('mongojs');

	// Connect to the db
	const connection = config.database.host + ':' + config.database.port + '/' + config.database.name;
	const db = mongojs(connection);

	// Create our router
	const router = express.Router();

	// Our issue detail route
	router.get('/:id', (req, res) => {
		// Convert the ID to an actual number
		const issueID = Number(req.params.id);
		// Then do our lookup
		db.issues.aggregate([
			// First, just find the issue
			{
				$match: {
					id: issueID
				}
			},
			// Then, find the associated volume
			{
				$lookup: {
					from: 'volumes',
					localField: 'volume.id',
					foreignField: 'id',
					as: 'volume'
				}
			},
			// The volume gets put in an array, so we have to unwind out of it
			{
				$unwind: {
					path: '$volume'
				}
			},
			// Then, find the publisher
			{
				$lookup: {
					from: 'publishers',
					localField: 'volume.publisher.id',
					foreignField: 'id',
					as: 'volume.publisher'
				}
			},
			// Gotta unwind this too
			{
				$unwind: {
					path: '$volume.publisher'
				}
			}
		], (err, issue) => {
			if (err || issue.length < 1) {
				res.render('pages/error.njk', {
					site: config.site,
					status: err ? 500 : 404
				});
			} else {
				// Gets returned as an array, but we just need the first element (there
				// should only be one element anyway)
				issue = issue[0];
				// Show the page already!
				res.render('pages/issue.njk', {
					site: config.site,
					comicvineURL: config.api.comicvine.url.base,
					issue,
					referer: req.headers.referer
				});
			}
		});
	});

	return router;
};
