var http = require('http');
var https = require('https');
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var argv = process.argv.slice(2);
var command = argv[0];
var token = argv[1];
if(command === 'authorize') {
    authorize();
}
else if(command === 'info') {
    getAccountInfo();
}
else if(command === 'getFile') {
    getFile();
}
else if(command === 'putFile') {
    putFile();
}

function putFile() {
    var file = argv[2];
    var path = argv[3];
    fs.readFile(file, 'utf8', function(err, data){
	content = data;
	console.log(data);
	request.put('https://content.dropboxapi.com/1/files_put/auto/'+path, {
	    headers: {Authorization: 'Bearer '+ token}, body: content}, function(error, response, body){
		if(error) {
		    console.log("Error: "+error);
		    return;
		}
		console.log("Uploaded File");
            });
    });
}
function getFile() {
    request.get('https://content.dropboxapi.com/1/files/auto/shivkanthb.pdf', {
	headers: {Authorization: 'Bearer '+token},
    }, function(error, response, body) {
	if(error) {
	    console.log("Error: "+error);
	    return;
	}
	fs.writeFile("file.pdf", "My name is Oliver Queen", "binary", function(err) {
	    if(err) {
		console.log("Error: "+error);
		return;
	    }
	    console.log("Downloaded file");
	});
    });
}
function getAccountInfo() {
    request.get('https://api.dropboxapi.com/1/account/info',{
	headers: {Authorization: 'Bearer ' + token},
    }, function(error, response, body) {
	if (error) {
	    console.log("Error: "+error);
	    return;
	}
	console.log(response['body']);
    });
}

function authorize() {
    var csrfToken = generateCSRFToken();
    request.get('https://www.dropbox.com/1/oauth2/authorize',{
	form: {
	    response_type: 'code',
	    client_id: 'tnhz6er0usemzyc'
	}
    }, function(error,response,body){
	console.log(response.body);
    });
}

function generateCSRFToken() {
    return crypto.randomBytes(18).toString('base64').replace(/\//g, '-').replace(/\+/g, '_');
}

function generateRedirectURI() {
    
}