const Televiseur = require('../model/TeleviseurModel');
const Lot = require('../model/LotModel');
const sequelize = require('../config/Database');

//get specific televiseur by id
const findTeleviseurById = async (id) => {
    return await Televiseur.findByPk(id);
}
//get specific televiseur by modele
const findTeleviseurByModele = async (Modele) => {
    return await Televiseur.findOne({
        where: {
            modele: Modele
        }
    });
}
const asigneLotToTeleviseurs = async (lot, taille, transaction) => {
    // Find 'taille' number of televiseurs
    const televiseurs = await Televiseur.findAll({
        where: {
            lot: null
        },
        limit: parseInt(taille, 10),
        lock: transaction.LOCK.UPDATE,
        transaction
    });
    if (televiseurs.length === 0) {
        await transaction.rollback();
        return false;
    }

    // Update all selected televiseurs with the new lot
    const ids = televiseurs.map(t => t.id);
    const televiseurUpdated = await Televiseur.update(
        { lot },
        {
            where: {
                id: ids
            },
            transaction
        }
    );

    if (televiseurUpdated[0] !== ids.length) {
        await transaction.rollback();
        return false;
    }

    // Check if all televiseurs are assigned to the lot
    const assignedTeleviseurs = await Televiseur.findAll({
        where: {
            lot
        },
        transaction
    });

    if (assignedTeleviseurs.length !== ids.length) {
        await transaction.rollback();
        return false;
    }

    return true;
};
const getTeleviseursWithLotNull = async () => {
    return await Televiseur.findAll({
        where: {
            lot: null
        }
    });
}
const getTeleviseursByLot = async (numero) => {
    return await Televiseur.findAll({
        where: {
            lot: numero
        }
    });
};
const updateTeleviseursWithLotNull = async (numero, transaction) => {
    return await Televiseur.update(
        { lot: null },
        {
            where: {
                lot: numero
            },
            transaction
        }
    );
};
module.exports = {
    findTeleviseurById,
    findTeleviseurByModele,
    asigneLotToTeleviseurs,
    getTeleviseursWithLotNull,
    getTeleviseursByLot,
    updateTeleviseursWithLotNull
}