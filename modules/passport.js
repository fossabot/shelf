// Required modules
const LocalStrategy			= require('passport-local').Strategy;
const GoogleStrategy		= require('passport-google-oauth20').Strategy;
const FacebookStrategy	= require('passport-facebook').Strategy;
const TwitterStrategy		= require('passport-twitter').Strategy;
const path							= require('path');

module.exports = (config, passport) => {
	// Pull in our User model
	const User = require(path.join(config.baseDir, 'models/user.js'));

	// Serialize the user
	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	// Deserialize the user
	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => {
			done(err, user);
		});
	});

	// Local Registration
	passport.use('local-register', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, (req, email, password, done) => {
		process.nextTick(() => {
			User.findOne({
				'local.email': email
			}, (err, user) => {
				if (err) return done(err);
				if (user) {
					return done(null, false, req.flash('registerMessage', 'There is already an account registered under ' + email));
				} else {
					const newUser = new User();
					newUser.type = 'local';
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.save((err) => {
						if (err) console.error(err);
						return done(null, newUser);
					});
				}
			});
		});
	}));

	// Local login
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	}, (req, email, password, done) => {
		User.findOne({
			'local.email': email
		}, (err, user) => {
			if (err) return done(err);
			if (!user || !user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Incorrect user/password.'));
			} else {
				return done(null, user);
			}
		});
	}));

	// Google Auth
	passport.use(new GoogleStrategy({
		clientID: config.auth.google.client_id,
		clientSecret: config.auth.google.client_secret,
		callbackURL: config.auth.google.redirect_uri
	}, (token, refreshToken, profile, done) => {
		process.nextTick(() => {
			User.findOne({
				'google.id': profile.id
			}, (err, user) => {
				if (err) return done(err);
				if (user) {
					return done(null, user);
				} else {
					const newUser = new User();
					newUser.type = 'google';
					newUser.google.id = profile.id;
					newUser.google.token = token;
					newUser.google.name = profile.displayName;
					newUser.google.email = profile.emails[0].value;

					newUser.save((err) => {
						if (err) console.error(err);
						return done(null, newUser);
					});
				}
			});
		});
	}));

	// Facebook auth
	passport.use(new FacebookStrategy({
		clientID: config.auth.facebook.clientID,
		clientSecret: config.auth.facebook.clientSecret,
		callbackURL: config.auth.facebook.callbackURL,
		profileFields: [
			'id',
			'displayName',
			'email'
		]
	}, (token, refreshToken, profile, done) => {
		process.nextTick(() => {
			User.findOne({
				'facebook.id': profile.id
			}, (err, user) => {
				if (err) return done(err);
				if (user) {
					return done(null, user);
				} else {
					const newUser = new User();
					newUser.type = 'facebook';
					newUser.facebook.id = profile.id;
					newUser.facebook.token = token;
					newUser.facebook.name = profile.displayName;
					newUser.facebook.email = profile.emails[0].value;
					newUser.save((err) => {
						if (err) console.error(err);
						return done(null, newUser);
					});
				}
			});
		});
	}));

	// Twitter auth
	passport.use(new TwitterStrategy({
		consumerKey: config.auth.twitter.consumerKey,
		consumerSecret: config.auth.twitter.consumerSecret,
		callbackURL: config.auth.twitter.callbackURL
	}, (token, tokenSecret, profile, done) => {
		process.nextTick(() => {
			User.findOne({
				'twitter.id': profile.id
			}, (err, user) => {
				if (err) return done(err);
				if (user) {
					return done(null, user);
				} else {
					const newUser = new User();
					newUser.type = 'twitter';
					newUser.twitter.id = profile.id;
					newUser.twitter.token = token;
					newUser.twitter.username = profile.username;
					newUser.twitter.displayName = profile.displayName;
					newUser.save((err) => {
						if (err) console.error(err);
						return done(null, newUser);
					});
				}
			});
		});
	}));
};
