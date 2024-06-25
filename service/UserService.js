const User = require('../model/UserModel');

//get specific User by id
const findUserById = async (id) => {
    return await User.findByPk(id);
}
//get specific User by Nom
const findUserByUsername = async (Username) => {
    return await User.findOne({
        where: {
            username: Username
        }
    });
}
module.exports = {
    findUserById,
    findUserByUsername
}