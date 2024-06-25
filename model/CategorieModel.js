const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const categorie = sequelize.define('categorie', {
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
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = categorie;