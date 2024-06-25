const User = require('../model/UserModel');
const CustomError = require('../util/CustomError');
const asyncErrorHandler = require('../util/asyncErrorHandler');
const UserService = require('../service/UserService');
const bcrypt = require('../util/bcrypt.js');
const {
  createToken
} = require('../util/JWT');

//login
const Signin = asyncErrorHandler(async (req, res, next) => {
  const {Username, Password} = req.body;

  //check if Username or Password is empty
  if(!Username || !Password){
    const err = new CustomError('Tout les champs doivent etre remplis', 400);
    return next(err);
  }

  //check if user exist
  const user = await UserService.findUserByUsername(Username);
  if(!user){
    const err = new CustomError('Nom  d\'utilisateur ou mot de passe incorrect', 400);
    return next(err);
  }

  //check if password is correct
  const match = await bcrypt.comparePassword(Password, user.password);
  if(!match){
      const err = new CustomError('Nom  d\'utilisateur ou mot de passe incorrect', 400);
      return next(err);
  }

  //create token
  const token = createToken(user.id);

  //return user
  res.status(200).json({id: user.id, token});
})  
//signup
const Signup = asyncErrorHandler(async (req, res, next) => {
  const { Username, Password } = req.body;
  
  // hash password
  const hash = await bcrypt.hashPassword(Password);

  //check if user exist already
  const userexist = await UserService.findUserByUsername(Username);
  if(userexist){
    const err = new CustomError('Nom  d\'utilisateur déjà utilisé', 400);
    return next(err);
  }
  
  //create new user
  const user = await User.create({
    username: Username,
    password: hash,
  });

  if(!user){
    const err = new CustomError('erreur lors de la création de votre compte, réinscrivez-vous', 400);
    return next(err);
  }

  //return user
  res.status(200).json({message:"Utilisateur enregistré avec succès"});
})

module.exports = {
    Signin,
    Signup,
}