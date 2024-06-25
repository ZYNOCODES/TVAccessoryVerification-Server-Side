const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const accessoire = sequelize.define('accessoire', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    nom:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    quantite: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = accessoire;