'use strict';
let passwordHash = require('password-hash');

module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        emailAddress: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                max: 255
            }
        },
        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 100
            }
        },
        lastName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 100
            }
        },
        password: {
            type: DataTypes.STRING(1024),
            allowNull: false,
            set      : function(val) {
                this.setDataValue('password', passwordHash.generate(val));
            },
            validate: {
                notEmpty: true,
                max: 1024
            }
        }
    },
        {
            timestamps: true,
            freezeTableName: true,
            instanceMethods: {
                /*This method is called by the models/index.js code*/
                associate: function (models) {
                    /*Associate the todoModels to the user object so you can navigate as user.toDos as an array*/
                    user.hasMany(models.todo, {
                        as: 'toDos',
                        onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'userId',
                            allowNull: false
                        }
                    });

                    /*Associate the api claims to the user object so you can navigate as user.claims as an array*/
                    user.hasMany(models.claim, {
                        as: 'claims',
                        onDelete: 'CASCADE',
                        foreignKey: {
                            name: 'userId',
                            allowNull: false
                        }
                    });
                }
            }
        });
    return user;
};
