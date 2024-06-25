const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');
const accessoire = require('./AccessoireModel');

const acceTeleviseur = sequelize.define('acceTeleviseur', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    televiseur:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    accessoire:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = acceTeleviseur;