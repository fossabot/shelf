/* global $ */

$(document).ready(function () {
	$('.isoDate').each(function () {
		// console.log($(this).html());
		var date = new Date($(this).html());
		$(this).html(date.toLocaleDateString('en-us'));
		$(this).show();
	});
});
