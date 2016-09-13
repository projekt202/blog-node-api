'use strict';
let errorModule = require('../errors');
let Sequelize = require('sequelize');
let Promise = require('bluebird');
let ModelManager = require('../models');
let modelManager = new ModelManager();

class UserService { 
    getById(id) {
        return new Promise((resolve, reject) => {
            return modelManager.models.user.findById(id)
                .then((user) => {
                    if (!user) {
                        reject(new errorModule.ResourceNotFoundError('User not found.'));
                    }
                    else {
                        resolve(user);
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    update(userId, updatedUser) {
        return new Promise((resolve, reject) => {
            return this.getUserById(userId)
                .then((user) => {
                    return user.updateAttributes(updatedUser)
                        .then((user) => {
                            resolve(user);
                        })
                        .catch(Sequelize.ValidationError, (error) => {
                            reject(new errorModule.BadRequestError(error.message));
                        })
                        .catch((error) => {
                            reject(error);
                        });
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    create(user) {
        return new Promise((resolve, reject) => {
            return modelManager.models.user.create(user)
                .then((createdUser) => {
                    resolve(createdUser);
                })
                .catch(Sequelize.ValidationError, (error) => {
                    reject(new errorModule.BadRequestError(error.message));
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

module.exports = UserService;
