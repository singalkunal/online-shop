const {_, DataTypes} = require('sequelize');

const sequelize = require('../utils/database');


const OrderItem = sequelize.define('orderItem', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        primaryKey: true,
        autoIncrement: true
    },
    quantity: {
        type: DataTypes.INTEGER
    }
});

module.exports = OrderItem;