module.exports = (config) => {
	// Needed modules
	const express	= require('express');
	const mongojs	= require('mongojs');

	// Connect to the db
	const db = mongojs(config.database.host + ':' + config.database.port + '/' + config.database.name);

	// Create our router
	const router = express.Router();

	// Our home route
	router.get('/', (req, res) => {
		db.issues.find({}).limit(14, (err, docs) => {
			if (err) console.error(err);
			res.render('index.njk', {
				site: config.site,
				issues: docs,
				comicvineURL: config.api.comicvine.url.base
			});
		});
	});

	return router;
};
