// Import Required Modules
const express		= require('express');
const nunjucks	= require('nunjucks');
const path			= require('path');
const app = express();

// Load site config
const config = require(path.join(__dirname, 'config.json'));

// Turn on public folder
app.use(express.static('public', {index: false}));

// Get nunjucks going
nunjucks.configure('templates', {
	autoescape: true,
	noCache: true,
	express: app
});

// Routes
const routes = {
	index: require(path.join(__dirname, 'routes/index'))(config),
	test: require(path.join(__dirname, 'routes/test'))(config)
};
app.use('/', routes.index);
app.use('/test', routes.test);

// Pages route, to be removed later
app.get('/[a-z-]+', (req, res) => {
	var urlArray = req.url.split('/');
	res.render('pages/' + urlArray[1] + '.njk');
});

app.listen(config.devMode ? config.port.dev : config.port.prod);
