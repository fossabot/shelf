// Required modules
const express = require('express');

module.exports = (config) => {
	// Create router
	const router = express.Router();

	// Function for handling error requests
	const errorHandler = (req, res) => {
		const status = req.params.status || '404';
		res.render('pages/error.njk', {
			site: config.site,
			status
		});
	};

	router.get('/:status', errorHandler);
	router.get(/.*/, errorHandler);	// Must be last, catches everything that doesn't have a route

	// Return router
	return router;
};
