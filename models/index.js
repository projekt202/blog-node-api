/**
 * Created by reggie.samuel on 8/24/2016.
 */

'use strict';

let fs = require("fs");
let path = require("path");
let database = require("../database");
let _ = require('lodash');
let models = {};
let instance = null;

fs.readdirSync(__dirname).filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach((file) => {
    let modelName = file.replace(path.extname(file), '').replace('Model', '');

    models[modelName] = database.import(path.join(__dirname, file));
});

_.chain(models)
    .keys()
    .forEach((modelName) => {
        if ('associate' in models[modelName]) {
            models[modelName].associate(database);
        }
    }).value();

class ModelManager{
    constructor(){
        if(instance){
            return instance;
        }

        instance = this;
    }

    get models(){
        return models;
    }

    get db(){
        return database;
    }
}

module.exports = ModelManager;