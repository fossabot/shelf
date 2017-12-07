module.exports = (config) => {
	// Required modules
	const express	= require('express');
	const mongojs	= require('mongojs');

	// Create router
	const router = express.Router();

	// Connect to the db
	const connection = config.database.host + ':' + config.database.port + '/' + config.database.name;
	const db = mongojs(connection);

	// Volume detail route
	router.get('/:id', (req, res) => {
		const id = Number(req.params.id);
		db.volumes.aggregate([
			// First, just find the volume
			{
				$match: {
					id
				}
			},
			// Then, find the publisher
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
			// Then, grab its issues
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
				res.render('pages/error.njk', {
					site: config.site,
					status: err ? 500 : 404
				});
			} else {
				volume = volume[0];
				console.log(volume);
				res.render('pages/volume.njk', {
					site: config.site,
					comicvineURL: config.api.comicvine.url.base,
					volume,
					referer: req.headers.referer
				});
			}
		});
	});

	// Return router
	return router;
};
