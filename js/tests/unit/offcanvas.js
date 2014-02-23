$(function () {

	module('offcanvas');

	test('should provide no conflict', function () {
		var offcanvas = $.fn.offcanvas.noConflict();
		ok(!$.fn.offcanvas, 'tab was set back to undefined (org value)');
		$.fn.offcanvas = offcanvas;
	});

});
