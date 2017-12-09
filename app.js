// Import Required Modules
const express			= require('express');
const nunjucks		= require('nunjucks');
const dateFilter	= require('nunjucks-date-filter');
const path				= require('path');
const gulp				= require('gulp');
const concat			= require('gulp-concat');
const minify			= require('gulp-minify');
const pump				= require('pump');
const passport		= require('passport');
const flash				= require('connect-flash');
const bodyParser	= require('body-parser');
const session			= require('express-session');
const MongoStore	= require('connect-mongo')(session);

// Create our application
const app = express();

// Load site and package config
const config = require(path.join(__dirname, 'config.json'));
config.baseDir = __dirname;
config.site.package = require(path.join(__dirname, 'package.json'));

// Turn on public folder
app.use(express.static('public', {
	index: false
}));

// Get nunjucks going
const env = nunjucks.configure('views', {
	autoescape: false,
	noCache: true,
	express: app
});
env.addFilter('date', dateFilter);

// Minify our scripts
pump([
	gulp.src(path.join(__dirname, 'scripts/**/*.js')),
	concat('main.js'),
	minify({
		ext: {
			src: '.js',
			min: '.min.js'
		}
	}),
	gulp.dest(path.join(__dirname, 'public/js'))
]);

// Setup express app
app.use(bodyParser.urlencoded({
	extended: true
}));

// Passport
require(path.join(__dirname, 'modules/passport'))(config, passport);
app.use(session({
	secret: config.sessionSecret,
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({
		url: 'mongodb://' + config.database.host + ':' + config.database.port + '/' + config.database.name
	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
const routes = {
	index: require(path.join(__dirname, 'routes/index'))(config),
	issue: require(path.join(__dirname, 'routes/issue'))(config),
	volume: require(path.join(__dirname, 'routes/volume'))(config),
	profile: require(path.join(__dirname, 'routes/profile'))(config, passport),
	auth: require(path.join(__dirname, 'routes/auth'))(config, passport),
	imageCache: require(path.join(__dirname, 'routes/imageCache'))(config),
	error: require(path.join(__dirname, 'routes/error'))(config)
};
app.use('/', routes.index);
app.use('/issue', routes.issue);
app.use('/volume', routes.volume);
app.use('/profile', routes.profile);
app.use('/auth', routes.auth);
app.use('/image', routes.imageCache);
app.use('/error', routes.error);
app.use(/.*/, routes.error);	// MUST BE LAST!!!

// And finally, let's listen in
const port = config.devMode ? config.port.dev : config.pord.prod;
app.listen(port, () => {
	console.log(config.site.title + ' listening on port ' + port);
});
