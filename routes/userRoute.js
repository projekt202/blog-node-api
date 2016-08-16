/**
 * Created by reggie.samuel on 8/1/2016.
 */

'use strict';

let restify = require('restify');

module.exports = function (server) {
    let userControllerModule = require('../controllers/userController');
    let userController = new userControllerModule();

    server.get({path: '/user/:id'}, restify.queryParser(),
        userController.getUserById);

    server.put({path: '/user'}, restify.jsonBodyParser(),
        userController.updateUser);

    server.post({path: '/user'}, restify.jsonBodyParser(),
        userController.createUser);
};