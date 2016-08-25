/**
 * Created by reggie.samuel on 8/24/2016.
 */

'use strict';

let config = require('../config');
let Sequelize = require('sequelize');

let sequelize = new Sequelize(
    config.database.name,
    config.database.username,
    config.database.password,
    {
        host: config.database.host,
        port: config.database.port,
        dialectOptions: {
            multipleStatements: true
        }
    }
);

module.exports = sequelize;