module.exports = (config) => {
	// Needed modules
	const express		= require('express');
	const mongoose	= require('mongoose');
	const path			= require('path');
	const Issue			= require(path.join(config.baseDir, 'models/comic/issue.js'));

	// Connect to the db
	mongoose.Promise = require('bluebird');
	mongoose.connect('mongodb://' + config.database.host + ':' + config.database.port + '/' + config.database.name, {
		useMongoClient: true
	});

	// Create our router
	const router = express.Router();

	// Our home route
	router.get('/', (req, res) => {
		Issue.find({}).limit(15).exec((err, issues) => {
			if (err) console.error(err);
			res.render('index.njk', {
				site: config.site,
				issues,
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
