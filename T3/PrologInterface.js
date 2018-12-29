
/**
 * Sends a request to prolog server
 * @param requestString Request string
 * @param context Context to pass to callback.
 * @param onSuccess On success callback.
 * @param onError On error callback.
 * @param port Port to connect.
 */
function getPrologRequest(requestString, onSuccess, onError, port) {
    let requestPort = port || 8081;
    let request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess;

    request.onerror = onError || function(){console.log("Error waiting for response");};

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

function makeRequest(requestString,handleReply){
	getPrologRequest(requestString, handleReply);
}
			