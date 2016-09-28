'use strict';

module.exports = function (server) {
    let userController = new (require('../controllers/userController'))();

    server.get({path: '/users/:userId'},
        userController.get);

    server.put({path: '/users/:userId'},
        userController.update);

    server.post({path: '/users'},
        userController.create);
};
