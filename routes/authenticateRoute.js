'use strict';

let restify = require('restify');

module.exports = function (server) {
    let authenticateController = new (require('../controllers/authenticateController'));

    server.post({path: '/authenticate'},
        authenticateController.check);
};