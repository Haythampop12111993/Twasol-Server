const userRoute = require("express").Router();
const userController = require("../controllers/userController");
const { userAuth, adminAuth } = require("../middleware/middleware");
userRoute.get("/", userController.test);
userRoute.post("/register", userController.addUser);
userRoute.post("/login", userController.login);
userRoute.get("/logout", userAuth, userController.logout);
userRoute.get("/userData", userAuth, userController.userData);
userRoute.get("/allUsers", userAuth, adminAuth, userController.showAllUsers);
userRoute.post("/addAdmin", userAuth, adminAuth, userController.addAdmin);
// Route for getting specific user info by ID
module.exports = userRoute;
