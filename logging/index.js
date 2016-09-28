'use strict';

class Logger {
    constructor() {
        this.uuid = require('node-uuid');
        let winston = require('winston');
        this.logger = new winston.Logger({
            transports: [
                new winston.transports.Console({
                    handleExceptions: true,
                    json: true,
                    colorize: true,
                    timestamp: true,
                    prettyPrint: true
                })
            ],
            exitOnError: false
        });
    }

    log(type, message, data) {
        data = data || {};
        data.id = this.uuid.v4();
        this.logger.log(type, message, data);
        return data.id;
    }

    info(message, data) {
        return this.log('info', message, data);
    }

    warn(message, data) {
        return this.log('warn', message, data);
    }

    error(message, data) {
        return this.log('error', message, data);
    }

    processError(error, process, config){
        return this.log('error', `${error.name} : ${error.message}`, {
            name: 'ProcessException',
            stack: error.stack,
            process: process,
            config: config
        });
    }

    webError(request, response, route, error){
        return this.log('error', error.name || error.message, this.__toWebLogData(request, response, route, error));
    }

    __toWebLogData(request, response, route, error){
        return {
            request: {
                path: (route && route.path) ? route.path : null,
                url: (request && request.url) ? request.url : null,
                method: (request && request.method) ? request.method : null,
                params: (request && request.params) ? request.params : null,
                body: (request && request.body) ? request.body : null,
                headers: (request && request.headers) ? request.headers : null,
                query: (request) ? request.getQuery() : null,
                httpVersion: (request && request.httpVersion) ? request.httpVersion : null,
            },
            response: {
                statusCode: response.statusCode,
            },
            error: {
                message: (error && error.message) ? error.message : null,
                stack: (error && error.stack) ? error.stack : null,
                sql: (error && error.sql) ? error.sql : null,
                code: (error && error.original) ? error.original.code : null
            }
        }
    }
}

module.exports = new Logger();