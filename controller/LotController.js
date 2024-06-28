const sequelize = require('../config/Database');
const Lot = require('../model/LotModel.js');
const CustomError = require('../util/CustomError.js');
const asyncErrorHandler = require('../util/asyncErrorHandler.js');
const validator = require('validator');
const LotService = require('../service/LotService.js');
const TeleviseurService = require('../service/TeleviseurService.js');
const moment = require('moment');
require('moment-timezone');

// Create a new lot
const createLot = asyncErrorHandler(async (req, res, next) => {
    const { startTime, endTime, taille } = req.body;
    if (!startTime || !endTime || !taille) {
        const err = new CustomError('Tous les champs doivent être remplis', 400);
        return next(err);
    }
    if (!validator.isISO8601(startTime) || !validator.isISO8601(endTime)) {
        const err = new CustomError('Date invalide', 400);
        return next(err);
    }

    const transaction = await sequelize.transaction();
    try {
        //check if taille > Televiseur.countwithLotNull
        const televiseurs = await TeleviseurService.getTeleviseursWithLotNull();
        if (televiseurs.length < taille || taille <= 0) {
            const err = new CustomError('Taille de lot invalide', 400);
            await transaction.rollback();
            return next(err);
        }

        const existingLot = await LotService.findLastLotByTime();
        if (existingLot && (moment(startTime).isBefore(existingLot.endTime) || moment(endTime).isBefore(existingLot.endTime))) {
            const err = new CustomError('Les dates de début et de fin doivent être après le dernier lot', 400);
            await transaction.rollback();
            return next(err);
        }

        const lastLot = await LotService.getLastLotNumber();
        if (lastLot == 0) {
            const err = new CustomError('Numéro de lot invalide', 500);
            await transaction.rollback();
            return next(err);
        }

        const newLot = await Lot.create({
            numero: lastLot,
            startTime: startTime,
            endTime: endTime,
            taille: taille,
        }, { transaction });

        if (!newLot) {
            const err = new CustomError('Échec de la création du lot, veuillez réessayer', 400);
            await transaction.rollback();
            return next(err);
        }

        const assigned = await TeleviseurService.asigneLotToTeleviseurs(newLot.numero, taille, transaction);
        if (!assigned) {
            const err = new CustomError('Échec de l\'assignation du lot aux téléviseurs, veuillez recréer ce lot', 400);
            await transaction.rollback();
            return next(err);
        }
        await transaction.commit();
        res.status(201).json({ message: 'Lot créé avec succès' });
    } catch (error) {
        const err = new CustomError('Échec de la création du lot, veuillez réessayer', 400);
        await transaction.rollback();
        return next(err);
    }
});
//find lot by id
const findLotById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if id is filled
    if (!id) {
        const err = new CustomError('Tous les champs doivent être remplis', 400);
        return next(err);
    }
    const lot = await LotService.findLotById(id);
    if (!lot) {
        const err = new CustomError('Lot non trouvé', 404);
        return next(err);
    }
    res.status(200).json(lot);
});
//get all lots
const getAllLots = asyncErrorHandler(async (req, res, next) => {
    const lots = await Lot.findAll();
    //check if lots are found
    if (lots.length <= 0) {
        const err = new CustomError('Aucun lot trouvé', 404);
        return next(err);
    }
    res.status(200).json(lots);
});
//delete lot by id
const deleteLotById = asyncErrorHandler(async (req, res, next) => {
    const { id } = req.params;
    //check if id is filled
    if (!id) {
        const err = new CustomError('Tous les champs doivent être remplis', 400);
        return next(err);
    }
    //check if lot exists
    const lot = await LotService.findLotById(id);
    if (!lot) {
        const err = new CustomError('Lot non trouvé', 404);
        return next(err);
    }
    const transaction = await sequelize.transaction();
    try {
        //update televiseurs with lot null
        const updated = await TeleviseurService.updateTeleviseursWithLotNull(lot.numero, transaction);
        if (!updated) {
            const err = new CustomError('Échec de la suppression du lot, veuillez réessayer', 400);
            await transaction.rollback();
            return next(err);
        }
        //delete lot
        const deleted = await Lot.destroy({
            where: {
                id: id
            },
            transaction
        });
        if (!deleted) {
            const err = new CustomError('Échec de la suppression du lot, veuillez réessayer', 400);
            await transaction.rollback();
            return next(err);
        }
        await transaction.commit();
        res.status(200).json({ message: 'Lot supprimé avec succès' });
    } catch (error) {
        const err = new CustomError('Échec de la suppression du lot, veuillez réessayer', 400);
        await transaction.rollback();
        return next(err);
    }
});

module.exports = {
    createLot,
    findLotById,
    getAllLots,
    deleteLotById
}