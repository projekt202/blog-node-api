'use strict';

let Sequelize = require('sequelize');
let Promise = require('bluebird');
let ModelManager = require('../models');
let modelManager = new ModelManager();
let UserService = require('./userService');
let serviceErrors = require('./serviceErrors');

function getTodoByUserId(userId, todoId) {
    return new Promise((resolve, reject) => {
        return modelManager.models.todo.findOne({where: {userId: userId, id: todoId}})
            .then((todo) => {
                resolve(todo);
            })
            .catch(reject);
    });
}

class TodoService {
    getByUserId(userId) {
        return new Promise((resolve, reject) => {
            return modelManager.models.todo.findAll({where: {userId: userId}})
                .then(resolve)
                .catch(reject);
        });
    }

    update(userId, todoId, updatedTodo) {
        return new Promise((resolve, reject) => {
            return getTodoByUserId(userId, todoId)
                .then((todo) => {
                    return todo.updateAttributes(updatedTodo)
                        .then(resolve)
                        .catch(Sequelize.ValidationError, (error) => {
                            reject(new serviceErrors.ValidationError(error));
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    create(userId, todo) {
        return new Promise((resolve, reject) => {
            return new UserService().getUserById(userId)
                .then((user) => {
                    todo.userId = user.id;
                    return modelManager.models.todo.create(todo)
                        .then(resolve)
                        .catch(Sequelize.ValidationError, (error) => {
                            reject(new serviceErrors.ValidationError(error));
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    delete(userId, todoId) {
        return new Promise((resolve, reject) => {
            return getTodoByUserId(userId, todoId)
                .then((todo) => {
                    return todo.destroy()
                        .then(resolve)
                        .catch(resolve);
                })
                .catch(reject);
        });
    }
}
module.exports = TodoService;
