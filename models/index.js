/**
 * Created by reggie.samuel on 8/24/2016.
 */

'use strict';

let fs = require('fs');
let path = require('path');
let database = require('../database');
let _ = require('lodash');
let models = {};
let instance = null;

//Loop through all of the model files in this directory,
// import them into sequelize and add them to the models object
fs.readdirSync(__dirname).filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach((file) => {
    let modelName = file.replace(path.extname(file), '').replace('Model', '');

    models[modelName] = database.import(path.join(__dirname, file));
});

//Loop through the models object, obtain the property key names
// and wire up any associations
_.chain(models)
    .keys()
    .forEach((modelName) => {
        if ('instanceMethods' in models[modelName].options &&
            !_.isUndefined(models[modelName].options.instanceMethods.associate)) {
            models[modelName].options.instanceMethods.associate(models);
        }
    }).value();

class ModelManager {
    constructor() {
        if (instance) {
            return instance;
        }

        instance = this;
    }

    get models() {
        return models;
    }

    get db() {
        return database;
    }
}

module.exports = ModelManager;