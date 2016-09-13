'use strict';

let restify = require('restify');

module.exports = function (server) {
    let todoController = new (require('../controllers/todoController'));

    server.get({path: '/users/:userId/todos'}, restify.queryParser(),
        todoController.get);

    server.put({path: '/users/:userId/todos/:id'}, restify.queryParser(), restify.jsonBodyParser(),
        todoController.update);

    server.post({path: '/users/:userId/todos'}, restify.queryParser(), restify.jsonBodyParser(),
        todoController.create);

    server.del({path: '/users/:userId/todos/:id'}, restify.queryParser(),
        todoController.del);
};