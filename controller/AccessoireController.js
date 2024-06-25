const Accessoire = require('../model/AccessoireModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const AccessoireService = require('../service/AccessoireService.js');
const validator = require('validator');

//get all Accessoires
const getAllAccessoires = asyncErrorHandler(async (req, res, next) => {
    const ExistingAccessoires = await Accessoire.findAll();
    if(ExistingAccessoires.length <= 0){
        const err = new CustomError('Aucun accessoire trouvé', 404);
        return next(err);
    }
    res.status(200).json(ExistingAccessoires);
});
//get specific Accessoire by id
const getAccessoireById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if all fields are filled
    if(!id || validator.isEmpty(id)){
        const err = new CustomError('Un des champs doit être rempli au moins pour trouver ce accessoire', 400);
        return next(err);
    }
    const ExistingAccessoire = await Accessoire.findByPk(id);
    if(!ExistingAccessoire){
        const err = new CustomError('Accessoire introuvable', 404);
        return next(err);
    }
    res.status(200).json(ExistingAccessoire);
});
//create new Accessoire
const createAccessoire = asyncErrorHandler(async (req, res, next) => {
    const { Nom, Quantite } = req.body;
    //check if all feals are filled
    if(!Nom || validator.isEmpty(Nom)){
        const err = new CustomError('Tout les champs doit être remplis', 400);
        return next(err);
    }
    //check if Accessoire already exists
    const existingAccessoire = await AccessoireService.findAccessoireByNom(Nom);
    if(existingAccessoire){
        const err = new CustomError('Le accessoire existe déjà', 400);
        return next(err);
    }
    //create new Accessoire
    const newAccessoire = await Accessoire.create({ 
        nom: Nom, 
        quantite: (!Quantite || validator.isEmpty(Quantite)) ? Quantite : null
    });
    //check if Accessoire was created
    if(!newAccessoire){
        const err = new CustomError('Le accessoire n\'a pas pu être créé, réessayez', 400);
        return next(err);
    }
    res.status(201).json({message: 'La création a été appliquée avec succès'});
});
//update Accessoire
const updateAccessoire = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { Nom, Quantite } = req.body;
    //check if all feals are filled
    if(
        (!id || validator.isEmpty(id)) || 
        (
            (!Nom || validator.isEmpty(Nom)) && 
            (!Quantite || validator.isEmpty(Quantite))
        )
    ){
        const err = new CustomError('Un des champs doit être rempli au moins pour mettre à jour ce accessoire', 400);
        return next(err);
    }
    //check if Accessoire exists
    const existingAccessoire = await AccessoireService.findAccessoireById(id);
    if(!existingAccessoire){
        const err = new CustomError('Accessoire introuvable', 404);
        return next(err);
    }
    //update Accessoire
    if(!validator.isEmpty(Nom)) existingAccessoire.nom = Nom;
    if(!validator.isEmpty(Quantite)) existingAccessoire.quantite = Quantite;
    //save updated Accessoire
    const updatedAccessoire = await existingAccessoire.save();
    //check if Accessoire was updated
    if(!updatedAccessoire){
        const err = new CustomError('Le accessoire n\'a pas pu être mis à jour, réessayez', 400);
        return next(err);
    }
    res.status(200).json({ message: 'La mise à jour a été appliquée avec succès' });
});
//delete Accessoire
const deleteAccessoire = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if all fields are filled
    if(!id || validator.isEmpty(id)){
        const err = new CustomError('Un des champs doit être rempli au moins pour supprimer ce accessoire', 400);
        return next(err);
    }
    //check if Accessoire exists
    const existingAccessoire = await AccessoireService.findAccessoireById(id);
    if(!existingAccessoire){
        const err = new CustomError('Accessoire introuvable', 404);
        return next(err);
    }
    //delete Accessoire
    const deletedAccessoire = await existingAccessoire.destroy();
    //check if Accessoire was deleted
    if(!deletedAccessoire){
        const err = new CustomError('Le accessoire n\'a pas pu être supprimé, réessayez', 400);
        return next(err);
    }
    //return success message
    res.status(200).json({ message: 'La suppression a été appliquée avec succès' });
});

module.exports = {
    getAllAccessoires,
    getAccessoireById,
    createAccessoire,
    updateAccessoire,
    deleteAccessoire
}