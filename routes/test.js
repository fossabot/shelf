module.exports = (config) => {
	// Required modules
	const express	= require('express');
	const request	= require('request');

	// Create our router
	const router = express.Router();

	// Shortcut for comicvine api
	const comicvine = config.api.comicvine;

	// Our default request function
	const getData = (resource, callback) => {
		const url = genComicVineURL(resource);
		request.get({
			url,
			headers: {
				'User-Agent': 'shelf'
			}
		}, callback);
	};

	// Construct comicvine URL
	const genComicVineURL = (resource) => comicvine.url.base + '/' + resource + '?format=json&api_key=' + comicvine.key;

	// Our test routes
	router.get('/', (req, res) => {
		getData('publishers', (err, response, body) => {
			if (err) {
				res.render('error.njk', {
					site: config.site,
					status: response ? response.status : 500
				});
			} else {
				res.render('test.njk', {
					site: config.site,
					data: JSON.parse(body)
				});
			}
		});
	});

	return router;
};
