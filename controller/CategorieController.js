const Categorie = require('../model/CategorieModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const CategorieService = require('../service/CategorieService.js');
const validator = require('validator');

//get all Categories
const getAllCategories = asyncErrorHandler(async (req, res, next) => {
    const ExistingCategories = await Categorie.findAll();
    if(ExistingCategories.length <= 0){
        const err = new CustomError('Aucun categorie trouvé', 404);
        return next(err);
    }
    res.status(200).json(ExistingCategories);
});
//get specific Categorie by id
const getCategorieById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if all fields are filled
    if(!id || validator.isEmpty(id)){
        const err = new CustomError('Un des champs doit être rempli au moins pour trouver ce categorie', 400);
        return next(err);
    }
    const ExistingCategorie = await Categorie.findByPk(id);
    if(!ExistingCategorie){
        const err = new CustomError('Categorie introuvable', 404);
        return next(err);
    }
    res.status(200).json(ExistingCategorie);
});
//create new Categorie
const createCategorie = asyncErrorHandler(async (req, res, next) => {
    const { Nom } = req.body;
    //check if all feals are filled
    if(!Nom || validator.isEmpty(Nom)){
        const err = new CustomError('Tout les champs doit être remplis', 400);
        return next(err);
    }
    //check if Categorie already exists
    const existingCategorie = await CategorieService.findCategorieByNom(Nom);
    if(existingCategorie){
        const err = new CustomError('Le categorie existe déjà', 400);
        return next(err);
    }
    //create new Categorie
    const newCategorie = await Categorie.create({ 
        nom: Nom, 
    });
    //check if Categorie was created
    if(!newCategorie){
        const err = new CustomError('Le categorie n\'a pas pu être créé, réessayez', 400);
        return next(err);
    }
    res.status(201).json({message: 'La création a été appliquée avec succès'});
});
//update Categorie
const updateCategorie = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { Nom } = req.body;
    //check if all feals are filled
    if((!id || validator.isEmpty(id)) || (!Nom || validator.isEmpty(Nom))){
        const err = new CustomError('Tout les champs doit être remplis', 400);
        return next(err);
    }
    //check if Categorie exists
    const existingCategorie = await CategorieService.findCategorieById(id);
    if(!existingCategorie){
        const err = new CustomError('Categorie introuvable', 404);
        return next(err);
    }
    //update Categorie
    if(!validator.isEmpty(Nom)) existingCategorie.nom = Nom;
    //save updated Categorie
    const updatedCategorie = await existingCategorie.save();
    //check if Categorie was updated
    if(!updatedCategorie){
        const err = new CustomError('Le Categorie n\'a pas pu être mis à jour, réessayez', 400);
        return next(err);
    }
    res.status(200).json({ message: 'La mise à jour a été appliquée avec succès' });
});
//delete Categorie
const deleteCategorie = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if all fields are filled
    if(!id || validator.isEmpty(id)){
        const err = new CustomError('Tout les champs doit être remplis', 400);
        return next(err);
    }
    //check if Categorie exists
    const existingCategorie = await CategorieService.findCategorieById(id);
    if(!existingCategorie){
        const err = new CustomError('Categorie introuvable', 404);
        return next(err);
    }
    //delete Categorie
    const deletedCategorie = await existingCategorie.destroy();
    //check if Categorie was deleted
    if(!deletedCategorie){
        const err = new CustomError('Le Categorie n\'a pas pu être supprimé, réessayez', 400);
        return next(err);
    }
    //return success message
    res.status(200).json({ message: 'La suppression a été appliquée avec succès' });
});

module.exports = {
    getAllCategories,
    getCategorieById,
    createCategorie,
    updateCategorie,
    deleteCategorie
}