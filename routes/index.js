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
		db.issues.find({}).limit(15, (err, docs) => {
			if (err) console.error(err);
			res.render('index.njk', {
				site: config.site,
				issues: docs,
				comicvineURL: config.api.comicvine.url.base
			});
		});
	});

	// About Route
	router.get('/about', (req, res) => {
		res.render('pages/about.njk', {
			site: config.site
		});
	});

	// Privacy Route
	router.get('/privacy', (req, res) => {
		res.render('pages/privacy.njk', {
			site: config.site
		});
	});

	// Legal Route
	router.get('/legal', (req, res) => {
		res.render('pages/legal.njk', {
			site: config.site
		});
	});

	// Login Route
	router.get('/login', (req, res) => {
		res.render('pages/login.njk', {
			site: config.site
		});
	});

	// Register Route
	router.get('/register', (req, res) => {
		res.render('pages/register.njk', {
			site: config.site
		});
	});

	return router;
};
