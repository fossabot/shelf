// Required modules
const express = require('express');
const cel			= require('connect-ensure-login');

module.exports = (config, passport) => {
	// Create router
	const router = express.Router();

	// Shortcut for forcing login
	const mustBeLoggedIn = cel.ensureLoggedIn('/profile/login');

	// Main profile route
	router.get('/', mustBeLoggedIn, (req, res) => {
		res.render('pages/profile.njk', {
			site: config.site,
			user: req.user[req.user.type]
		});
	});

	// Register
	router.get('/register', (req, res) => {
		res.render('pages/register.njk', {
			site: config.site,
			messages: req.flash('registerMessage')
		});
	});

	router.post('/register', passport.authenticate('local-register', {
		successRedirect: '/profile',
		failureRedirect: '/profile/register',
		failureFlash: true
	}));

	// Login
	router.get('/login', (req, res) => {
		res.render('pages/login.njk', {
			site: config.site,
			messages: req.flash('loginMessage')
		});
	});

	router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// Logout
	router.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	// Return router
	return router;
};
