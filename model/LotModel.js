const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const lot = sequelize.define('lot', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    numero:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startTime:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    endTime:{
        type: DataTypes.DATE,
        allowNull: false,
    },
    taille:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 600,
    },
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = lot;