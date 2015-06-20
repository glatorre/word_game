$(function() {
	var word;
	$.get( "/word", function( data ) {
  		$("#en_word").text(data.en);
  		word = data;
	});

	$("#but").click(function(){
		if($("#but").text() == "Show"){
			var it = word.it.toString().replace(/,/g, ', ');
			$("#it_word").text(it);
			$("#but").text("New Word");
		}
		else if($("#but").text() == "New Word"){
			$("#it_word").text("");
			$.get( "/word", function( data ) {
  				$("#en_word").text(data.en);
  				$("#but").text("Show");	
  				word = data;
			});
		}
	});
});