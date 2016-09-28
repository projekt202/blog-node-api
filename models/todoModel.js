'use strict';

module.exports = function (sequelize, DataTypes) {
    var todo = sequelize.define('todo', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        }, name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true,
                max: 50
            }
        }, content: {
            type: DataTypes.STRING(255),
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

    return todo;
};
