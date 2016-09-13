'use strict';

let restify = require('restify');

module.exports = function (server) {
    let UserController = require('../controllers/userController');
    let userController = new UserController();

    server.get({path: '/users/:id'}, restify.queryParser(),
        userController.get);

    server.put({path: '/users/:id'}, restify.queryParser(), restify.jsonBodyParser(),
        userController.update);

    server.post({path: '/users'}, restify.jsonBodyParser(),
        userController.create);
};
