'use strict';

let restify = require('restify');
let logging = require('./logging');
let config = require('./config');
let authentication = require('./security/authentication');
let authorization = require('./security/authorization');

process.on('uncaughtException', function (err) {
    var logId = logging.processError(err, process, config);

    console.error(`Process exception.  Check log id: ${logId}`);
    console.error(err);

    err = err || {};

    if (!(err.status >= 400 && err.status <= 499)) {
        process.nextTick( process.exit(1) );
    }
});

//*Setup the restify api server*/
let server = restify.createServer({name: config.server.name, version: config.server.version});

try {
    server.use(restify.CORS()) //allows cross domain resource requests
        .use(restify.fullResponse()) //allows the use of POST requests
        .use(restify.acceptParser(server.acceptable)) //parses out the accept header and ensures the server can respond to the client’s request
        .use(restify.queryParser()); //parses non-route values from the query string

    /*Enable security if set*/
    if(config.server.enableSecurity){
        server.use(authentication(server))
            .use(authorization(server));
    }
} catch (e) {
    logging.error('Cannot start server', e)
    process.nextTick( process.exit(1) );
    throw e;
}

/*Initialize Routes*/
require('./routes')(server);

/*Handle all uncaught exceptions.  These will be turned into 500 Internal Server Error responses and the details not leaked to the client*/
server.on('uncaughtException', (request, response, route, error) => {
    response.statusCode = 500;
    var logId = logging.webError(request, response, route, error);
    return response.send(500, {code: 'InternalServerError', message: 'An internal server error occurred', supportId: logId});
});

/*Start listening*/
server.listen(config.server.port, function () {
    logging.info(`${server.name} is listening at ${server.url}`);
});

module.exports.server = server;
module.exports.config = config;