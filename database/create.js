/**
 * Created by reggie.samuel on 8/25/2016.
 */
'use strict';

let database = require('./index');
let config = require('../config');

require('../models');

console.log(`Creating tables in database ${config.database.name} on ${config.database.host} using port ${config.database.port}`);

database.sync({force: true}).catch((error) => {
    console.log(`Table creation failed ${error}`);
    process.exit(1);
});