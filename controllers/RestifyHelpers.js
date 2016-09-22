'use strict';
let restify = require('restify');

class BadRequestError extends Error{
    constructor(message, details){
        super({message: message});

        console.log(details);

        this.message = message;
        this.name = 'BadRequestError';
        this.details = details;

        Error.captureStackTrace(this, BadRequestError);
    }
}



if (restify.BadRequestError.prototype.toFriendlyErrors==null){
    restify.BadRequestError.prototype.toFriendlyErrors=function(){
        if(!this.errors)
            return null;

        var results = this.errors.map(e => {
                return {
                    property: e.path,
                    message:e.message == null ? null : e.message.replace(e.path,'').trim()
                }
            });


        return results;
    }
}