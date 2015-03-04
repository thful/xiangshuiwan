(function($) {
	$.fn.moveup = function(Options) {
		Defaults = {
			upul: "#upul",
			speed: 1000,
			overtime: 500,
			upli: "li",
			startnum: 3
		}
		var timer
		Options = $.extend({}, Defaults, Options);
		var cont = $(Options.upul);
		var cont_length = cont.children(Options.upli).length;

		function moveup() {
			var cont_li = cont.children(Options.upli);
			var cont_li_first = cont_li.first();
			var cont_li_first_cp = cont_li_first
			cont_li_first.slideUp(Options.overtime, function() {
				cont_li_first_cp.appendTo(cont).show()
			})
		}

		function startup(){
			if (cont_length >= Options.startnum) {
				timer = setInterval(moveup, Options.speed);
			}
		}
		startup()
		cont.hover(function() {
			clearInterval(timer)
		}, function() {
			startup()
		})


	}
})(jQuery)