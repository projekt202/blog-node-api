/**
 * Created by reggie.samuel on 8/24/2016.
 */
'use strict';

module.exports = function (sequelize, DataTypes) {
   return sequelize.define("user", {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                defaultValue: DataTypes.INTEGER,
                allowNull: false,
            },
            emailAddress: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    isEmail: true,
                    max: 50
                }
            },
            firstName: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    max: 50
                }
            }, lastName: {
                type: DataTypes.STRING(50),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    max: 50
                }
            }
        },
        {
            timestamps: true,
            freezeTableName: true
        });
};