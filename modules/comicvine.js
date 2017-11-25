// Import modules
const request	= require('request');

module.exports = (comicvine) => {
	// URL Constructor
	const genURL = {
		issue: (id, options = {
			format: 'json'
		}) => {
			if (!id) return -1;
			let url = comicvine.url.base + '/issue/4000-' + id + '?format=' + options.format;
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			return url;
		},
		issues: (options = {
			format: 'json'
		}) => {
			let url = comicvine.url.base + '/issues?format=' + options.format;
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			if (options.limit) url += '&limit=' + options.limit;
			if (options.offset) url += '&offset=' + options.offset;
			if (options.sort) url += '&sort=' + options.sort;
			if (options.filter) url += '&filter=' + options.filter;
			return url;
		},
		volume: (id, options = {
			format: 'json'
		}) => {
			if (!id) return -1;
			let url = comicvine.url.base + '/volume/4050-' + id + '?format=' + options.format;
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			return url;
		},
		volumes: (options = {
			format: 'json'
		}) => {
			let url = comicvine.url.base + '/volumes?format=' + options.format;
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			if (options.limit) url += '&limit=' + options.limit;
			if (options.offset) url += '&offset=' + options.offset;
			if (options.sort) url += '&sort=' + options.sort;
			if (options.filter) url += '&filter=' + options.filter;
			return url;
		},
		publisher: (id, options = {
			format: 'json'
		}) => {
			if (!id) return -1;
			let url = comicvine.url.base + '/publisher/4010-' + id + '?format=' + options.format;
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			return url;
		},
		publishers: (options = {
			format: 'json'
		}) => {
			let url = comicvine.url.base + '/volumes?format=' + options.format;
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			if (options.limit) url += '&limit=' + options.limit;
			if (options.offset) url += '&offset=' + options.offset;
			if (options.sort) url += '&sort=' + options.sort;
			if (options.filter) url += '&filter=' + options.filter;
			return url;
		}
	};

	// Request options generator
	const genReqOpts = (url) => {
		return {
			url,
			headers: {
				'User-Agent': comicvine.userAgent
			}
		};
	};

	// Issue getter
	const getIssueByID = (callback, id, fieldList) => {
		if (!id) {
			// If there's no ID, we can't continue
			callback(new Error('No ID specified'));
		} else {
			// Get our URL
			const url = genURL.issue(id, { fieldList });
			// Generate our request options
			const reqOpts = genReqOpts(url);
			// Then GET our URL
			request.get(reqOpts, (err, response, body) => {
				if (err) {
					callback(err);
				} else {
					// Convert the body string to an object
					body = JSON.parse(body);
					if (body.results) {
						// If it returned results, we're good to go
						callback(null, body.results);
					} else {
						// Otherwise, something went wrong
						callback(new Error('No results returned'));
					}
				}
			});
		}
	};

	// Issue list getter function
	const getIssues = (callback, options) => {
		const url = genURL.issues(options);
		const reqOpts = genReqOpts(url);
		request.get(reqOpts, (err, response, body) => {
			if (err) {
				callback(err);
			} else {
				body = JSON.parse(body);
				if (body.results) {
					callback(null, body.results);
				} else {
					callback(new Error('No results returned'));
				}
			}
		});
	};

	return {
		getIssueByID,
		getIssues
	};
};
