/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// var messages = [{ objectId: 1, roomname: 'lobby', text: 'A message.', username: 'josh' }];
// var objectIdCounter = 1;

const _ = require('underscore');
const fs = require('fs');
const URL = require('url');

var messages = [];
var objectIdCounter = 0;

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};


var getReq = (status, request, response) => {

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  response.writeHead(status, headers);

  // test if query string exists
  // parse that part of the url and split at the question mark
  // split again at the equals sign to isolate the attribute
  // check the first char of attribute to see if negative or not
  // sort by that attribute in descending or ascending order depending on negative or pos
  // return the new sorted array

  var getParams = URL.parse(request.url, true);
  var orderBy = getParams.query.orderBy;
 

  if (orderBy !== undefined) {
    var attribute = orderBy;
    
    var iteratee = (message) => {
      return -message[attribute.slice(1)];
    };


    if (attribute[0] === '-') {
      var sortedMessages = _.sortBy(messages, iteratee);
      
    } else {
      var sortedMessages = _.sortBy(messages, attribtue);
    }

    var encoded = JSON.stringify({ results: sortedMessages });

    response.end(encoded);

  } else {
  
  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.;
    var encoded = JSON.stringify({ results: messages });

    response.end(encoded);

  }  
};


var postReq = (status, request, response) => {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  response.writeHead(status, headers);

  // var json = { results: ['Hello, World!'] };
  var requestObject = JSON.parse(request.body);
  objectIdCounter++;
  requestObject.objectId = objectIdCounter; 
  messages.push(requestObject);  

  var encoded = JSON.stringify({ results: messages });

  response.end(encoded);  
};

var putReq = (status, request, response) => {
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  response.writeHead(status, headers);

  // var json = { results: ['Hello, World!'] };
  var requestObject = JSON.parse(request.body);
  var objectId = requestObject.objectId;

  for (var i = 0; i < messages.length; i++) {
    if (messages[i].objectId === objectId) {
      messages[i].text = 
        (requestObject.text) ? requestObject.text : messages[i].text;
      messages[i].roomname = 
        (requestObject.roomname) ? requestObject.roomname : messages[i].roomname;
    }
  }

  // var encoded = JSON.stringify({ results: messages });

  response.end(); 
};

var requestHandler = function(request, response) {

  if (request.url.slice(0, 17) !== '/classes/messages') {
    response.writeHead(404, defaultCorsHeaders);
    response.end(JSON.stringify({ error: 'Bad request.' }));
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(200, defaultCorsHeaders);
    response.end();  
  }

  if (request.method === 'DELETE') {
    //parse object key
    // delete it from list of objects

    // grab the object ID to delete
    // var objectIdToDelete = request.url.split('?')[1].split('=')[1];

    var deleteParams = URL.parse(request.url, true);
    // var deleteParams = new URLSearchParams(deleteURL.searchParams);
    var objectIdToDelete = deleteParams.query.q;

    messages = messages.filter((message) => {
      if (message.objectId !== Number(objectIdToDelete)) {
        return true;
      } else {
        return false;
      }
    });

    response.writeHead(204, defaultCorsHeaders);
    response.end();
  }

  if (request.method === 'GET' ) {
    var url = request.url;

    if (url === '/') {
      // index case
      
    }

    if (url.indexOf('.js') !== -1) {
      // return js file
    }

    if (url.indexOf('.css') !== -1) {
      // return css
    }

    if (url.indexOf('.html') !== -1) {
      
    }


    getReq(200, request, response);
  }

  if (request.method === 'POST' || request.method === 'PUT') {
    var postReqString = '';

    request.on('data', (chunk) => {
      postReqString += chunk.toString('utf8');
    });

    request.on('end', () => {
      request.body = postReqString;
      
      if (request.method === 'POST') {
        postReq(201, request, response);
      } else {
        putReq(204, request, response);
      }  
    });
  }


  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // // The outgoing status.
  // var statusCode = 200;

  // // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;

  // // Tell the client we are sending them plain text.
  // //
  // // You will need to change this if you are sending something
  // // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'application/json';

  // // .writeHead() writes to the request line and headers of the response,
  // // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // // Make sure to always call response.end() - Node may not send
  // // anything back to the client until you do. The string you pass to
  // // response.end() will be the body of the response - i.e. what shows
  // // up in the browser.
  // //
  // // Calling .end "flushes" the response's internal buffer, forcing
  // // node to actually send all the data over to the client.
  // var json = { results: ['Hello, World!'] };
  // var encoded = JSON.stringify(json);

  // response.end(encoded);
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.




module.exports.requestHandler = requestHandler;