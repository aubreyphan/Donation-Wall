$(function(){
	
	//odometer
	window.odometerOptions={
		format: '(,ddd).dd',
		theme: 'train-station',
	};

	  setTimeout(function(){
	    $('.odometer').html(2000000);
	  }, 1000/2);

	//grid of each contribution post
	$('.grid').masonry({
		itemSelector: '.item',
		columnWidth: 200,
		gutter: 10
	});

	$('.item').each(function(i,j){

		var animationList = ['bounceIn', 'fadeInDown', 'fadeInUp', 'flipInX', 'flipInY', 'rotateIn', 'slideInDown', 'zoomIn'];
		var j=Math.floor(Math.random()*8);

		setTimeout(function(){
			$('.item').eq(i).addClass('is-visible animated ' + animationList[j]);
		}, 200*i);

	});
	
	//display Date and Time at footer
	var d = new Date();
	var formatted_d = format_time(d);
	$('#dateTime').text(formatted_d);

	function format_time(t){
		hours = format_2_digits(t.getHours());
		minutes = format_2_digits(t.getMinutes());
		return hours + ':' + minutes;
	};

	function format_2_digits(t){
		return t < 10 ? '0'+t : t;
	};

	//alert transition
	$('.grid .item').click(function(){
		var audio = $('audio')[0];		
		$('.alert-element').toggleClass('is-active');
		
		if($('.alert-element').hasClass('is-active')){
			var audio = $('audio')[0];
			audio.play();

			setTimeout(function(){
				var activeElement = $('.alert-element.is-active');
				activeElement.removeClass('is-active');
				audio.stop();
			}, 4000);
		};

	});

});