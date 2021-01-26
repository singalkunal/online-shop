const {_, DataTypes} = require('sequelize');

const sequelize = require('../utils/database');


const CartItem = sequelize.define('cartItem', {
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

module.exports = CartItem;