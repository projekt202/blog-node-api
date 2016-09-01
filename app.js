
'use strict';

let restify = require('restify');
let config = require('./config');

//Restify api server
let server = restify.createServer({name: config.server.name, version: config.server.version});

try {
    server.use(restify.CORS()) //allows cross domain resource requests
        .use(restify.fullResponse()) //allows the use of POST requests
        .use(restify.acceptParser(server.acceptable)) //parses out the accept header
        // and ensures the server can respond to the client’s request
        .use(restify.queryParser()); //parses non-route values from the query string
} catch (e) {

    process.exit(1);
    throw e;
}

//Initialize Routes
require('./routes')(server);

server.listen(config.server.port || 3000, function () {

    console.log('%s listening at %s', server.name, server.url);
});

module.exports.server = server;
module.exports.config = config;