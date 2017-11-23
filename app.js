// Import Required Modules
const express			= require('express');
const nunjucks		= require('nunjucks');
const dateFilter	= require('nunjucks-date-filter');
const path				= require('path');

// Create our application
const app = express();

// Load site config
const config = require(path.join(__dirname, 'config.json'));

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
	test: require(path.join(__dirname, 'routes/test'))(config)
};
app.use('/', routes.index);
app.use('/issue', routes.issue);
app.use('/test', routes.test);

// Pages route, to be removed later
app.get('/[a-z-]+', (req, res) => {
	var urlArray = req.url.split('/');
	res.render('pages/' + urlArray[1] + '.njk');
});

app.listen(config.devMode ? config.port.dev : config.port.prod);
