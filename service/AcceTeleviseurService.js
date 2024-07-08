const AcceTeleviseur = require('../model/AcceTeleviseurModel');
const { Op } = require('sequelize');

//get specific AcceTeleviseur by id
const findAcceTeleviseurById = async (id) => {
    return await AcceTeleviseur.findByPk(id);
}
//get specific AcceTeleviseur by Nom
const findAcceTeleviseurByTeleviseurAndAccessoire = async (Televiseur, Accessoire) => {
    return await AcceTeleviseur.findAll({
        where: {
            televiseur: Televiseur,
            accessoire: {
                [Op.in]: Accessoire
            }
        }
    });
}
module.exports = {
    findAcceTeleviseurById,
    findAcceTeleviseurByTeleviseurAndAccessoire
}