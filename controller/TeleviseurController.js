const Televiseur = require('../model/TeleviseurModel');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const TeleviseurService = require('../service/TeleviseurService.js');
const validator = require('validator');

//get all televiseurs
const getAllTeleviseurs = asyncErrorHandler(async (req, res, next) => {
    const televiseurs = await Televiseur.findAll();
    if(televiseurs.length <= 0){
        const err = new CustomError('Aucun téléviseur trouvé', 404);
        return next(err);
    }
    res.status(200).json(televiseurs);
});
//get specific televiseur by id
const getTeleviseurById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if all fields are filled
    if(!id || validator.isEmpty(id)){
        const err = new CustomError('Un des champs doit être rempli au moins pour trouver ce téléviseur', 400);
        return next(err);
    }
    const televiseur = await Televiseur.findByPk(id);
    if(!televiseur){
        const err = new CustomError('Téléviseur introuvable', 404);
        return next(err);
    }
    res.status(200).json(televiseur);
});
//create new televiseur
const createTeleviseur = asyncErrorHandler(async (req, res, next) => {
    const { Modele, Marque, Categorie, Taille, Resolution } = req.body;
    //check if all feals are filled
    if(
        (!Modele || validator.isEmpty(Modele)) || (!Marque || validator.isEmpty(Marque)) || 
        (!Categorie || validator.isEmpty(Categorie)) || 
        (!Taille || validator.isEmpty(Taille)) || (!Resolution || validator.isEmpty(Resolution))
    ){
        const err = new CustomError('Tout les champs doit être remplis', 400);
        return next(err);
    }
    //check if televiseur already exists
    const existingTeleviseur = await TeleviseurService.findTeleviseurByModele(Modele);
    if(existingTeleviseur){
        const err = new CustomError('Le téléviseur existe déjà', 400);
        return next(err);
    }
    //create new televiseur
    const newTeleviseur = await Televiseur.create({ 
        modele: Modele, 
        marque: Marque, 
        categorie: Categorie, 
        taille: Taille, 
        resolution: Resolution 
    });
    //check if televiseur was created
    if(!newTeleviseur){
        const err = new CustomError('Le téléviseur n\'a pas pu être créé, réessayez', 400);
        return next(err);
    }
    res.status(200).json({message: 'La création a été appliquée avec succès'});
});
//update televiseur
const updateTeleviseur = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { Modele, Marque, Categorie, Lot, Taille, Resolution } = req.body;
    //check if all feals are filled
    if(
        (!id || validator.isEmpty(id)) ||
        ((!Modele || validator.isEmpty(Modele)) && (!Marque || validator.isEmpty(Marque)) && 
        (!Categorie || validator.isEmpty(Categorie)) && 
        (!Taille || validator.isEmpty(Taille)) && (!Resolution || validator.isEmpty(Resolution)))
    ){
        const err = new CustomError('Un des champs doit être rempli au moins pour mettre à jour ce televiseur', 400);
        return next(err);
    }
    //check if televiseur exists
    const existingTeleviseur = await TeleviseurService.findTeleviseurById(id);
    if(!existingTeleviseur){
        const err = new CustomError('Téléviseur introuvable', 404);
        return next(err);
    }
    //update televiseur
    if(!validator.isEmpty(Modele)) existingTeleviseur.modele = Modele;
    if(!validator.isEmpty(Marque)) existingTeleviseur.marque = Marque;
    if(!validator.isEmpty(Categorie)) existingTeleviseur.categorie = Categorie;
    if(!validator.isEmpty(Taille)) existingTeleviseur.taille = Taille;
    if(!validator.isEmpty(Resolution)) existingTeleviseur.resolution = Resolution;
    //save updated televiseur
    const updatedTeleviseur = await existingTeleviseur.save();
    //check if televiseur was updated
    if(!updatedTeleviseur){
        const err = new CustomError('Le téléviseur n\'a pas pu être mis à jour, réessayez', 400);
        return next(err);
    }
    //return successfully updated televiseur message
    res.status(200).json({ message: 'La mise à jour a été appliquée avec succès' });
});
//delete televiseur
const deleteTeleviseur = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if all fields are filled
    if(!id || validator.isEmpty(id)){
        const err = new CustomError('Un des champs doit être rempli au moins pour supprimer ce téléviseur', 400);
        return next(err);
    }
    //check if televiseur exists
    const existingTeleviseur = await TeleviseurService.findTeleviseurById(id);
    if(!existingTeleviseur){
        const err = new CustomError('Téléviseur introuvable', 404);
        return next(err);
    }
    //delete televiseur
    const deletedTeleviseur = await existingTeleviseur.destroy();
    //check if televiseur was deleted
    if(!deletedTeleviseur){
        const err = new CustomError('Le téléviseur n\'a pas pu être supprimé, réessayez', 400);
        return next(err);
    }
    res.status(200).json({ message: 'La suppression a été appliquée avec succès' });
});

module.exports = {
    getAllTeleviseurs,
    getTeleviseurById,
    createTeleviseur,
    updateTeleviseur,
    deleteTeleviseur
}