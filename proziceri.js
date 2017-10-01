// All the sayings generated in the session.
var sayings_in_session = []

// The saying currently on display.
var currentSaying;

$( document ).ready(function() {
	//getDadaSaying();
	openCSVFile();	

	$("#originalSayingsContainer").css("top", function(){
		return $("#dadaSaying").offset().top - 100;
	}); 

	$("#dadaSaying").hover(
		function(){
			$("#originalSayingsContainer").show();
		},
		function(){
			$("#originalSayingsContainer").hide();
		});
	
	$("#newSaying").click(function(){
		getDadaSaying();
	});

	$("#previousSaying").click(function(){
		if (sayings_in_session.length > 1) {
			var indexes = $.map(sayings_in_session, function (obj, index) {
				if(obj.dada == currentSaying.dada) {
					return index;
				}
			})
			var indexOfCurrentSession = indexes[0]
			
			if (indexOfCurrentSession > 0) {
				var previousSaying = sayings_in_session[indexOfCurrentSession-1];
				displaySaying(previousSaying.dada, previousSaying.first, previousSaying.second);
			}
		}
	});

	$("#nextSaying").click(function(){
		if (sayings_in_session.length > 1) {
			var indexes = $.map(sayings_in_session, function (obj, index) {
				if(obj.dada == currentSaying.dada) {
					return index;
				}
			})
			var indexOfCurrentSession = indexes[0]

			if (indexOfCurrentSession < sayings_in_session.length) {
				var nextSaying = sayings_in_session[indexOfCurrentSession+1];
				displaySaying(nextSaying.dada, nextSaying.first, nextSaying.second);
			}
		}
	});

	$("#nextSaying").click(function(){
		if (sayings_in_session.length > 1) {
			var indexes = $.map(sayings_in_session, function (obj, index) {
				if(obj.dada == currentSaying.dada) {
					return index;
				}
			})
			var indexOfCurrentSession = indexes[0]

			if (indexOfCurrentSession < sayings_in_session.length) {
				var nextSaying = sayings_in_session[indexOfCurrentSession+1];
				displaySaying(nextSaying.dada, nextSaying.first, nextSaying.second);
			}
		}
	});	

	$("#shareOnFacebook").click(function(){
		FB.ui({
		  method: 'share',
		  href: 'http://prozicerisiverbatori.ro',
		  quote: '"' + currentSaying.dada + '"' + " #prozicerișiverbători",
		}, function(response){});
	});

	$("#about").click(function(){
		if (this.innerText == "despre") {
			this.innerText = "înapoi";
			$("#sayingsContainer").hide();
			$("#aboutContainer").show();
		}
		else{
			this.innerText = "despre";
			$("#sayingsContainer").show();
			$("#aboutContainer").hide();
		}
	});

});

// Add the dada saying and the original ones.
function addSayingToSession(dada_saying, first_saying, second_saying) {
	sayings_in_session.push({'dada': dada_saying, 'first': first_saying, 'second': second_saying});
}
// Display the dada sayings with its corresponding original sayings.
function displaySaying(dada_saying, first_saying, second_saying) {
	currentSaying = {'dada': dada_saying, 'first': first_saying, 'second': second_saying};

	$("#dadaSaying").html(dada_saying);
	$("#oSaying1").html(first_saying);
	$("#oSaying2").html(second_saying);
}

function getDadaSaying(){
	$.ajax({
		url: "http://188.166.21.170/sayings/dada_saying",
		jsonp: "callback",
		dataType: "jsonp",
		success: function( response ) {
			var first_saying = response.first_saying.part1 + (response.first_saying.separator == ',' ? '' : ' ') + response.first_saying.separator + ' ' + response.first_saying.part2;
			var second_saying = response.second_saying.part1 + (response.second_saying.separator == ',' ? '' : ' ') + response.second_saying.separator + ' ' + response.second_saying.part2;		
			
			addSayingToSession(response.dada_saying, first_saying, second_saying);
			displaySaying(response.dada_saying, first_saying, second_saying);
		}
	});
}

function openCSVFile() {
	$.ajax({
        type: "GET",
        url: "Proziceri.csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
}

function processData (data) {
	Papa.parse(data, {
	  complete: function(results) {
			// Generate two random ids between 0 and the number of sayings in the file.
			var numberOfSayings = results.data.length;

	  	var firstSayingIndex = Math.floor((Math.random() * numberOfSayings) + 1);
	  	var secondSayingIndex = Math.floor((Math.random() * numberOfSayings) + 1);

	  	// Get the two sayings.
	  	var firstSaying = results.data[firstSayingIndex];
	  	var sencondSaying = results.data[secondSayingIndex];
	  	var separator = firstSaying[1] ? ' ' : firstSaying[1]

	  	// Return the part1 and separator from the first saying and the part2 from the second saying
	  	// if the separator is a comma, don't add an extra space before it
	  	var part1Padding = separator == ',' ? '' : ' ';

	  	var dadaSaying = firstSaying[0] + part1Padding + separator + ' ' + sencondSaying[2]
  	
  		// Return the dada_saying as well as the original sayings
  		//var json_sayings = { dada_saying: dada_saying, first_saying: first_saying.to_json, second_saying: second_saying.to_json}.to_json

  		addSayingToSession(dadaSaying, firstSaying, secondSaying);
			displaySaying(dadaSaying, firstSaying, secondSaying);
	  }
  });
}

