'use strict';

let database = require('./index');
let config = require('../config');

require('../models');

console.log(`Creating tables in database ${config.database.name} on ${config.database.host} using port ${config.database.port}`);

database.sync({force: true}) /*force: true will drop tables before creating them*/
    .catch((error) => {
        console.log('Table creation failed', error);
        process.exit(1);
    });
