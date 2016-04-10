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
    this.shareOperator = new ShareOperations(this.token);

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
    this.search = function(path, query, start, max_results, mode) {
        this.fileOperator.performOperation(({action:'search',path:path,query:query,start:start,max_results:max_results,mode:mode}));
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

    this.getAccountBatch = function(account_ids) {
        this.userOperator.performOperation({action:'get_account_batch',account_ids:account_ids});
    }

    // share operations
    
    this.checkJobStatus = function(async_job_id) {
	this.shareOperator.performOperation({action: 'check_job_status', async_job_id: async_job_id});
    }
    
    this.checkShareJobStatus = function(async_job_id) {
	this.shareOperator.performOperation({action: 'check_share_job_status', async_job_id: async_job_id});
    }

    this.createSharedLink = function(path, short_url, pending_upload) {
	if(pending_upload)
	    this.shareOperator.performOperation({action: 'create_shared_link', short_url: short_url, pending_upload: {.tag: pending_upload}});
	else
	    this.shareOperator.performOperation({action: 'create_shared_link', short_url: short_url});
    }

    this.createSharedLinkWIthSettings = function(path, requested_visibility, link_password, expires) {
	if(requested_visibility) 
	    this.shareOperator.performOperation({action: 'create_shared_link_with_settings', requested_visibility: {.tag: requested_visibility}, link_password: link_password, expires: expires});
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

function ShareOperations(token) {
    this.token = token;
    this.url = 'https://api.dropbox.com/2/sharing';
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
        if(Object.keys(jsonPayload).length == 0) {
            var options = {
                url: this.url+'/'+ action,
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.token
                }
            };
        }
        else {
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

function preprocessInput() {
    for(var i = 0; i < argv.length; i++) {
	if(argv[i] === 'DEFAULT')
	    argv[i] = undefined;
    }
}

var dropboxClient = new DropboxClient(token);
if(command === 'authorize') {
    authorize();
}
else if(command === 'copy') {
    preprocessInput();
    dropboxClient.copy(argv[2], argv[3]);
}
else if(command === 'createFolder') {
    preprocessInput();
    dropboxClient.createFolder(argv[2]);
}
else if(command === 'delete') {
    preprocessInput();
    dropboxClient.delete(argv[2]);
}
else if(command === 'getMetadata') {
    preprocessInput();
    console.log(argv[3]);
    dropboxClient.getMetadata(argv[2], argv[3]);
}
else if(command === 'listFolder') {
    preprocessInput();
    dropboxClient.listFolder(argv[2], argv[3], argv[4], argv[5]);
}
else if(command === 'listFolderContinue') {
    preprocessInput();
    dropboxClient.listFolder(argv[2]);
}
else if(command === 'getLatestCursor') {
    preprocessInput();
    dropboxClient.getLatestCursor(argv[2], argv[3], argv[4]);
}
else if(command === 'longpoll') {
    preprocessInput();
    dropboxClient.longPoll(argv[2], argv[3]);
}
else if(command === 'listRevisions') {
    preprocessInput();
    dropboxClient.listRevisions(argv[2], argv[3]);
}
else if(command === 'move') {
    preprocessInput();
    dropboxClient.move(argv[2], argv[3]);
}
else if(command === 'permanentlyDelete') {
    preprocessInput();
    dropboxClient.permanentlyDelete(argv[2]);
}
else if(command === 'restore') {
    preprocessInput();
    dropboxClient.restore(argv[2], argv[3]);
}

else if(command === 'search') {
    preprocessInput();
    dropboxClient.search(argv[2], argv[3],argv[4],argv[5],argv[6]);
}

//user commands
else if(command === 'getCurrentAccount') {
    preprocessInput();
    dropboxClient.getCurrentAccount();
}
else if(command === 'getSpaceUsage') {
    preprocessInput();
    dropboxClient.getSpaceUsage();
}
else if(command === 'getAccount') {
    preprocessInput();
    dropboxClient.getAccount(argv[2]);
}
else if(command === 'getAccountBatch') {
    var account_ids=[];
    for(var i=2;i< argv.length;i++)
    {
        account_ids.push(argv[i]);
    }
    dropboxClient.getAccountBatch(account_ids);
}
// share operations
else if(command === 'checkJobStatus') {
    preprocessInput();
    dropboxClient.checkJobStatus(argv[2]);
}

else if(command === 'checkShareJobStatus') {
    preprocessInput();
    dropboxClient.checkShareJobStatus(argv[2]);
}

else if(command === 'createSharedLink') {
    preprocessInput();
    dropboxClient.createSharedLink(argv[2], argv[3], argv[4]);
}

else if(command === 'createSharedLinkWithSettings') {
    preprocessInput();
    dropboxClient.createSharedLinkWithSettings(argv[2], argv[3], argv[4], argv[5]);    
}