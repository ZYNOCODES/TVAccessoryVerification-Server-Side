const Accessoire = require('../model/AccessoireModel');

//get specific Accessoire by id
const findAccessoireById = async (id) => {
    return await Accessoire.findByPk(id);
}
//get specific Accessoire by Nom
const findAccessoireByNom = async (Nom) => {
    return await Accessoire.findOne({
        where: {
            nom: Nom
        }
    });
}
module.exports = {
    findAccessoireById,
    findAccessoireByNom
}