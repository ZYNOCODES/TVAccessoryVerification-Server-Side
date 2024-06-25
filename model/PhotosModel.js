const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const photos = sequelize.define('photos', {
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
    televiseur:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    accessoire:{
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
    },
    
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = photos;