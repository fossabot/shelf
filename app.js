// Import Required Modules
const express			= require('express');
const nunjucks		= require('nunjucks');
const dateFilter	= require('nunjucks-date-filter');
const path				= require('path');

// Create our application
const app = express();

// Load site and package config
const config = require(path.join(__dirname, 'config.json'));
config.site.package = require(path.join(__dirname, 'package.json'));

// Turn on public folder
app.use(express.static('public', {index: false}));

// Get nunjucks going
const env = nunjucks.configure('views', {
	autoescape: false,
	noCache: true,
	express: app
});
env.addFilter('date', dateFilter);

// Routes
const routes = {
	index: require(path.join(__dirname, 'routes/index'))(config),
	issue: require(path.join(__dirname, 'routes/issue'))(config),
	volume: require(path.join(__dirname, 'routes/volume'))(config),
	profile: require(path.join(__dirname, 'routes/profile'))(config),
	imageCache: require(path.join(__dirname, 'routes/imageCache'))(config),
	error: require(path.join(__dirname, 'routes/error'))(config)
};
app.use('/', routes.index);
app.use('/issue', routes.issue);
app.use('/volume', routes.volume);
app.use('/profile', routes.profile);
app.use('/image', routes.imageCache);
app.use('/error', routes.error);
app.use(/.*/, routes.error);	// MUST BE LAST!!!

// And finally, let's listen in
const port = config.devMode ? config.port.dev : config.pord.prod;
app.listen(port, () => {
	console.log(config.site.title + ' listening on port ' + port);
});
