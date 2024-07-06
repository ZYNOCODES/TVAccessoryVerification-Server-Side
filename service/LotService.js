const Lot = require('../model/LotModel');

//get specific Lot by id
const findLotById = async (id) => {
    return await Lot.findByPk(id);
}
//get specific Lot by Numero
const findLotByNumero = async (Numero) => {
    return await Lot.findOne({
        where: {
            numero: Numero
        }
    });
}
//get the last lot created
const findLastLotByTime = async () => {
    return await Lot.findOne({
        order: [['endTime', 'DESC']]
    });
}
//find the last lot number and increment it by 1
const getLastLotNumber = async () => {
    const lastLot = await Lot.findOne({
        order: [['numero', 'DESC']]
    });
    if (!lastLot) {
        return 1;
    }
    let numero = 0;
    if (lastLot) {
        numero = lastLot.numero + 1;
    }
    return numero;
}

module.exports = {
    findLotById,
    findLotByNumero,
    findLastLotByTime,
    getLastLotNumber,
}