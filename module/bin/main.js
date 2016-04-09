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
    this.copy = function(from_path, to_path) {
	this.fileOperator.performOperation('copy', from_path, to_path);
    };
    this.createFolder = function(path) {
	console.log("inside create folder");
	this.fileOperator.performOperation('create_folder', path);
    }
}

function FileOperations(token) {
    this.token = token;
    this.url = 'https://api.dropbox.com/2/files';
    this.performOperation = function(action, path1, path2) {
	var jsonPayload = new Object();
	if(path2) {
	    jsonPayload.from_path = path1;
	    jsonPayload.to_path = path2;
	}
	else {
	    jsonPayload.path = path1;
	}
	console.log(jsonPayload);
	request({
	    url: this.url+'/'+action,
	    method: 'POST',
	    headers: {
		'Authorization': 'Bearer '+this.token,
		'Content-Type': 'application/json'
	    },
	    json: jsonPayload
	}, function(error, response, data){
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
else if(command === 'copy') {
    dropboxClient.copy(argv[2], argv[3]);
}
else if(command === 'createFolder') {
    console.log("Command is create folder");
    dropboxClient.createFolder(argv[2]);
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
