const Photos = require('../model/PhotosModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const moment = require('moment');
require('moment-timezone');

// Create a new photo
const uploadAndLinkPhoto = asyncErrorHandler(async (req, res, next) => {
    const { Accessoire, Televiseur } = req.body;
    console.log(Accessoire, Televiseur);

    //check if all fields are filled
    if ((!Accessoire || validator.isEmpty(Accessoire)) && (!Televiseur || validator.isEmpty(Televiseur))) {
        const error = new CustomError('Please provide an accessory or a TV', 400);
        return next(error);
    }
    if (req.files === undefined || req.files.length <= 0) {
        const error = new CustomError('Please upload a file', 400);
        return next(error);
    }
    const images = req.files.map(file => file.filename);
    // Assuming you want to save the image information to the database
    const photoData = images.map(filename => ({
        chemin: filename,
        accessoire: Accessoire,
        televiseur: Televiseur,
    }));
    //create a new photo
    const photos = await Photos.bulkCreate(photoData);
    if (!photos) {
        const error = new CustomError('Failed to upload photo', 400);
        return next(error);
    }
    res.status(201).json(photos);
});

module.exports = {
    uploadAndLinkPhoto,
}
