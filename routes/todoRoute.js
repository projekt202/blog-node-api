/**
 * Created by reggie.samuel on 8/1/2016.
 */

'use strict';

let restify = require('restify');

module.exports = function (server) {
    let TodoController = require('../controllers/todoController');
    let todoController = new TodoController();

    server.get({path: '/user/:userId/todo'}, restify.queryParser(),
        todoController.get);

    server.put({path: '/user/:userId/todo/:id'}, restify.queryParser(), restify.jsonBodyParser(),
        todoController.update);

    server.post({path: '/user/:userId/todo'}, restify.queryParser(), restify.jsonBodyParser(),
        todoController.create);

    server.del({path: '/user/:userId/todo/:id'}, restify.queryParser(),
        todoController.del);
};