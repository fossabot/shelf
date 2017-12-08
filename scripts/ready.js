const ready = (fn) => {
	if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') {
		fn();
	} else {
		document.addEventListener('DOMContentLoaded', fn);
	}
};

// Create an array to hold all of our functions to be run on page load
let functionsToRun = [];

ready(() => {
	functionsToRun.forEach((fn) => {
		fn();
	});
});
