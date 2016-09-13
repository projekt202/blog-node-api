'use strict';
let restify = require('restify');
let todoService = new (require('../services/todoService'));
let errorModule = require('../errors');

class TodoController {
    get(req, res, next) {
        if (!req.params.userId) {
            throw new errorModule.BadRequestError('The user id is required.');
        }

        todoService.getByUserId(req.params.userId)
            .then((todos) => {
                res.send(todos);
                return next();
            })
            .catch(errorModule.BadRequestError, (e) => {
                return next(new restify.BadRequestError(e.message, e));
            })
            .catch((e) => {
                return next(new restify.InternalServerError(e.message, e));
            });
    }

    update(req, res, next) {
        if (!req.params.id || !req.params.userId) {
            return next(new restify.BadRequestError('The todo and user id\'s are required.'));
        }

        if (!req.body) {
            return next(new restify.BadRequestError('Missing todo information.'));
        }

        todoService.updateTodo(req.params.userId, req.params.id, req.body)
            .then((user) => {
                res.send(user);
                return next();
            })
            .catch(errorModule.BadRequestError, (e) => {
                return next(new restify.BadRequestError(e.message, e));
            })
            .catch(errorModule.ResourceNotFoundError, (e) => {
                return next(new restify.ResourceNotFoundError(e.message, e));
            })
            .catch((e) => {
                return next(new restify.InternalServerError(e.message, e));
            });
    }

    create(req, res, next) {
        if (!req.params.userId) {
            return next(new restify.BadRequestError('The user id is required.'));
        }

        if (!req.body) {
            return next(new restify.BadRequestError('Missing todo information.'));
        }

        todoService.createTodo(req.params.userId, req.body)
            .then((todo) => {
                res.send(todo);
                return next();
            })
            .catch(errorModule.BadRequestError, (e) => {
                return next(new restify.BadRequestError(e.message, e));
            })
            .catch(errorModule.ResourceNotFoundError, (e) => {
                return next(new restify.ResourceNotFoundError(e.message, e));
            })
            .catch((e) => {
                return next(new restify.InternalServerError(e.message, e));
            });
    }

    del(req, res, next) {
        if (!req.params.id || !req.params.userId) {
            return next(new restify.BadRequestError('The todo and user id\'s are required.'));
        }

        todoService.deleteTodo(req.params.userId, req.params.id)
            .then(() => {
                res.send({});
                return next();
            })
            .catch(errorModule.ResourceNotFoundError, (e) => {
                return next(new restify.ResourceNotFoundError(e.message, e));
            })
            .catch((e) => {
                return next(new restify.InternalServerError(e.message, e));
            });
    }
}

module.exports = TodoController;