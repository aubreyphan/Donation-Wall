$(function() {

	var template = $('#contribution-template').html();
	var socket = io();
	//odometer
	window.odometerOptions={
		format: '(,ddd).dd',
		theme: 'train-station',
	};

	//grid of each contribution post
	$('#grid').masonry({
		itemSelector: '.item',
		columnWidth: 300,
		gutter:-30
	});

	//ajax request to fetch campaign info
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'http://localhost:3000/api/campaign',
		error: function(xhr, status){
			$('header').html('<p>Error fetching campaign</p>');
		},
		success: function(data){
			$('img.logo').attr('src', data.image_url);
			$('.campaign-name').text(data.title);
			$('.introduction').text(data.introduction);

			setTimeout(function(){
				$('.odometer').html(data.stats.total_raised);
			}, 1000);
		}
	});


	//ajax request to fetch contributions
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
		var delay = 1000;
		var $item = $(template);

		$item.find('.contributor-avatar').attr('src', info.owner.image_url); 
		$item.find('.contributor-name').text(info.owner.name);
		$item.find('.created-at').append(moment(info.created*1000).fromNow());

		function numberFormat(num) {
		    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") //replace with comma
		};

		function numberFormat(num) {
		    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") //replace with comma
		}


		setTimeout(function() {
			$('#feed').prepend($item);
			$item.addClass('is-visible animated flipInX');
		}, delay*i);
	};

	//display Date and Time at footer
	$('#date-time').text(moment().calendar());

	// var d = new Date();
	// $('#date-time').text(format_time(d));

	// function format_time(t){
	// 	hours = format_2_digits(t.getHours());
	// 	minutes = format_2_digits(t.getMinutes());
	// 	return hours + ':' + minutes;
	// };

	// function format_2_digits(t){
	// 	return t < 10 ? '0'+t : t;
	// };

	//alert transition
	$('header').click(function(){	
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