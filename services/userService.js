'use strict';

let Sequelize = require('sequelize');
let Promise = require('bluebird');
let ModelManager = require('../models');
let modelManager = new ModelManager();
let serviceErrors = require('./serviceErrors');


function cleanOutgoingUser(user){
    if(!user)
        return user;
    delete user.dataValues.password;
    return user;
}

class UserService {
    getById(id) {
        return new Promise((resolve, reject) => {
            return modelManager.models.user.findById(id)
                .then((user) => {
                    resolve(cleanOutgoingUser(user));
                })
                .catch(reject);
        });
    }

    getPasswordForEmail(emailAddress, password) {
        return new Promise((resolve, reject) => {
            return modelManager.models.user.findOne({attributes: ['id', 'password'], where: {emailAddress: emailAddress}})
                .then((user) => {
                    resolve(user);
                })
                .catch(reject);
        });
    }

    update(userId, updatedUser) {
        return new Promise((resolve, reject) => {
            return modelManager.models.user.findById(userId)
                .then((user) => {
                    if(!user)
                        resolve(null);

                    return user.updateAttributes(updatedUser)
                        .then((user) => {
                            resolve(cleanOutgoingUser(user));
                        })
                        .catch(Sequelize.ValidationError, (validationError) => {
                            reject(new serviceErrors.ValidationError(validationError))
                        })
                        .catch(reject);
                })
                .catch(reject);
        });
    }

    create(user) {
        return new Promise((resolve, reject) => {
            return modelManager.models.user.create(user)
                .then((createdUser) => {
                    resolve(cleanOutgoingUser(createdUser));
                })
                .catch(Sequelize.ValidationError, (validationError) => {
                    reject(new serviceErrors.ValidationError(validationError))

                })
                .catch(reject);
        });
    }
}

module.exports = UserService;
