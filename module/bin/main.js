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

    this.userOperator = new UsersOperations(this.token);

    this.copy = function(from_path, to_path) {
	this.fileOperator.performOperation({action: 'copy', from_path: from_path, to_path: to_path});
    };

    this.createFolder = function(path) {
	this.fileOperator.performOperation({action: 'create_folder', path: path});
    }
    
    this.delete = function(path) {
	this.fileOperator.performOperation({action: 'delete', path: path});
    }
    
    this.getMetadata = function(path, include_media_info) {
	this.fileOperator.performOperation({action: 'get_metadata', path: path, include_media_info: include_media_info});
    }
    
    this.listFolder = function(path, recursive, include_media_info, include_deleted) {
	this.fileOperator.performOperation({action: 'list_folder', path: path, recursive: recursive, include_media_info: include_media_info, include_deleted: include_deleted});
    }
    
    this.listFolderContinue = function(cursor) {
	this.fileOperator.performOperation({action: 'list_folder/continue', cursor: cursor});
    }
    
    this.getLatestCursor = function(path, recursive, include_media_info, include_deleted) {
	this.fileOperator.performOperation({action: 'list_folder/get_latest_cursor', path: path, recursive: recursive, include_media_info: include_media_info, include_deleted: include_deleted});
    }

    this.longPoll = function(cursor, timeout) {
	this.fileOperator.performOperation({action: 'list_folder/longpoll', cursor: cursor, timeout: timeout});
    }

    this.listRevisions = function(path, limit) {
	this.fileOperator.performOperation({action: 'list_revisions', path: path, limit: limit});
    }

    this.move = function(from_path, to_path) {
	this.fileOperator.performOperation({action: 'move', from_path: from_path, to_path: to_path});
    }
    
    this.permanentlyDelete = function(path) {
	this.fileOperator.performOperation({action: 'permanently_delete', path: path});
    }
    
    this.restore = function(path, rev) {
	this.fileOperator.performOperation({action: 'restore', path: path, rev: rev});
    }

    // user operations

    this.getCurrentAccount = function () {
        this.userOperator.performOperation({action:'get_current_account'});
    }

    this.getSpaceUsage = function () {
        this.userOperator.performOperation({action:'get_space_usage'});
    }
    
    this.getAccount = function (account_id) {
        this.userOperator.performOperation({action:'get_account',account_id:account_id});
    }
}

function FileOperations(token) {
    this.token = token;
    this.url = 'https://api.dropbox.com/2/files';
    this.performOperation = function(jsonPayload) {
	var action = jsonPayload.action;
	delete jsonPayload.action;
	jsonPayload = JSON.parse(JSON.stringify(jsonPayload));
	request({
	    url: this.url+'/'+ action,
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

function UsersOperations(token) {
    this.token = token;
    this.url = 'https://api.dropbox.com/2/users';
    this.performOperation = function(jsonPayload) {
        var action = jsonPayload.action;
        delete jsonPayload.action;
        jsonPayload = JSON.parse(JSON.stringify(jsonPayload));
        if(Object.keys(jsonPayload).length == 0)
        {
            var options = {
                url: this.url+'/'+ action,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.token
                }
            };
        }
        else
        {
            var options = {
                url: this.url+'/'+ action,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer '+this.token,
                     'Content-Type': 'application/json'
                },
                 json: jsonPayload
            };
        }

        request(options, function(error, response, data){
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
    dropboxClient.createFolder(argv[2]);
}
else if(command === 'delete') {
    dropboxClient.delete(argv[2]);
}
else if(command === 'getMetadata') {
    dropboxClient.getMetadata(argv[2], argv[3]);
}
else if(command === 'listFolder') {
    dropboxClient.listFolder(argv[2], argv[3], argv[4]);
}
else if(command === 'listFolderContinue') {
    dropboxClient.listFolder(argv[2]);
}
else if(command === 'getLatestCursor') {
    dropboxClient.getLatestCursor(argv[2], argv[3], argv[4]);
}
else if(command === 'longpoll') {
    dropboxClient.longPoll(argv[2], argv[3]);
}
else if(command === 'listRevisions') {
    dropboxClient.listRevisions(argv[2], argv[3]);
}
else if(command === 'move') {
    dropboxClient.move(argv[2], argv[3]);
}
else if(command === 'permanentlyDelete') {
    dropboxClient.permanentlyDelete(argv[2]);
}
else if(command === 'restore') {
    dropboxClient.restore(argv[2], argv[3]);
}

//user commands
else if(command === 'getCurrentAccount') {
    dropboxClient.getCurrentAccount();
}
else if(command === 'getSpaceUsage') {
    dropboxClient.getSpaceUsage();
}
else if(command === 'getAccount') {
    dropboxClient.getAccount(argv[2]);
}


