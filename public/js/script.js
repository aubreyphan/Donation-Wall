$(function() {

	var template = $('#contribution-template').html();
	var socket = io();
	//odometer
	window.odometerOptions={
		format: '(,ddd).dd',
		theme: 'train-station',
	};

	  setTimeout(function(){
	    $('.odometer').html(2000000);
	  }, 1000);

	//grid of each contribution post
	$('#grid').masonry({
		itemSelector: '.item',
		columnWidth: 300,
		gutter:-30
	});

		//ajax request
	$.ajax({
		type: 'GET',
		cache: false,
		dataType: 'json',
		url: 'http://localhost:3000/api/contributions',
		error: function(xhr, status) { 
			$('body').html('<p>Error fetching data</p>');
		},
		success: function(data) {
			$.each(data.entries, addItem); 
		}
	});	

	socket.on('new contribution', function(data){
		addItem(0, data);
	});

	function addItem(i,info){
		var delay = 500;
		var $item = $(template);

		$item.find('.contributor-avatar').attr('src', info.avatar); 
		$item.find('.contributor-name').text(info.name);
		$item.find('.contributor-amount').append(info.amount);

		setTimeout(function() {
			$('#feed').prepend($item);
			$item.addClass('is-visible animated bounceIn');
		}, delay*i);
	};

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