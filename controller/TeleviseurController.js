const Televiseur = require('../model/TeleviseurModel');
const Photo = require('../model/PhotosModel');
const Lot = require('../model/LotModel');
const AcceTeleviseurModel = require('../model/AcceTeleviseurModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const TeleviseurService = require('../service/TeleviseurService.js');
const validator = require('validator');
const sequelize = require('../config/Database.js');

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
const deleteTeleviseur = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;

    // Check if id is provided
    if (!id || validator.isEmpty(id)) {
        const err = new CustomError('Un des champs doit être rempli au moins pour supprimer ce téléviseur', 400);
        return next(err);
    }

    // Check if televiseur exists
    const existingTeleviseur = await TeleviseurService.findTeleviseurById(id);
    if (!existingTeleviseur) {
        const err = new CustomError('Téléviseur introuvable', 404);
        return next(err);
    }

    const transaction = await sequelize.transaction();

    try {
        
        // Delete existing images related to this televiseur
        const deletedImages = await Photo.destroy({
            where: {
                televiseur: id
            },
            transaction: transaction
        });
        if (deletedImages < 0) {
            const err = new CustomError('Le téléviseur n\'a pas pu être supprimé, réessayez', 404);
            throw err;
        }
        // Delete existing accessorys related to this televiseur
        const deletedAccessorys = await AcceTeleviseurModel.destroy({
            where: {
                televiseur: id
            },
            transaction: transaction
        });
        if (deletedAccessorys < 0) {
            const err = new CustomError('Le téléviseur n\'a pas pu être supprimé, réessayez', 404);
            throw err;
        }
        // Update lot taille
        const updatedLot = await Lot.decrement('taille', {
            by: 1,
            where: {
                numero: existingTeleviseur.lot
            },
            transaction: transaction
        });
        if (!updatedLot) {
            const err = new CustomError('Le téléviseur n\'a pas pu être supprimé, réessayez', 404);
            throw err;
        }

        // Delete televiseur
        const deletedTeleviseur = await existingTeleviseur.destroy({ transaction });
        if (!deletedTeleviseur) {
            const err = new CustomError('Le téléviseur n\'a pas pu être supprimé, réessayez', 400);
            throw err;
        }

        // Commit the transaction
        await transaction.commit();

        res.status(200).json({ message: 'La suppression a été appliquée avec succès' });
    } catch (err) {
        // Rollback the transaction if any error occurred
        await transaction.rollback();
        return next(err);
    }
});

module.exports = {
    getAllTeleviseurs,
    getTeleviseurById,
    createTeleviseur,
    updateTeleviseur,
    deleteTeleviseur
}