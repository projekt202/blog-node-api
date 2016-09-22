'use strict';
let errorModule = require('../errors');
let Sequelize = require('sequelize');
let Promise = require('bluebird');
let ModelManager = require('../models');
let modelManager = new ModelManager();
let UserService = require('./userService');

function getTodoByUserId(userId, todoId) {
    return new Promise((resolve, reject) => {
        return modelManager.models.todo.findOne({where: {userId: userId, id: todoId}})
            .then((todo) => {
                if (!todo) {
                    reject(new errorModule.ResourceNotFoundError('Todo not found.'));
                }
                else {
                    resolve(todo);
                }
            })
            .catch((error) => {
                reject(error);
            });
    });
}
class TodoService {
    getByUserId(userId) {
        return new Promise((resolve, reject) => {
            return modelManager.models.todo.findAll({where: {userId: userId}})
                .then((todos) => {
                    resolve(todos);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    update(userId, todoId, updatedTodo) {
        return new Promise((resolve, reject) => {
            return getTodoByUserId(userId, todoId)
                .then((todo) => {
                    return todo.updateAttributes(updatedTodo)
                        .then((todo) => {
                            resolve(todo);
                        })
                        .catch(Sequelize.ValidationError, (error) => {
                                reject(new errorModule.BadRequestError(error.toFriendlyError()));
                        })
                        .catch((error) => {
                            resolve(error);
                        });
                })
                .catch((error => {
                    reject(error);
                }));
        });
    }

    create(userId, todo) {
        return new Promise((resolve, reject) => {
            return new UserService().getUserById(userId)
                .then((user) => {
                    todo.userId = user.id;
                    return modelManager.models.todo.create(todo)
                        .then((createdTodo) => {
                            resolve(createdTodo);
                        })
                        .catch(Sequelize.ValidationError, (error) => {
                            reject(new errorModule.BadRequestError(error.toFriendlyError()));
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    resolve(error);
                });
        });
    }

    delete(userId, todoId) {
        return new Promise((resolve, reject) => {
            return getTodoByUserId(userId, todoId)
                .then((todo) => {
                    return todo.destroy()
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            resolve(error);
                        });
                })
                .catch((error => {
                    reject(error);
                }));
        });
    }
}
module.exports = TodoService;
