const express = require('express');
const {
    getAllCategories,
    getCategorieById,
    createCategorie,
    updateCategorie,
    deleteCategorie
} = require('../controller/CategorieController');
const router = express.Router();
const requireAuth = require('../middleware/RequireAuth');

//secure routes below
router.use(requireAuth);
//get all categories
router.get('/', getAllCategories);
//get specific categorie by id
router.get('/:id', getCategorieById);
//create new categorie
router.post('/create', createCategorie);
//update categorie
router.patch('/:id', updateCategorie);
//delete categorie
router.delete('/:id', deleteCategorie);

module.exports = router;