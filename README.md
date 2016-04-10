![Nodedropbox]
A JavaScript wrapper for [dropbox-api v2] (https://www.dropbox.com/developers/documentation/http/documentation).

#How to use

To use the sdk, import the module and create an instance of the DropboxClient object with your [access token] (https://www.dropbox.com/developers/apps).

Usage: var dropboxClient = new DropboxClient(token);

This dropboxClient object provides a set of methods to access the endpoints mentioned below:

#Currently supported endpoints
## File operations
- **copy**, dropboxClient.copy(from_path, to_path). Copies file from the from_path to the to_path. The to_path will have the name of the newly created file/folder
- **create_folder**, dropboxClient.createFolder(path). Creates a new folder at the specified path.
- **delete**, dropboxClient.delete(). Deletes the file in the specified path
- **list_folder**, dropboxClient.listFolder(path, recursiveFlag, mediaInfoFlag, deletedFlag). This lists all folders in path. Other parameters are boolean optionals that corresponds to whether or not recursive listing is required, media information is required and if deleted files are to be listed. The return value returns a cursor and a flag has_more that indicates if the listing is complete or not.
- **list_folder/continue**, dropboxClient.listFolderContinue(cursor). This continues the listing based on the cursor returned by the list_folder call.
- **list_folder/get_latest_cursor**, dropboxClient.getLatestCursor(path, recursiveFlag, mediaInfoFlag, deletedFlag). This lists the last set among the list of folders under path. Parameters are identical to those in list_folder.
- **list_folder/longpoll**, dropboxClient.longPoll(cursor, timeout). Returns a continuous listing corresponding the a cursor returned from list_folder. Timeout refers to when the listing should be stopped.
- **list_revisions**, dropboxClient.listRevisions(path, limit). Returns the number of revisions of the file in path, with limit being an optional parameterreferring to the number of versions to return.
- **move**, dropboxClient.move(from_path, to_path). Identical to copy, but moves the file from from_path to to_path instead of copying.
- **permanently_delete**, dropboxClient.permanentlyDelete(path). Deletes the file in path permanently.
- **restore**, dropboxClient.restore(path, rev). Restores the file mentioned in path. Rev is an optional parameter that can be passed to restore a particular version of a file.
- **search**, dropboxClient.search(path, query, start, max_results, mode). Returns all results within path that satisfy query. start, max_results and mode are optional parameters that are used to restrict the types and number of files to be returned by the search.

## Share Operations
- **check_job_status**, dropboxClient.checkJobStatus(async_job_id). Returns a json object having details of a particular job.
- **check_share_job_status**, dropboxClient.checkShareJobStatus(async_job_id). Returns a json object having details of a particlar shared job.
- **create_shared_link**, 
- **create_shared_link_with_settings**
- **get_folder_metadata**
- **get_shared_link_file**

## User Operations
- **get_account**
- **get_account_batch**
- **get_current_account**
- **get_space_usage**


