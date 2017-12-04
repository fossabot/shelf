// Required modules
const express = require('express');

module.exports = (config) => {
	// Create router
	const router = express.Router();

	// Main profile route
	router.get('/', (req, res) => {
		res.render('pages/profile.njk', {
			site: config.site
		});
	});

	// Return router
	return router;
};
