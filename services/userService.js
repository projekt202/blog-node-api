/**
 * Created by reggie.samuel on 8/1/2016.
 */

'use strict';
let errorModule = require('../errors');
let Sequelize = require('sequelize');
let Promise = require('bluebird');
let ModelManager = require('../models');
let modelManager = new ModelManager();

class UserService {
    getUserById(id) {
        return new Promise((resolve, reject) => {
            return modelManager.models.user.findById(id)
                .then((user) => {
                    resolve(user);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    updateUser(user) {
        return new Promise((resolve, reject) => {
            return modelManager.models.user.update(user)
                .then((updatedUser) => {
                    resolve(updatedUser);
                })
                .catch(Sequelize.ValidationError, (error) => {
                    reject(new errorModule.BadRequestError(error.message))
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    createUser(user) {
        return new Promise((resolve, reject) => {
            return modelManager.models.user.create(user)
                .then((createdUser) => {
                    resolve(createdUser);
                })
                .catch(Sequelize.ValidationError, (error) => {
                    reject(new errorModule.BadRequestError(error.message))
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

module.exports = UserService;