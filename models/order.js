const {_, DataTypes} = require('sequelize');

const sequelize = require('../utils/database');

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },

});

module.exports = Order;