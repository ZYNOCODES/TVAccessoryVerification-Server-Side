const { DataTypes } = require('sequelize');
const sequelize = require('../config/Database');

const televiseur = sequelize.define('televiseur', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    modele:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    marque:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    categorie:{
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    lot:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    taille:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    resolution:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    
},{
    freezeTableName: true,
    timestamps: false,
});

module.exports = televiseur;