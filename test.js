const mongoose	= require('mongoose');
mongoose.connect('mongodb://localhost/shelf', {
	useMongoClient: true
});
const Issue = require('./models/issue.js');

Issue.findOne({}, (err, issue) => {
	if (err) throw err;
	console.log(issue);
});
