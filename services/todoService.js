'use strict';

let Sequelize = require('sequelize');
let Promise = require('bluebird');
let ModelManager = require('../models');
let modelManager = new ModelManager();
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
        todo.userId = userId;
        return new Promise((resolve, reject) => {
            return modelManager.models.todo.create(todo)
                .then(resolve)
                .catch(Sequelize.ValidationError, (error) => {
                    reject(new serviceErrors.ValidationError(error));
                })
                .catch(reject);
        });
    }

    delete(userId, todoId) {
        return new Promise((resolve, reject) => {
            return getTodoByUserId(userId, todoId)
                .then((todo) => {
                    if(!todo){
                        resolve();
                    }
                    return todo.destroy()
                        .then(resolve)
                        .catch(resolve);
                })
                .catch(reject);
        });
    }
}
module.exports = TodoService;
