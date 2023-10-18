/* banner slider */
$(function() {
	$(".rslides").responsiveSlides({
	  auto: true,
	  speed: 500,
	  timeout: 4000,
	  pager: false,
	  nav: true,
	  random: false,
	  pause: false,
	  pauseControls: true,
	  prevText: ' ',
	  nextText: ' ',
	  maxwidth: "",
	  navContainer: "",
	  manualControls: "",
	  namespace: "rslides",
	  before: function(){},
	  after: function(){} 
	});
});

/* dropdown */
$(document).on('click', '.dropdown-menu', function (e) { e.stopPropagation(); });


