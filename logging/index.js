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

    webError(request, response, route, error){
        return this.log('error', error.name || error.message,   this.__toLogData(request, response, route, error))
    }

    __toLogData(request, response, route, error){
        return {
            

            url: request.getPath() ? request.getPath() : null,
            statusCode: response.statusCode ? response.statusCode : null,
            method: request.method ? request.method : null,
            route: request.route ? request.route : null,
            params: request.params ? request.params : null,
            query: request.getQuery(),
            httpVersion: request.httpVersion ? request.httpVersion : null,
            headers: request.headers ? request.headers : null,
            //accountId: request.account ? request.account.id : null,
            requestBody: request.body ? request.body : null,
            //responseBody: response._data ? response._data : null,
            errorMessage: (error && error.message) ? error.message : null,
            stack: (error && error.stack) ? error.stack : null,
            response: response
        }
    }
}

module.exports = new Logger();