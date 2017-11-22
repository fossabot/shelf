module.exports = (config) => {
	// Needed modules
	const express	= require('express');

	// Create our router
	const router = express.Router();

	// Our home route
	router.get('/', (req, res) => {
		res.render('index.njk');
	});

	return router;
};
