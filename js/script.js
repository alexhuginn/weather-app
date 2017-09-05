$(function(){

	var latitude;
	var longitude;
	var degreeCelsius = 0;
	var degreeFahrenheit = 32;
	var d = new Date();
	
	getLocation();
	
	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition, showError);
		} else {
			$("main").html("<div><p><i class='fa fa-cloud fa-5x fa-rotate-180'></i><br/>OMG! Are you from the past? Or maybe from the future? Change your browser!</p><div>");
			showPage();
		}
	}

	function showPosition(position) {
		latitude = position.coords.latitude;
		longitude = position.coords.longitude;
		
		showDate();
		getWeather();
	}

	function showError(error) {
		switch(error.code) {
			case error.PERMISSION_DENIED:
				$("main").html("<div><p><i class='fa fa-cloud fa-5x fa-rotate-180'></i><br/>Hey! Are you going to know weather in your place? Then please let me know your location</p><div>");
				break;
			case error.POSITION_UNAVAILABLE:
				$("main").html("<div><p><i class='fa fa-cloud fa-5x fa-rotate-180'></i><br/>Where are you? In a secret place? Location information is unavailable'</p><div>");
				break;
			case error.TIMEOUT:
				$("main").html("<div><p><i class='fa fa-cloud fa-5x fa-rotate-180'></i><br/>I am tired to look for you. The request to get location timed out</p><div>");
				break;
			case error.UNKNOWN_ERROR:
				$("main").html("<div><p><i class='fa fa-cloud fa-5x fa-rotate-180'></i><br/>Even I do not know what happend</p><div>");
				break;
		};
		showPage();
	};
    
	function showDate() {

		var hours = d.getHours();
		var minutes = d.getMinutes();
		
		if(minutes < 10) {
			minutes = "0" + minutes;
		}
    
		var monthArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var month = monthArr[d.getMonth()];
		var day = d.getDate();
    
		$(".time p").html(hours + ":" + minutes);
		$(".date p").html(month + " " + day);
	};
  
	function getCity(city, country) {
    		if(city) {
      			$(".place p").html(city + ", " + country);
    		} else {
      			$(".place p").html("Latitude: " + latitude + "<br/>Longitude: " + longitude);
    		}
	};

	function getWeather() {
		$.getJSON(
			"https://fcc-weather-api.glitch.me/api/current?lat=" + latitude + "&lon=" + longitude,
			function(info) {
				showIcon(info.sys.sunrise, info.sys.sunset, info.weather[0].main);
        
        			getCity(info.name, info.sys.country);   
        
				$(".description p").html(info.weather[0].description);
        
				degreeCelsius = Math.round(info.main.temp);
				degreeFahrenheit = Math.round(degreeCelsius * 1.8 + 32);
				
				$(".degree p").html(degreeCelsius + "&deg;");
        
				showPage();
			}
		);
	};

	function showIcon(sunrise, sunset, icon) {
		var flaticon;
		
		if (d > sunrise || d < sunset) {
			flaticon = ["sun", "", 1, 4, 1, 1, 1];
		} else {
			flaticon = ["moon", -1, 2, 5, 2, 2, 2];
		}
				
		switch(icon) {
			case "Clear":
				$(".icon p").html("<i class='flaticon-" + flaticon[0] + "'></i>");
				break;
			case "Clouds":
				$(".icon p").html("<i class='flaticon-cloudy" + flaticon[1] + "'></i>");
				break;
			case "Snow":
				$(".icon p").html("<i class='flaticon-snow-" + flaticon[2] + "'></i>");
				break;
			case "Rain":
				$(".icon p").html("<i class='flaticon-rain-" + flaticon[3] + "'></i>");
				break;
			case "Haze":
				$(".icon p").html("<i class='flaticon-haze-" + flaticon[4] + "'></i>");
				break;
			case "Drizzle":
				$(".icon p").html("<i class='flaticon-rain-" + flaticon[5] + "'></i>");
				break;
			case "Thunderstorm":
				$(".icon p").html("<i class='flaticon-storm-" + flaticon[6] + "'></i>");
				break;
			default:
				$(".icon p").html("<i class='flaticon-thermometer-2'></i>");
		};
	};

// Show page after all scripts	
	function showPage() {
		$(".loader").css("display", "none");
		$("main").css("visibility", "visible");
	};

// Change celsius and fahrenheit
	$(".symbol p").click(function(){
		$(".symbol p").toggleClass("inactive");
		
		if($(".celsius").hasClass("inactive")) {
			$(".degree p").html(degreeFahrenheit + "&deg;");
		} else {
			$(".degree p").html(degreeCelsius + "&deg;");
		}
	});
});
