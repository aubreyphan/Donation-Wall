$(function() {

	var template = $('#contribution-template').html();
	var socket = io();

	var progressbar = $('#progress-bar');
	var progresslabel = $('.progress-label');
	
	//GRID OF EACH CONTRIBUTION POST
	$('.item').masonry({
		itemSelector: '.item'
	});

	////AJAX REQUEST TO FETCH CAMPAIGN INFO
	var totalRaised = 0;
	var goal = 0;
	$.ajax({
		type: 'GET',
		dataType: 'json',
		url: 'http://localhost:3000/api/campaign',
		error: function(xhr, status){
			$('header').html('<p>Error fetching campaign</p>');
		},
		success: function(data) {

			totalRaised = data.stats.total_raised;
			goal = data.goal;

			$('img.logo').attr('src', data.image_url);
			$('.campaign-name').text(data.title);
			$('.introduction').text(data.introduction);

			progressBar();
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

	var n, numberOfContributions = 1;
	socket.on('new contribution', function(data){
		
		addItem(0, data);
		totalRaised += data.amount;

		progressbar.progressbar("option", "value", progressBar());
		progresslabel.text("Raised $" + totalRaised);

		if(totalRaised/(n*1000) > 1){
			alertNotification();
			n++;
		}
	
		// $('#top-notification')
		// 	.html(numberOfContributions + " new contribution(s)")
		// 	.addClass('is-visible')
		// 	.click(function(){
		// 		$(this).removeClass('is-visible');
		// 		numberOfContributions = 1;
		// 		$('html, body').animate({scrollTop: 0}, 'fast');
		// 	});
		// numberOfContributions++;	

		//Boostrap Notify
		$.notify({
			//options
			icon: 'glyphicon glyphicon-bullhorn',
			title: numberOfContributions,
			message: 'new contribution(s)',
			url: '#feed',
			target: '_self'
		},{
			element: 'body',
			position: null, //allow to specify a custom position
			type: 'success',
			allow_dismiss: true,
			newest_on_top: true,
			showProgressbar: false,
			placement: {
				from: 'top',
				align: 'center'
			},
			offset: 20,
			spacing: 10,
			z_index: 10,
			url_target: '_self',
			mouse_over: null, 
			animate: {
				enter: 'animated zoomInDown',
				exit: 'animated zoomOutUp'
			},
			onClosed: function(){ numberOfContributions ++ },
			icon_type: 'class',
			template: 
				'<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
					'<span data-notify="icon"></span> ' +
					'<span data-notify="title">{1}</span> ' +
					'<span data-notify="message">{2}</span>' +
					'<div class="progress" data-notify="progressbar">' +
						'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
					'</div>' +
					'<a href="{3}" target="{4}" data-notify="url"></a>' +
				'</div>' 
		});
		notify.show();
	});

	//display Date and Time at footer
	$('#date-time').text(moment().calendar());	

	//add contribution posts

	function addItem(i,info){ //function(key,value) of objects on $.each
		var $item = $(template);
		var delay = 1000;

		$item.find('.contributor-avatar').attr('src', info.owner.image_url); 
		$item.find('.contributor-name').text(info.owner.name);
		$item.find('.contributor-amount').append(numberFormat(info.amount));
		//display post's relative time
		relativeTime();
		setInterval(relativeTime, 60000);	

		function relativeTime(){
			$item.find('.created-at').text(moment(info.created*1000).from(new Date().getTime())); //momentJS
		}

		function numberFormat(num) {
		    return num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") //replace with comma
		};

		setTimeout(function() {
			$('#feed').prepend($item);
			$item.addClass('animated zoomIn');
		}, delay*i);

	};

	//Progress bar
	function progressBar(){
		var limit = totalRaised;
		var progressGoal = goal;
		if (!goal) {
			progressGoal = 2000;
			limit = 0.7 * progressGoal;
		}
		var progressVal = Math.min(totalRaised, limit);

		// Progress bar
		progressbar.progressbar({
			value: progressVal,
			max: progressGoal
		});
	
		progresslabel.text("Raised $" + totalRaised);
	} 

	//alert transition
	function alertNotification(){
		$('#alert-element')			
			.toggleClass('is-active')
			.find('.text').text('WE REACH $' + n*1000 + ' !');
		
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
	};
		
}); //end