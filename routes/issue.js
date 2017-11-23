module.exports = (config) => {
	// Needed modules
	const express	= require('express');
	const mongojs	= require('mongojs');

	// Connect to the db
	const connection = config.database.host + ':' + config.database.port + '/' + config.database.name;
	const db = mongojs(connection);

	// Create our router
	const router = express.Router();

	// Our home route
	router.get('/:id', (req, res) => {
		db.issues.findOne({
			id: Number(req.params.id)
		}, (err, issue) => {
			console.log(issue);
			if (err) console.error(err);
			res.render('pages/issue.njk', {
				site: config.site,
				issue
			});
		});
	});

	return router;
};
