const express = require('express');
const {
    getAcceTeleviseurByIdTeleviseur,
    linkTeleviseurToAccessoire,
    updateAcceTeleviseur,
    deleteAcceTeleviseur
} = require('../controller/AcceTeleviseurController');
const router = express.Router();
const requireAuth = require('../middleware/RequireAuth');

//secure routes below
router.use(requireAuth);
//get all AcceTeleviseurs by id televiseur
router.get('/:id', getAcceTeleviseurByIdTeleviseur);
//link televiseur with his accessoire
router.post('/link', linkTeleviseurToAccessoire);
//update AcceTeleviseurs
router.patch('/:id', updateAcceTeleviseur);
//delete AcceTeleviseurs
router.delete('/:id', deleteAcceTeleviseur);

module.exports = router;