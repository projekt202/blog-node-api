'use strict';

let restify = require('restify');
let todoService = new (require('../services/todoService'))();
let serviceErrors = require('../services/serviceErrors');
let controllerErrors = require('./controllerErrors');

class TodoController {
    get(req, res, next) {
        if (!req.params.userId) {
            throw new controllerErrors.BadRequestError('The user id is required.');
        }

        todoService.getByUserId(req.params.userId)
            .then((todos) => {
                if(!todos)
                    return next(new controllerErrors.ResourceNotFoundError());

                res.send(todos);
                return next();
            })
            .catch(next);
    }

    update(req, res, next) {
        if (!req.params.id || !req.params.userId) {
            return next(new restify.BadRequestError('The todo and user id\'s are required.'));
        }

        if (!req.body) {
            return next(new restify.BadRequestError('Missing todo information.'));
        }

        todoService.update(req.params.userId, req.params.id, req.body)
            .then((user) => {
                res.send(user);
                return next();
            })
            .catch(serviceErrors.ValidationError, (e) => {
                return next(new controllerErrors.ValidationError(e));
            })
            .catch(next);
    }

    create(req, res, next) {
        if (!req.params.userId) {
            return next(new restify.BadRequestError('The user id is required.'));
        }

        if (!req.body) {
            return next(new restify.BadRequestError('Missing todo information.'));
        }

        todoService.create(req.params.userId, req.body)
            .then((todo) => {
                res.send(todo);
                return next();
            })
            .catch(serviceErrors.ValidationError, (e) => {
                return next(new controllerErrors.ValidationError(e));
            })
            .catch(next);
    }

    del(req, res, next) {
        if (!req.params.todoId || !req.params.userId) {
            return next(new restify.BadRequestError('The todo and user id\'s are required.'));
        }

        todoService.delete(req.params.userId, req.params.todoId)
            .then(() => {
                res.send(200);
                return next();
            })
            .catch(next);
    }
}

module.exports = TodoController;