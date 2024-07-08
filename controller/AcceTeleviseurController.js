const AcceTeleviseur = require('../model/AcceTeleviseurModel.js');
const Accessory = require('../model/AccessoireModel.js');

const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const AcceTeleviseurService = require('../service/AcceTeleviseurService.js');

// get all AcceTeleviseurs by id televiseur
const getAcceTeleviseurByIdTeleviseur = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    // check if all fields are filled
    if (!id || validator.isEmpty(id)) {
        const err = new CustomError('Tout les champs doit être remplis', 400);
        return next(err);
    }
    const ExistingAcceTeleviseur = await AcceTeleviseur.findAll({ 
        where: { 
            televiseur: id 
        } 
    });
    if (ExistingAcceTeleviseur.length <= 0) {
        const err = new CustomError('Aucun accessoire disponible pour ce téléviseur', 404);
        return next(err);
    }
    //get all accessory data
    const accessories = await Promise.all(ExistingAcceTeleviseur.map(async (acceTeleviseur) => {
        const accessory = await Accessory.findOne({
            where: { id: acceTeleviseur.accessoire }
        });
        return {
            id: acceTeleviseur.id,
           nom: accessory.nom
        };
    }));
    res.status(200).json(accessories);
});
//link televiseur with his accessoire
const linkTeleviseurToAccessoire = asyncErrorHandler(async (req, res, next) => {
    const { Televiseur, Accessoire } = req.body;
    // Validate inputs
    if (!Televiseur || validator.isEmpty(Televiseur) || !Array.isArray(Accessoire) || Accessoire.length <= 0) {
        return next(new CustomError('Tous les champs doivent être remplis', 400));
    }
    const ExistingAcceTeleviseur = await AcceTeleviseurService.findAcceTeleviseurByTeleviseurAndAccessoire(Televiseur,Accessoire);
    if (ExistingAcceTeleviseur.length > 0) {
        const err = new CustomError('Il y a une accessoire déjà lié à ce televiseur', 400);
        return next(err);
    }
    const newAcceTeleviseur = await Promise.all(Accessoire.map(async (acc) => {
        return await AcceTeleviseur.create({
            televiseur: Televiseur,
            accessoire: acc
        });
    }));
    //check if the newAcceTeleviseur is created
    if (newAcceTeleviseur.length <= 0) {
        const err = new CustomError('Erreur lors de la création de l\'accessoire', 500);
        return next(err);
    }
    res.status(200).json({ message: 'L\'accessoire a été lié avec succès' });
});
//update AcceTeleviseur
const updateAcceTeleviseur = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    const { Televiseur, Accessoire } = req.body;
    // check if all fields are filled
    if (!id || validator.isEmpty(id) || !Televiseur || validator.isEmpty(Televiseur) || !Accessoire || validator.isEmpty(Accessoire)) {
        const err = new CustomError('Tout les champs doit être remplis', 400);
        return next(err);
    }
    const ExistingAcceTeleviseur = await AcceTeleviseurService.findAcceTeleviseurById(id);
    if (!ExistingAcceTeleviseur) {
        const err = new CustomError('AcceTeleviseur introuvable', 404);
        return next(err);
    }
    //check if the Televiseur already exists with the same Accessoire
    const ExistingAcceTeleviseur2 = await AcceTeleviseurService.findAcceTeleviseurByTeleviseurAndAccessoire(Televiseur,Accessoire)
    if (ExistingAcceTeleviseur2) {
        const err = new CustomError('Accessoire déjà lié à ce televiseur', 400);
        return next(err);
    }
    //update AcceTeleviseur
    if(!validator.isEmpty(Accessoire)) ExistingAcceTeleviseur.accessoire = Accessoire;
    const updatedAcceTeleviseur = await ExistingAcceTeleviseur.save();
    //check if the updatedAcceTeleviseur is updated
    if (!updatedAcceTeleviseur) {
        const err = new CustomError('Erreur lors de la modification de l\'accessoire', 500);
        return next(err);
    }
    res.status(200).json({ message: 'La modification a été appliquée avec succès' });
});
//delete AcceTeleviseur
const deleteAcceTeleviseur = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    // check if all fields are filled
    if (!id || validator.isEmpty(id)) {
        const err = new CustomError('Tout les champs doit être remplis', 400);
        return next(err);
    }
    const ExistingAcceTeleviseur = await AcceTeleviseurService.findAcceTeleviseurById(id);
    if (!ExistingAcceTeleviseur) {
        const err = new CustomError('AcceTeleviseur introuvable', 404);
        return next(err);
    }
    const deletedAcceTeleviseur = await ExistingAcceTeleviseur.destroy();
    //check if the deletedAcceTeleviseur is deleted
    if (!deletedAcceTeleviseur) {
        const err = new CustomError('Erreur lors de la suppression de l\'accessoire', 500);
        return next(err);
    }
    res.status(200).json({ message: 'La suppression a été appliquée avec succès' });
});

module.exports = {
    getAcceTeleviseurByIdTeleviseur,
    linkTeleviseurToAccessoire,
    updateAcceTeleviseur,
    deleteAcceTeleviseur
};