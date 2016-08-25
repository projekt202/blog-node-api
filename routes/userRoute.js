/**
 * Created by reggie.samuel on 8/1/2016.
 */

'use strict';

let restify = require('restify');

module.exports = function (server) {
    let UserController = require('../controllers/userController');
    let userController = new UserController();

    server.get({path: '/user/:id'}, restify.queryParser(),
        userController.getUserById);

    server.put({path: '/user/:id'}, restify.queryParser(), restify.jsonBodyParser(),
        userController.updateUser);

    server.post({path: '/user'}, restify.jsonBodyParser(),
        userController.createUser);
};