module.exports = (config, passport) => {
	// Required modules
	const express	= require('express');

	const router = express.Router();

	// Google auth
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

	// Facebook auth
	router.get('/facebook', passport.authenticate('facebook', {
		scope: [
			'public_profile',
			'email'
		]
	}));

	router.get('/facebook/callback', passport.authenticate('facebook', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));

	// Twitter auth
	router.get('/twitter', passport.authenticate('twitter'));

	router.get('/twitter/callback', passport.authenticate('twitter', {
		successRedirect: '/profile',
		failureRedirect: '/'
	}));

	return router;
};
