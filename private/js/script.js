$(function() {

	var template = $('#contribution-template').html();
	var socket = io();

	var delay = 1000;

	var totalRaised = 0;
	var progressbar = $('#progress-bar');
	var progresslabel = $('.progress-label');
	
	//GRID OF EACH CONTRIBUTION POST
	$('.item').masonry({
		itemSelector: '.item'
	});

	////AJAX REQUEST TO FETCH CAMPAIGN INFO
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'http://localhost:3000/api/campaign',
		error: function(xhr, status){
			$('header').html('<p>Error fetching campaign</p>');
		},
		success: function(data) {

			totalRaised = data.stats.total_raised;

			$('img.logo').attr('src', data.image_url);
			$('.campaign-name').text(data.title);
			$('.introduction').text(data.introduction);

			// Progress bar
			progressbar.progressbar({
				value: Math.min(totalRaised/2000*100, 60),	
				max: 2000
			});
			progresslabel.text("Raised $" + totalRaised);
		}
	});

	function hideLoader(){
		$('#loader').css("display", "none");
	}

	//AJAX REQUEST TO FETCH CONTRIBUTIONS
	$.ajax({
		type: 'GET',
		cache: false,
		dataType: 'json',
		url: 'http://localhost:3000/api/contributions',
		error: function(xhr, status) { 
			$('body').html('<p>Error fetching data</p>');
		},
		success: function(data) {
			hideLoader();
			$.each(data.entries, addItem); //$.each(objects, func(key,value))			
		}
	});	

	socket.on('new contribution', function(data){

		addItem(0, data);
		totalRaised += data.amount;

		progressbar.progressbar("option", "value", );
		progresslabel.text("Raised $" + totalRaised);

		$('html, body').animate({scrollTop: 0}, 'fast');

	});

	function addItem(i,info){ //function(key,value) of objects on $.each
		var $item = $(template);

		$item.find('.contributor-avatar').attr('src', info.owner.image_url); 
		$item.find('.contributor-name').text(info.owner.name);
		$item.find('.contributor-amount').append(numberFormat(info.amount));
		$item.find('.created-at').append(moment(info.created*1000).fromNow()); //momentJs

		function numberFormat(num) {
		    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") //replace with comma
		};

		setTimeout(function() {
			$('#feed').prepend($item);
			$item.addClass('is-visible animated flipInX');
		}, delay*i);
	};

	//display Date and Time at footer
	$('#date-time').text(moment().calendar());

	//alert transition
	$('header').click(function(){	
		$('#alert-element').toggleClass('is-active');

		
		if($('#alert-element').hasClass('is-active')){
			var audio = $('audio')[0];
			audio.play();
			$('.grid').css('opacity', 0.5);

			setTimeout(function(){
				$('#alert-element.is-active').removeClass('is-active');
				audio.pause();
				audio.currentTime=0;
				$('.grid').css('opacity', 1);
			}, 4000);
		};
	});

}); //end