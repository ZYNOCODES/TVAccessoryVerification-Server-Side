const jwt = require('jsonwebtoken');
const User = require('../model/UserModel');
const CustomError = require('../util/CustomError');
const asyncErrorHandler = require('../util/asyncErrorHandler');
const moment = require('moment');
require('moment-timezone');

const requireAuth = asyncErrorHandler(async (req, res, next) => {
    const timezone = 'Africa/Algiers';
    const currentTime = moment.tz(timezone);
    // Check if User is logged in
    const {authorization} = req.headers;
    
    if(!authorization){
        // If User is not logged in, return error
        const err = new CustomError('authorization token is required', 401);
        return next(err);
    }
    // Get token from header
    const token = authorization.split(' ')[1];

    // Verify token
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    } catch (err) {
        const error = new CustomError('Invalid or expired token. Please log in again.', 401);
        return next(error);
    }

    const { id, exp } = decodedToken;
    // Check if the token has expired
    if (currentTime.isSameOrAfter(exp * 1000)) {
        const err = new CustomError('Token has expired. Please log in again.', 401);
        return next(err);
    }
    // Add User to request
    req.User = await User.findByPk(id);
    if(!req.User){
        const err = new CustomError('User not found', 404);
        return next(err);
    }
    // Continue to next middleware
    next();
});

module.exports = requireAuth;