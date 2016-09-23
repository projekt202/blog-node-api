'use strict';

let restify = require('restify');

module.exports = function (server) {
    let userController = new (require('../controllers/userController'))();

    server.get({path: '/users/:userId'}, restify.queryParser(),
        userController.get);

    server.put({path: '/users/:userId'}, restify.queryParser(), restify.jsonBodyParser(),
        userController.update);

    server.post({path: '/users'}, restify.jsonBodyParser(),
        userController.create);
};
