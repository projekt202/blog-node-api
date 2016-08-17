/**
 * Created by reggie.samuel on 8/1/2016.
 */

'use strict';

let errorModule = require('../errors');
let _ = require('lodash');

class UserService {
    getUserById(id) {
        if (!id || !_.isNumber(_.toNumber(id))) {
            throw new errorModule.BadRequestError('id is required');
        }

        return new Promise((resolve) => {
            resolve({id: id, emailAddress: 'test@gmail.com'});
        });
    }

    updateUser(user) {
        if (!user) {
            throw new errorModule.BadRequestError('user is required');
        }

        return new Promise((resolve) => {
            resolve(user);
        });
    }

    createUser(user) {
        if (!user.emailAddress) {
            throw new errorModule.BadRequestError('email address is required');
        }

        if (!user.firstName) {
            throw new errorModule.BadRequestError('first name is required');
        }

        if (!user.lastName) {
            throw new errorModule.BadRequestError('last name is required');
        }

        return new Promise((resolve) => {
            resolve(user);
        });
    }
}

module.exports = UserService;