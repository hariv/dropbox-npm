var http = require('http');
var https = require('https');
var crypto = require('crypto');
var request = require('request');
var fs = require('fs');
var argv = process.argv.slice(2);
var command = argv[0];
var token = argv[1];

function DropboxClient(token) {
    this.token = token;
    this.fileOperator = new FileOperations(this.token);
    this.accountInformant = new AccountInformation(this.token);
}

function AccountInformation(token) {
    this.token = token;
    this.url = 'https://api.dropboxapi.com/1/account/info';
    
    this.getAccountInfo = function() {
	request.get(this.url, {
	    headers: {Authorization: 'Bearer '+this.token}}, function(error, response, data){	
		if(error) {
		    console.log('Error '+error);
		    return;
		}
		console.log(response['body']);
	    });
    };
}

function FileOperations(token) {
    this.token = token;
    this.url = 'https://api.dropbox.com/1/fileops';
    this.formData = new Object();
 
    this.performOperation = function(action, root, path1, path2) {
	this.formData.root = root;
	if(path2) {
	    this.formData.from_path = path1;
	    this.formData.to_path = path2;
	}
	else {
	    this.formData.path = path1;
	}
	request.post(this.url+'/'+action, {
	    headers: {Authorization: 'Bearer '+this.token}, formData: this.formData}, function(error, response, data){
		if(error) {
		    console.log("Error "+error);
		    return;
		}
		console.log(action+' done');
		console.log(response['body']);
	    });
    }
}
var dropboxClient = new DropboxClient(token);
if(command === 'authorize') {
    authorize();
}
else if(command === 'info') {
    dropboxClient.accountInformant.getAccountInfo();
}
else if(command === 'getFile') {
    getFile();
}
else if(command === 'putFile') {
    putFile();
}
else if(command === 'metadata') {
    getMetadata();
}
else if(command === 'copyFile') {
    dropboxClient.fileOperator.performOperation('copy',argv[2], argv[3], argv[4]);
}
else if(command === 'createFolder') {
    dropboxClient.fileOperator.performOperation('create_folder',argv[2], argv[3]);
}
else if(command === 'deleteFile') {
    dropboxClient.fileOperator.performOperation('delete', argv[2], argv[3]);
}
else if(command === 'moveFile') {
    dropboxClient.fileOperator.performOperation('move',argv[2], argv[3], argv[4]);
}

function getMetadata() {
    var path = argv[2];
    request.get('https://api.dropboxapi.com/1/metadata/auto/'+path, {
	headers: {Authorization: 'Bearer '+ token}, 
    }, function(error, response, body){
	if(error) {
	    console.log("Error: "+error);
	    return;
	}
	console.log(response['body']);
    });
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
	    console.log(response['body']);
	});
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