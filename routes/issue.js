module.exports = (config) => {
	// Needed modules
	const express	= require('express');
	const mongojs	= require('mongojs');

	// Connect to the db
	const connection = config.database.host + ':' + config.database.port + '/' + config.database.name;
	const db = mongojs(connection);

	// Create our router
	const router = express.Router();

	// Our home route
	router.get('/:id', (req, res) => {
		db.issues.findOne({
			id: Number(req.params.id)
		}, (err, issue) => {
			if (err) {
				res.render('pages/error.njk', {
					site: config.site,
					status: 500
				});
			} else {
				db.volumes.findOne({
					id: issue.volume.id
				}, (err, volume) => {
					if (err) {
						res.render('pages/error.njk', {
							site: config.site,
							status: 500
						});
					} else {
						db.publishers.findOne({
							id: volume.publisher.id
						}, (err, publisher) => {
							if (err) {
								res.render('pages/error.njk', {
									site: config.site,
									status: 500
								});
							} else {
								res.render('pages/issue.njk', {
									site: config.site,
									comicvineURL: config.api.comicvine.url.base,
									issue,
									volume,
									publisher
								});
							}
						});
					}
				});
			}
		});
	});

	return router;
};
