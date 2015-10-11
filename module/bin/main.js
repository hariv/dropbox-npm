var http = require('http');
var https = require('https');
var crypto = require('crypto');
var request = require('request');
var argv = process.argv.slice(2);
var command = argv[0];

if(command === 'authorize') {
    authorize();
}

function authorize() {
    var csrfToken = generateCSRFToken();
    request.get('https://www.dropbox.com/1/oauth2/authorize',{
	form: {
	    response_type: 'code',
	    client_id: 'tnhz6er0usemzyc'
	}
    }, function(error,response,body){
	console.log(response);
    });
}

function generateCSRFToken() {
    return crypto.randomBytes(18).toString('base64').replace(/\//g, '-').replace(/\+/g, '_');
}

function generateRedirectURI() {
    
}