'use strict';

module.exports = function (server) {
    let todoController = new (require('../controllers/todoController'));

    server.get({path: '/users/:userId/todos'},
        todoController.get);

    server.put({path: '/users/:userId/todos/:todoId'},
        todoController.update);

    server.post({path: '/users/:userId/todos'},
        todoController.create);

    server.del({path: '/users/:userId/todos/:todoId'},
        todoController.del);
};