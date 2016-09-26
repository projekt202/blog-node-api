'use strict';

let restify = require('restify');
let logging = require('./logging');
let config = require('./config');
let authentication = require('./security/authentication');
let authorization = require('./security/authorization');

process.on('uncaughtException', function (err) {
    console.log('==== process uncaughtException');
    err = err || {};
    console.log('======== ', arguments);
    if (!(err.status >= 400 && err.status <= 499)) {
        process.nextTick( process.exit(1) );
    }
});

//Restify api server
let server = restify.createServer({name: config.server.name, version: config.server.version});

try {
    server.use(restify.CORS()) //allows cross domain resource requests
        .use(restify.fullResponse()) //allows the use of POST requests
        .use(restify.acceptParser(server.acceptable)) //parses out the accept header and ensures the server can respond to the client’s request
        .use(restify.queryParser()) //parses non-route values from the query string
        .use(restify.jsonBodyParser())
        .use(authentication(server))
        .use(authorization(server))
} catch (e) {
    logging.error('Cannot start server', e)
    process.exit(1);
    throw e;
}

//Initialize Routes
require('./routes')(server);

/*Handle all uncaught exceptions.  These will be turned into 500 Internal Server Error responses and the details not leaked to the client*/
server.on('uncaughtException', (request, response, route, error) => {
    response.statusCode = 500;
    var logId = logging.webError(request, response, route, error);
    return response.send(500, {code: 'InternalServerError', message: 'An internal server error occurred. Reference', supportId: logId});
});

server.listen(config.server.port || 3000, function () {
    logging.info(`${server.name} is listening at ${server.url}`);
});

server.on('after',  (request, response, route, error) => {
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