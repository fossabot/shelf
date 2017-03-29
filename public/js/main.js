/* global $ */

$(document).ready(function () {
	// Date conversion
	$('.isoDate').each(function () {
		var date = new Date($(this).html());
		$(this).html(date.toLocaleDateString('en-us'));
		$(this).show();
	});

	// Add to Collection Form
	$('#addToCollection').on('click', '.addMore', function () {
		$(this).parent().after('<p>' + $(this).parent().html() + '</p>');
		$(this).html('Remove Row -').removeClass('addMore').addClass('removeRow');
	});
	$('#addToCollection').on('click', '.removeRow', function () {
		$(this).parent().remove();
	});

	// Label Color Change on Focus
	$('input').on('focus blur', function () {
		$(this).parent().toggleClass('focused');
	});
});
