const JWT = require('jsonwebtoken');

//jwt secret
const createToken = (id) => {
    return JWT.sign({id: id}, process.env.SECRET_KEY, {expiresIn: '7d'});
}

module.exports = {
    createToken
};