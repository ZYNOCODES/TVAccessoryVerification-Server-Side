const Categorie = require('../model/CategorieModel');

//get specific Categorie by id
const findCategorieById = async (id) => {
    return await Categorie.findByPk(id);
}
//get specific Categorie by Nom
const findCategorieByNom = async (Nom) => {
    return await Categorie.findOne({
        where: {
            nom: Nom
        }
    });
}
module.exports = {
    findCategorieById,
    findCategorieByNom
}