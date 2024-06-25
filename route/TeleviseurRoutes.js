const express = require('express');
const {
    getAllTeleviseurs,
    getTeleviseurById,
    createTeleviseur,
    updateTeleviseur,
    deleteTeleviseur
} = require('../controller/TeleviseurController');
const router = express.Router();
const requireAuth = require('../middleware/RequireAuth');

//secure routes below
router.use(requireAuth);
//get all televiseurs
router.get('/', getAllTeleviseurs);
//get specific televiseur by id
router.get('/:id', getTeleviseurById);
//create new televiseur
router.post('/create', createTeleviseur);
//update televiseur
router.patch('/:id', updateTeleviseur);
//delete televiseur
router.delete('/:id', deleteTeleviseur);

module.exports = router;