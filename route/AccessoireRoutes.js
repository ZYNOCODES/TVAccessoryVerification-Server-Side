const express = require('express');
const {
    getAllAccessoires,
    getAccessoireById,
    createAccessoire,
    updateAccessoire,
    deleteAccessoire
} = require('../controller/AccessoireController');
const router = express.Router();
const requireAuth = require('../middleware/RequireAuth');

//secure routes below
router.use(requireAuth);
//get all accessoires
router.get('/', getAllAccessoires);
//get specific accessoire by id
router.get('/:id', getAccessoireById);
//create new accessoire
router.post('/create', createAccessoire);
//update accessoire
router.patch('/:id', updateAccessoire);
//delete accessoire
router.delete('/:id', deleteAccessoire);

module.exports = router;