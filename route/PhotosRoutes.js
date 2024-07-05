const express = require('express');
const {
    uploadAndLinkPhoto,
    deletePhoto,
    getAllPhotosByTeleviseurId,
    getAllPhotosByAccessoireId
} = require('../controller/ImageController');
const router = express.Router();
const requireAuth = require('../middleware/RequireAuth');
const {upload} = require('../util/ImageUploader');

//secure routes below
router.use(requireAuth);
//upload a photo
router.post('/upload', upload, uploadAndLinkPhoto);
//delete a photo
router.delete('/delete/:id', deletePhoto);
//get all photos by id televiseur
router.get('/TV/:id', getAllPhotosByTeleviseurId);
//get all photos by id accessoire
router.get('/accessoire/:id', getAllPhotosByAccessoireId);

module.exports = router;
