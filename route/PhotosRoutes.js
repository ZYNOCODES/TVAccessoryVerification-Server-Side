const express = require('express');
const {
    uploadAndLinkPhoto,
    deletePhoto
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

module.exports = router;
