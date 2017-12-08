module.exports = (config, passport) => {
	// Required modules
	const express	= require('express');

	const router = express.Router();

	router.get('/google', passport.authenticate('google', {
		scope: [
			'profile',
			'email'
		]
	}));

	router.get('/google/callback', passport.authenticate('google', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));

	return router;
};
