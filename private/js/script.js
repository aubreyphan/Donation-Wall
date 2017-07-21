$(function() {

	var template = $('#contribution-template').html();
	var socket = io();

	var totalRaised = 0;
	var goal = 0;

	var n = 1;
	var numberOfContributions = 1;
	var notify;

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

	socket.on('new contribution', function(data){
		
		addItem(0, data);
		totalRaised += data.amount;

		progressbar.progressbar("option", "value", progressBar());
		progresslabel.text("Raised $" + totalRaised);

		//GOAL NOTIFICATION
		if (totalRaised/(n*1000) > 1) {
			$('#goal-notify').remove();
			var reach = $.notify({
				icon: 'glyphicon glyphicon-flag',
				message: 'We reach $ ' + n*1000 + ' !',
			},{
				type: 'warning',
				placement: {
					align: 'center'
				},
				delay: 4000,
				newest_on_top: true,
				onShow: function(){
					var audio = $('audio')[0];
					audio.play();

					setTimeout(function(){
						audio.pause();
						audio.currentTime=0;
					}, 4000);				
				},
				template: 
					'<div id="goal-notify" data-notify="container" class="col-xs-11 col-sm-11 alert alert-{0} text-center reach" role="alert">' +
						'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
						'<span data-notify="icon"></span> ' +
						'<span data-notify="title">{1}</span> ' +
						'<span data-notify="message">{2}</span>' +
						'<a href="{3}" target="{4}" data-notify="url"></a>' +
					'</div>'
			});
			n++;
		}

		$('.reach').on('click', function(){
			reach.close();
		})

		//NEW CONTRIBUTION NOTIFICATION
		var message = numberOfContributions + ' new contribution(s)'; 
		$('#contribution-notify').remove();
		var notify = $.notify({
			//options
			icon: 'glyphicon glyphicon-bullhorn',
			message: message
			},{
			//settings
			type: 'success',
			placement: {
				align: 'center'
			},
			delay: 10000,
			newest_on_top: true,
			onShown: function(){ 
				numberOfContributions++; 
			},
			template: 
				'<div id="contribution-notify" data-notify="container" class="col-xs-11 col-sm-11 alert alert-{0} text-center notify" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>' +
					'<span data-notify="icon"></span> ' +
					'<span data-notify="title">{1}</span> ' +
					'<span data-notify="message">{2}</span>' +
					'<a href="{3}" target="{4}" data-notify="url"></a>' +
				'</div>' 
		});

		$('.notify').on('click', function(){
			$('html, body').animate({scrollTop: 0}, 'fast');
			notify.close();
			numberOfContributions = 1;
		});

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

		$('#feed').prepend($item);
		$item.addClass('animated zoomIn');

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

		
}); //end