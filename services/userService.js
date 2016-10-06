'use strict';

let Sequelize = require('sequelize');
let Promise = require('bluebird');
let ModelManager = require('../models');
let modelManager = new ModelManager();
let serviceErrors = require('./serviceErrors');
let passwordHash = require('password-hash');

function cleanOutgoingUser(user){
    if(!user)
        return user;
    delete user.dataValues.password;
    return user;
}

class UserService {
    getById(userId) {
        return new Promise((resolve, reject) => {
            modelManager.models.user.findById(userId)
                .then((user) => {
                    resolve(cleanOutgoingUser(user));
                })
                .catch(reject);
        });
    }

    validatePassword(emailAddress, password) {
        return new Promise((resolve, reject) => {
            this.getPasswordForEmail(emailAddress)
                .then((user)=> {
                    if (!passwordHash.verify(password, user.password)) {
                        reject(new serviceErrors.InvalidUserPassword());
                    }
                    else {
                        resolve(user);
                    }
                })
                .catch(reject);
        });
    }

    getPasswordForEmail(emailAddress) {
        return new Promise((resolve, reject) => {
            modelManager.models.user.findOne({attributes: ['id', 'password'], where: {emailAddress: emailAddress}})
                .then(resolve)
                .catch(reject);
        });
    }

    update(userId, updatedUser) {
        return new Promise((resolve, reject) => {
            this.getById(userId)
                .then((user) => {
                    if (!user) {
                        resolve(null);
                    }
                    else {
                        user.updateAttributes(updatedUser)
                            .then((user) => {
                                resolve(cleanOutgoingUser(user));
                            })
                            .catch(Sequelize.ValidationError, (validationError) => {
                                reject(new serviceErrors.ValidationError(validationError));
                            })
                            .catch((error) => {
                                throw error;
                            });
                    }
                })
                .catch(reject);
        });
    }

    create(user) {
        return new Promise((resolve, reject) => {
            modelManager.models.user.create(user)
                .then((createdUser) => {
                    resolve(cleanOutgoingUser(createdUser));
                })
                .catch(Sequelize.ValidationError, (validationError) => {
                    reject(new serviceErrors.ValidationError(validationError));
                })
                .catch(reject);
        });
    }
}

module.exports = UserService;
