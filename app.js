'use strict';

let restify = require('restify');
let config = require('./config');

//Restify api server
let server = restify.createServer({name: config.server.name, version: config.server.version});

try {
    server.use(restify.CORS())
        .use(restify.fullResponse())
        .use(restify.acceptParser(server.acceptable))
        .use(restify.queryParser());
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