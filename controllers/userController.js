const userModel = require("../db/models/UserModel");
// const jwt = require("jsonwebtoken");
// const config = require("config");
const { resGenerator } = require("../helper/resGenerator");
class userController {
  static test = (req, res) => {
    res.send("hello from user controller");
  };
  static addUser = async (req, res) => {
    try {
      const user = await userModel.findOne({ email: req.body.email });
      if (user) throw new Error("User already exists");
      const result = new userModel(req.body);
      await result.save();
      resGenerator(res, 200, true, "User added successfully", result);
    } catch (e) {
      resGenerator(res, 500, false, e.message, null);
    }
  };
  static login = async (req, res) => {
    try {
      const user = await userModel.logMe(req.body.email, req.body.password);
      const token = await user.generateToken();
      return resGenerator(res, 200, true, "User logged in successfully", {
        user,
        token,
      });
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static logout = async (req, res) => {
    try {
      //   const token = req.headers.authorization.replace("Bearer ", "");
      //   if (!token) throw new Error("No Token Provided");
      //   const userVerify = jwt.verify(token, config.get("jwtPrivateKey"));
      //   const _id = userVerify._id;
      //   const user = await userModel.findOne({ _id, "tokens.token": token });
      //   if (!user) throw new Error("User Not Found");
      //   const tokens = user.tokens.filter((t) => t.token !== token);
      //   await userModel.findOneAndUpdate(
      //     { _id, "tokens.token": token },
      //     { tokens }
      //   );
      ///////////////////////////////////////////////////////
      req.user.tokens = req.user.tokens.filter((t) => {
        return t.token !== req.token;
      });
      await req.user.save();
      return resGenerator(res, 200, true, "Logged out Successfully", null);
    } catch (e) {
      return resGenerator(res, 500, false, e.message, null);
    }
  };
  static userData = async (req, res) => {
    try {
      const userData = await userModel.findOne({
        _id: req.user._id,
        "tokens.token": req.token,
      });
      if (!userData) throw new Error("User Not Found");
      resGenerator(res, 200, true, "User Data", userData);
    } catch (e) {
      resGenerator(res, 500, false, e.message, null);
    }
  };
  static showAllUsers = async (req, res) => {
    try {
      const allUsers = await userModel.find();
      resGenerator(res, 200, true, "All Users", allUsers);
    } catch (e) {
      resGenerator(res, 500, false, e.message, null);
    }
  };
  static addAdmin = async (req, res) => {
    try {
      //   const adminData = { ...req.body, userType: "Admin" };
      //   const addAdmin = new userModel(adminData);
      const user = await userModel.findOne({ email: req.body.email });
      if (user) throw new Error("User already exists");
      const addAdmin = new userModel({ ...req.body, userType: "Admin" });
      await addAdmin.save();
      return resGenerator(res, 201, true, "admin added successfully", addAdmin);
    } catch (e) {
      resGenerator(res, 500, false, e.message, null);
    }
  };
}
module.exports = userController;
