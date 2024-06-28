const express = require('express');
const {
    createLot,
    findLotById,
    getAllLots,
} = require('../controller/LotController');
const router = express.Router();
const requireAuth = require('../middleware/RequireAuth');

//secure routes below
router.use(requireAuth);
//create new lot
router.post('/create', createLot);
//get specific lot by id
router.get('/:id', findLotById);
//get all lots
router.get('/', getAllLots);


module.exports = router;