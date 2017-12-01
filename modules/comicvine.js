// Import modules
const request	= require('request');

module.exports = (comicvine) => {
	// URL Constructor
	const genURL = {
		issue: (id, options = { format: 'json' }) => {
			if (!id) return -1;
			if (typeof options.format === 'undefined') options.format = 'json';
			let url = comicvine.url.base + '/issue/4000-' + id + '?api_key=' + comicvine.key + '&format=' + options.format;
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			return url;
		},
		issues: (options = { format: 'json' }) => {
			if (typeof options.format === 'undefined') options.format = 'json';
			let url = comicvine.url.base + '/issues?api_key=' + comicvine.key + '&format=' + options.format;
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			if (options.limit) url += '&limit=' + options.limit;
			if (options.offset) url += '&offset=' + options.offset;
			if (options.sort) url += '&sort=' + options.sort;
			if (options.filter) url += '&filter=' + options.filter;
			return url;
		},
		volume: (id, options = { format: 'json' }) => {
			if (!id) return -1;
			if (typeof options.format === 'undefined') options.format = 'json';
			let url = comicvine.url.base + '/volume/4050-' + id + '?api_key=' + comicvine.key + '&format=' + options.format;
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			return url;
		},
		volumes: (options = { format: 'json' }) => {
			if (typeof options.format === 'undefined') options.format = 'json';
			let url = comicvine.url.base + '/volumes?api_key=' + comicvine.key + '&format=' + options.format;
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			if (options.limit) url += '&limit=' + options.limit;
			if (options.offset) url += '&offset=' + options.offset;
			if (options.sort) url += '&sort=' + options.sort;
			if (options.filter) url += '&filter=' + options.filter;
			return url;
		},
		publisher: (id, options = { format: 'json' }) => {
			if (!id) return -1;
			if (typeof options.format === 'undefined') options.format = 'json';
			// Bugfix 2017-12-01, retrieves everything but "characters", because that currently causes a 502 at comicvine
			// let url = comicvine.url.base + '/publisher/4010-' + id + '?api_key=' + comicvine.key + '&format=' + options.format;
			let url = comicvine.url.base + '/publisher/4010-' + id + '?api_key=' + comicvine.key + '&format=' + options.format + '&field_list=aliases,api_detail_url,date_added,date_last_updated,deck,description,id,image,location_address,location_city,location_state,name,site_detail_url,story_arcs,teams,volumes';
			if (options.fieldList) url += '&field_list=' + options.fieldList;
			return url;
		},
		publishers: (options = { format: 'json' }) => {
			if (typeof options.format === 'undefined') options.format = 'json';
			let url = comicvine.url.base + '/publishers?api_key=' + comicvine.key + '&format=' + options.format;
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
	const getIssueByID = (id, fieldList, callback) => {
		if (!id) {
			// If there's no ID, we can't continue
			callback(new Error('No ID specified'));
		} else {
			// Ensure standardized arguments
			if (typeof fieldList === 'function') {
				callback = fieldList;
				fieldList = null;
			}
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
					try {
						body = JSON.parse(body);
					} catch (e) {
						callback(new Error('Bad response:\n' + JSON.stringify(reqOpts, null, 2)));
					}
					if (body.results) {
						// If it returned results, we're good to go
						callback(null, body.results);
					}
				}
			});
		}
	};

	// Issue list getter function
	const getIssues = (options = { format: 'json' }, callback) => {
		// Ensure standardized arguments
		if (typeof options === 'function') {
			callback = options;
			options = {
				format: 'json'
			};
		}
		const url = genURL.issues(options);
		const reqOpts = genReqOpts(url);
		request.get(reqOpts, (err, response, body) => {
			if (err) {
				callback(err);
			} else {
				try {
					body = JSON.parse(body);
				} catch (e) {
					callback(new Error('Bad response:\n' + JSON.stringify(reqOpts, null, 2)));
				}
				if (body.results) {
					callback(null, body.results);
				}
			}
		});
	};

	// Volume getter
	const getVolumeByID = (id, fieldList, callback) => {
		if (!id) {
			// If there's no ID, we can't continue
			callback(new Error('No ID specified'));
		} else {
			// Ensure standardized arguments
			if (typeof fieldList === 'function') {
				callback = fieldList;
				fieldList = null;
			}
			// Get our URL
			const url = genURL.volume(id, { fieldList });
			// Generate our request options
			const reqOpts = genReqOpts(url);
			// Then GET our URL
			request.get(reqOpts, (err, response, body) => {
				if (err) {
					callback(err);
				} else {
					// Convert the body string to an object
					try {
						body = JSON.parse(body);
					} catch (e) {
						callback(new Error('Bad response:\n' + JSON.stringify(reqOpts, null, 2)));
					}
					if (body.results) {
						// If it returned results, we're good to go
						callback(null, body.results);
					}
				}
			});
		}
	};

	// Issue list getter function
	const getVolumes = (options = { format: 'json' }, callback) => {
		// Ensure standardized arguments
		if (typeof options === 'function') {
			callback = options;
			options = {
				format: 'json'
			};
		}
		const url = genURL.volumes(options);
		const reqOpts = genReqOpts(url);
		request.get(reqOpts, (err, response, body) => {
			if (err) {
				callback(err);
			} else {
				try {
					body = JSON.parse(body);
				} catch (e) {
					callback(new Error('Bad response:\n' + JSON.stringify(reqOpts, null, 2)));
				}
				if (body.results) {
					callback(null, body.results);
				}
			}
		});
	};

	// Publisher getter
	const getPublisherByID = (id, fieldList, callback) => {
		if (!id) {
			// If there's no ID, we can't continue
			callback(new Error('No ID specified'));
		} else {
			// Ensure standardized arguments
			if (typeof fieldList === 'function') {
				callback = fieldList;
				fieldList = null;
			}
			// Get our URL
			const url = genURL.publisher(id, { fieldList });
			// Generate our request options
			const reqOpts = genReqOpts(url);
			// Then GET our URL
			request.get(reqOpts, (err, response, body) => {
				if (err) {
					callback(err);
				} else {
					// Convert the body string to an object
					try {
						body = JSON.parse(body);
					} catch (e) {
						callback(new Error('Bad response:\n' + JSON.stringify(reqOpts, null, 2)));
					}
					if (body.results) {
						// If it returned results, we're good to go
						callback(null, body.results);
					}
				}
			});
		}
	};

	// Publisher list getter function
	const getPublishers = (options = { format: 'json' }, callback) => {
		// Ensure standardized arguments
		if (typeof options === 'function') {
			callback = options;
			options = {
				format: 'json'
			};
		}
		const url = genURL.publishers(options);
		const reqOpts = genReqOpts(url);
		request.get(reqOpts, (err, response, body) => {
			if (err) {
				callback(err);
			} else {
				try {
					body = JSON.parse(body);
				} catch (e) {
					callback(new Error('Bad response:\n' + JSON.stringify(reqOpts, null, 2)));
				}
				if (body.results) {
					callback(null, body.results);
				}
			}
		});
	};

	return {
		getIssueByID,
		getIssues,
		getVolumeByID,
		getVolumes,
		getPublisherByID,
		getPublishers
	};
};
