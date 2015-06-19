var https = require('https');
var express = require('express');
var app = express();
var nouns = require('./en_nouns.json');

console.log("Loaded " + nouns.length +" english nouns");

var translate = function(en_word, cb){
	var options = {
  		host: "glosbe.com",
  		port: 443,
  		method: "get",
  		path: "/gapi/translate?from=eng&dest=ita&format=json&phrase="+en_word+"&pretty=true"
	};

	callback = function(response) {
  		var str = '';
  		
  		response.on('data', function (chunk) {
    		str += chunk;
  		});

  		response.on('end', function () {
  			//console.log("Translating "+en_word+" ...");
    		var obj = JSON.parse(str);
    		if(obj.result == "ok"){
    			var vet = [];
    			var count=0;
    			while(count < obj.tuc.length-1){
    				if(obj.tuc[count] && obj.tuc[count].phrase)
    					vet.push(obj.tuc[count].phrase.text);
    				else
    					break;
    				if(count == 3)
    					break;
    				count++;
    			}
    			
    			if(vet.length == 0)
    				translate(generate(), cb);
    			else{
    				console.log("IT : " + vet);
    				cb({en:en_word, it:vet});
    			}
    		}
  		});
	}

	https.request(options, callback).end();
}

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

function generate(){
	var index = randomIntInc(0,11045);
	var word = nouns[index];
	console.log("EN : " + word);
	return word;
}

app.use(express.static(process.cwd() + '/public'));

app.get('/word', function(req, res) {
	translate(generate(), function(vet){
		res.send(vet);
	});
});

app.listen(3000, function(){
	console.log("Well done! Now head your browser to http://localhost:3000");
});