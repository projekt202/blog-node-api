/**
 * Created by reggie.samuel on 8/1/2016.
 */

'use strict';

class BadRequestError extends Error{
    constructor(message){
        super({message: message});

        this.message = message;
        this.name = 'BadRequestError';

        Error.captureStackTrace(this, BadRequestError);
    }
}

class ResourceNotFoundError extends Error{
    constructor(message){
        super({message: message});

        this.message = message;
        this.name = 'ResourceNotFoundError';

        Error.captureStackTrace(this, ResourceNotFoundError);
    }
}

module.exports.BadRequestError = BadRequestError;
module.exports.ResourceNotFoundError = ResourceNotFoundError;