const Photos = require('../model/PhotosModel.js');
const sequelize = require('../config/Database.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const TeleviseurService = require('../service/TeleviseurService.js');
const AccessoireService = require('../service/AccessoireService.js');
const moment = require('moment');
require('moment-timezone');
const fs = require('fs').promises;

// Create a new photo
const uploadAndLinkPhoto = asyncErrorHandler(async (req, res, next) => {
    let { AccessoireID, TeleviseurID } = req.body;
    //check if all fields are filled
    if ((!AccessoireID || validator.isEmpty(AccessoireID)) && (!TeleviseurID || validator.isEmpty(TeleviseurID))) {
        const error = new CustomError('Un des champs doit être rempli pour télécharger les images', 400);
        return next(error);
    }
    if (req.files == undefined || req.files.length <= 0) {
        const error = new CustomError('Veuillez télécharger au moins un fichier', 400);
        return next(error);
    }
    //check if Televiseur or Accessoire exists
    if (TeleviseurID) {
        const televiseur = await TeleviseurService.findTeleviseurById(TeleviseurID);
        if (!televiseur) {
            const error = new CustomError('Téléviseur introuvable', 404);
            return next(error);
        }
        AccessoireID = null;
    }
    if (AccessoireID) {
        const accessoire = await AccessoireService.findAccessoireById(AccessoireID);
        if (!accessoire) {
            const error = new CustomError('Accessoire introuvable', 404);
            return next(error);
        }
        TeleviseurID = null;
    }
    const images = req.files.map(file => file.filename);
    // Assuming you want to save the image information to the database
    const photoData = images.map(filename => ({
        chemin: filename,
        accessoire: AccessoireID,
        televiseur: TeleviseurID,
    }));
    const transaction = await sequelize.transaction();
    try {
        //create a new photo
        const photos = await Photos.bulkCreate(photoData, { transaction });
        //check if photo was created
        if (!photos) {
            const error = new CustomError('Les images n\'ont pas pu être téléchargées, réessayez', 400);
            transaction.rollback();
            return next(error);
        }
        await transaction.commit();
        res.status(200).json({ message: 'Images téléchargées avec succès'});
    } catch (error) {
        const customError = new CustomError('Les images n\'ont pas pu être téléchargées, réessayez', 400);
        transaction.rollback();
        return next(customError);
    }
});
//delete a photo
const deletePhoto = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if photo exists
    const photo = await Photos.findByPk(id);
    if (!photo) {
        const error = new CustomError('Photo introuvable', 404);
        return next(error);
    }
    const filePath = `${__dirname}/../files/${photo.chemin}`;
    try {
        // Check if file exists before attempting to delete
        await fs.access(filePath);
    } catch (error) {
        const err = new CustomError('La photo n\'existe pas', 404);
        //delete photo
        await Photos.destroy({ 
            where: { id } 
        });
        return next(err);
    }

    try {
        // Delete photo from storage
        await fs.unlink(filePath);
    } catch (error) {
        const err = new CustomError('La photo n\'a pas pu être supprimée, réessayez', 400);
        return next(err);
    }

    //delete photo
    const deleted = await Photos.destroy({ 
        where: { id } 
    });
    //check if photo was deleted
    if (!deleted) {
        const error = new CustomError('La photo n\'a pas pu être supprimée, réessayez', 400);
        return next(error);
    }
    res.status(200).json({ message: 'Photo supprimée avec succès' });
});
//get all photos by id televiseur
const getAllPhotosByTeleviseurId = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if id is provided
    if (!id || validator.isEmpty(id)) {
        const error = new CustomError('ID non fourni', 400);
        return next(error);
    }
    //check if televiseur exists
    const televiseur = await TeleviseurService.findTeleviseurById(id);
    if (!televiseur) {
        const error = new CustomError('Téléviseur introuvable', 404);
        return next(error);
    }
    const photos = await Photos.findAll({ 
        where: { televiseur: id } 
    });
    //check if photos exist
    if (photos.length <= 0) {
        const error = new CustomError('Aucune photo trouvée', 404);
        return next(error);
    }
    res.status(200).json(photos);
});
//get all photos by id accessoire
const getAllPhotosByAccessoireId = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if id is provided
    if (!id || validator.isEmpty(id)) {
        const error = new CustomError('ID non fourni', 400);
        return next(error);
    }
    //check if accessoire exists
    const accessoire = await AccessoireService.findAccessoireById(id);
    if (!accessoire) {
        const error = new CustomError('Accessoire introuvable', 404);
        return next(error);
    }
    const photos = await Photos.findAll({ 
        where: { accessoire: id } 
    });
    //check if photos exist
    if (photos.length <= 0) {
        const error = new CustomError('Aucune photo trouvée', 404);
        return next(error);
    }
    res.status(200).json(photos);
});

module.exports = {
    uploadAndLinkPhoto,
    deletePhoto,
    getAllPhotosByTeleviseurId,
    getAllPhotosByAccessoireId
}
