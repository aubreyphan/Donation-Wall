$(function(){
	
	//odometer
	window.odometerOptions={
		format: '(,ddd).dd',
		theme: 'train-station',
	};

	  setTimeout(function(){
	    $('.odometer').html(2000000);
	  }, 1000);

	//grid of each contribution post
	$('.grid').masonry({
		itemSelector: '.item',
		columnWidth: 300,
		gutter:-30
	});

	$('.item').each(function(i){
	
		setTimeout(function(){
			$('.item').eq(i).load('contribution-post.html')
			.addClass('is-visible animated bounceIn');			
		}, 500*i);

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
		$('.alert-element').toggleClass('is-active');
		
		if($('.alert-element').hasClass('is-active')){
			var audio = $('audio')[0];
			audio.play();

			setTimeout(function(){
				$('.alert-element.is-active').removeClass('is-active');
				audio.pause();
				audio.currentTime=0;
			}, 4000);
		};

	});

});