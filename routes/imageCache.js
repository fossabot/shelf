// Required modules
const express	= require('express');
const mime 		= require('mime/lite');
const request	= require('request');
const path		= require('path');
const fs			= require('fs');
const Stream	= require('stream');
const mkdirp	= require('mkdirp');

module.exports = (config) => {
	// Create the router
	const router = express.Router();

	// Image cacher route
	router.get(/\/.*\.[^.]+$/, (req, res) => {
		// Fix the url
		req.url = '/image' + req.url;
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
					'User-Agent': config.api.comicvine.userAgent
				}
			});

			// We have to make the directory if it doesn't exist
			// So first, determine the directory
			const imageFolder = path.join(__dirname, '../public' + req.url.replace(/\/[^/]+$/, ''));
			const imagePath = path.join(__dirname, '../public' + decodeURIComponent(req.url));

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
			res.redirect('/error/404');
		}
	});

	// Return the router
	return router;
};
