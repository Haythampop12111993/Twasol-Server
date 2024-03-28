const jwt = require("jsonwebtoken");
const config = require("config");
const { resGenerator } = require("../helper/resGenerator");
const userModel = require("../db/models/UserModel");
const userAuth = async (req, res, next) => {
  try {
    // const token = req.headers.authorization.replace("Bearer ", "");
    // console.log(token);
    let token = req.header("Authorization");
    if (!token) throw new Error("No Token Provided");
    token = req.header("Authorization").replace("Bearer ", "");
    const userVerify = jwt.verify(token, config.get("jwtPrivateKey"));
    const _id = userVerify._id;
    const userData = await userModel.findOne({ _id, "tokens.token": token });
    if (!userData) throw new Error("User not found!");
    req.user = userData;
    req.token = token;
    next();
  } catch (e) {
    return resGenerator(res, 500, false, e.message, null);
  }
};
const adminAuth = async (req, res, next) => {
  try {
    if (req.user.userType != "Admin") throw new Error("User not authorized");
    next();
  } catch (e) {
    return resGenerator(res, 500, false, e.message, null);
  }
};
module.exports = {
  userAuth,
  adminAuth,
};
