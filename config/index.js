'use strict';

let nconf = require('nconf');

exports.environment = process.env.NODE_ENV || 'development';

nconf.argv().env().file({file: __dirname + '/' + exports.environment + '.json'});

//Restify server settings
exports.server = {
    name: process.env.SERVER_NAME || nconf.get('server:name'),
    version: process.env.SERVER_VERSION || nconf.get('server:version'),
    port: process.env.SERVER_PORT || nconf.get('server:port')
};
