// Import Required Modules
const express			= require('express');
const nunjucks		= require('nunjucks');
const dateFilter	= require('nunjucks-date-filter');
const path				= require('path');
const fs					= require('fs');
const request			= require('request');
const Stream			= require('stream');
const mime				= require('mime/lite');
const mkdirp			= require('mkdirp');

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

// Image cacher route
app.get(/\/image(?:\/.*)\.[^.]+$/, (req, res) => {
	// Get the file extension
	const fileExt = req.url.match(/\.[^.]+$/);
	// Determine the mime-type
	const fileType = mime.getType(fileExt);
	if (fileType) {
		// If it's a valid type, let's try and get it
		const newReq = request.get({
			uri: config.api.comicvine.url.base + req.url,
			headers: {
				'Content-Type': fileType,
				'User-Agent': 'gabeiscool'
			}
		});

		// We have to make the directory if it doesn't exist
		// So first, determine the directory
		const imageFolder = path.join(__dirname, 'public' + req.url.replace(/\/[^/]+$/, ''));
		const imagePath = path.join(__dirname, 'public' + req.url);
		fs.access(imageFolder, (err) => {
			if (!err) {
				// Directory exists, so let's just put the image there
				newReq.pipe(
					new Stream.PassThrough().pipe(
						fs.createWriteStream(imagePath)
					)
				);
			} else {
				// Gotta make the directory first
				mkdirp(imageFolder, (err) => {
					if (!err) {
						// Then put the image there
						newReq.pipe(
							new Stream.PassThrough().pipe(
								fs.createWriteStream(imagePath)
							)
						);
					}
				});
			}
		});

		// Don't forget to send the image to the original request!
		newReq.pipe(res);
	} else {
		// If they're requesting a bad filetype, send them to a 404
		res.redirect('/404');
	}
});

// Pages route, to be removed later
app.get('/[a-z-]+', (req, res) => {
	var urlArray = req.url.split('/');
	res.render('pages/' + urlArray[1] + '.njk');
});

app.listen(config.devMode ? config.port.dev : config.port.prod);
