// Declare our needed variables
const express = require('express');
const nunjucks = require('nunjucks');
const stylus = require('stylus');
const path = require('path');
const app = express();

// Set a global variable to represent the application root
global.__basedir = __dirname;

// Turn on stylus autocompiling
app.use(stylus.middleware({
	src: path.join(__dirname, '/resources'),
	dest: path.join(__dirname, '/public'),
	force: false,
	compress: false
}));

// Get nunjucks going
nunjucks.configure('views', {
	autoescape: true,
	noCache: true,
	express: app
});

// Turn on public folder
app.use(express.static('public'));

// Set up our site object
const site = {
	'title': 'shelf'
};

// Set up routes
const series = require(path.join(__dirname, '/routes/series'))(site);
app.use('/series', series);
const collection = require(path.join(__dirname, '/routes/collection'))(site);
app.use('/collection', collection);

app.get('/', (req, res) => {
	const mongojs = require('mongojs');
	const db = mongojs('shelf');
	db.issues.find({}).sort({ publicationDate: 1 }).limit(15, (err, docs) => {
		if (err) {
			console.log(err);
			res.send(JSON.stringify(err));
		} else {
			res.render('index.njk', {
				site: site,
				page: {
					title: 'Home'
				},
				issues: docs
			});
		}
	});
});

// Turn on listening
app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});
