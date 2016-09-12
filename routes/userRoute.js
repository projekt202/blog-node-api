'use strict';

let restify = require('restify');

module.exports = function (server) {
    let UserController = require('../controllers/userController');
    let userController = new UserController();

    server.get({path: '/user/:id'}, restify.queryParser(),
        userController.get);

    server.put({path: '/user/:id'}, restify.queryParser(), restify.jsonBodyParser(),
        userController.update);

    server.post({path: '/user'}, restify.jsonBodyParser(),
        userController.create);
};
