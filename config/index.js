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

exports.database = {
    name: process.env.DATABASE_NAME || nconf.get('database:name'),
    host: process.env.DATABASE_HOST || nconf.get('database:host'),
    username: process.env.DATABASE_USERNAME || nconf.get('database:username'),
    password: process.env.DATABASE_PASSWORD || nconf.get('database:password'),
    port: process.env.DATABASE_PORT || nconf.get('database:port'),
    dialect: process.env.DATABASE_DIALECT || nconf.get('database:dialect')
};

