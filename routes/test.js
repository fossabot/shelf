module.exports = (config) => {
	// Required modules
	const express	= require('express');
	const request	= require('request');

	// Create our router
	const router = express.Router();

	// Our default request function
	const getData = (callback) => {

	};

	// Our test routes
	router.get('/', (req, res) => {
		client.collections.pageSize = 20;
		client.collections.Characters.fetch
		res.render('test.njk', {
			site: config.site
		});
	});

	return router;
};
