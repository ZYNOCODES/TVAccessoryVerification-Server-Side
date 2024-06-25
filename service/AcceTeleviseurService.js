const AcceTeleviseur = require('../model/AcceTeleviseurModel');

//get specific AcceTeleviseur by id
const findAcceTeleviseurById = async (id) => {
    return await AcceTeleviseur.findByPk(id);
}
//get specific AcceTeleviseur by Nom
const findAcceTeleviseurByTeleviseurAndAccessoire = async (Televiseur, Accessoire) => {
    return await AcceTeleviseur.findOne({
        where: {
            televiseur: Televiseur,
            accessoire: Accessoire
        }
    });
}
module.exports = {
    findAcceTeleviseurById,
    findAcceTeleviseurByTeleviseurAndAccessoire
}