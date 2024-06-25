const Televiseur = require('../model/TeleviseurModel');

//get specific televiseur by id
const findTeleviseurById = async (id) => {
    return await Televiseur.findByPk(id);
}
//get specific televiseur by modele
const findTeleviseurByModele = async (Modele) => {
    return await Televiseur.findOne({
        where: {
            modele: Modele
        }
    });
}
module.exports = {
    findTeleviseurById,
    findTeleviseurByModele
}