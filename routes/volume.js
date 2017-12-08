module.exports = (config) => {
	// Required modules
	const express	= require('express');
	const mongojs	= require('mongojs');

	// Connect to the db
	const connection = config.database.host + ':' + config.database.port + '/' + config.database.name;
	const db = mongojs(connection);

	// Create our router
	const router = express.Router();

	router.get('/:volumeID', (req, res) => {
		const id = Number(req.params.volumeID);
		db.volumes.aggregate([
			{
				$match: {
					id
				}
			},
			{
				$lookup: {
					from: 'publishers',
					localField: 'publisher.id',
					foreignField: 'id',
					as: 'publisher'
				}
			},
			{
				$unwind: {
					path: '$publisher'
				}
			},
			{
				$lookup: {
					from: 'issues',
					localField: 'id',
					foreignField: 'volume.id',
					as: 'issues'
				}
			}
		], (err, volume) => {
			if (err || volume.length < 1) {
				if (err) console.error(err);
				res.render('pages/error.njk', {
					site: config.site,
					status: err ? 500 : 404
				});
			} else {
				// Gets returned as an array, but we just need the first element (there
				// should only be one element anyway)
				volume = volume[0];
				// Show the page already!
				res.render('pages/volume.njk', {
					site: config.site,
					comicvineURL: config.api.comicvine.url.base,
					volume,
					referer: req.headers.referer
				});
			}
		});
	});

	// Return the router
	return router;
};
