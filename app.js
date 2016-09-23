'use strict';

let restify = require('restify');
let config = require('./config');
let authentication = require('./security/authentication');
let authorization = require('./security/authorization');

//Restify api server
let server = restify.createServer({name: config.server.name, version: config.server.version});

try {
    server.use(restify.CORS()) //allows cross domain resource requests
        .use(restify.fullResponse()) //allows the use of POST requests
        .use(restify.acceptParser(server.acceptable)) //parses out the accept header and ensures the server can respond to the client’s request
        .use(restify.queryParser()) //parses non-route values from the query string
        .use(authentication)
        .use(authorization(server))

} catch (e) {
    console.log('Cannot start server', e)
    process.exit(1);
    throw e;
}

//Initialize Routes
require('./routes')(server);


/*Handle all uncaught exceptions.  These will be turned into 500 Internal Server Error responses and the details not leaked to the client*/
server.on('uncaughtException', function(request, response, route, error) {
    console.log('Exception thrown \n %s', error.stack);
    response.send(500, {code: 'InternalServerError', message: 'An internal server error occurred'})
    return ;
});


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
        console.log('after');
        //console.log(errData)
    }
});

module.exports.server = server;
module.exports.config = config;