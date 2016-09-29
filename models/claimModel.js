'use strict';

module.exports = function (sequelize, DataTypes) {
    var claim = sequelize.define('claim', {
            token: {
                type: DataTypes.STRING(1024),
                primaryKey: true,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    max: 1024
                }
            }, signingKey: {
                type: DataTypes.STRING(1024),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    max: 1024
                }
            }, expiresAt: {
                type: DataTypes.DATE ,
                allowNull: false
            }
        },
        {
            timestamps: false, /*Don't need timestamp columns here*/
            freezeTableName: true
        });

    return claim;
};