'use strict';
let Sequelize = require('sequelize');

if (Sequelize.ValidationError.prototype.toFriendlyErrors==null){
    Sequelize.ValidationError.prototype.toFriendlyErrors=function(){
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