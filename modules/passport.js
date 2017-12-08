// Required modules
const GoogleStrategy	= require('passport-google-oauth20').Strategy;
const path						= require('path');

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
};
