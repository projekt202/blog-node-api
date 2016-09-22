'use strict';

let restify = require('restify');
let config = require('./config');
let authenticate = require('./security/authentication');

//Restify api server
let server = restify.createServer({name: config.server.name, version: config.server.version});

function handleInternalServerErrors(request, response, next){
    if (response.statusCode == 500) {
        //TODO: Log the actual error before replaceing the message
        response.send(500, 'Internal Server Error')
    }

    next();
}

try {
    server.use(restify.CORS()) //allows cross domain resource requests
        .use(restify.fullResponse()) //allows the use of POST requests
        .use(restify.acceptParser(server.acceptable)) //parses out the accept header and ensures the server can respond to the client’s request
        .use(restify.queryParser()) //parses non-route values from the query string
        .use(authenticate)
} catch (e) {
    process.exit(1);
    throw e;
}

//Initialize Routes
require('./routes')(server);


server.use(handleInternalServerErrors);

server.listen(config.server.port || 3000, function () {
    console.log('%s is listening at %s', server.name, server.url);
});



server.on('after', function (request, response, route, error) {
    if (error || (response.statusCode !== 200 && response.statusCode !== 404)) {
        var errData = {
            url: request.getPath() ? request.getPath() : null,
            statusCode: response.statusCode ? response.statusCode : null,
            method: request.method ? request.method : null,
            route: request.route ? request.route : null,
            params: request.params ? request.params : null,
            query: request.getQuery(),
            httpVersion: request.httpVersion ? request.httpVersion : null,
            headers: request.headers ? request.headers : null,
            //accountId: request.account ? request.account.id : null,
            requestBody: request.body ? request.body : null,
            //responseBody: response._data ? response._data : null,
            errorMessage: (error && error.message) ? error.message : null,
            stack: (error && error.stack) ? error.stack : null,
            response: response
        };

        console.log(errData)
    }
});

module.exports.server = server;
module.exports.config = config;