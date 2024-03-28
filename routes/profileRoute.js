const profileRoute = require("express").Router();
const profileController = require("../controllers/profileController");
const upload = require("../helper/multer");
const { userAuth } = require("../middleware/middleware");
const uploadImage = require("../middleware/upload.middleware");
const { check } = require("express-validator");
profileRoute.get("/", profileController.test);
profileRoute.post(
  "/addNewProfile",
  userAuth,
  check("status").not().isEmpty().withMessage("Status field is required!"),
  check("skills").not().isEmpty().withMessage("Skills field is required!"),
  profileController.addProfile
);
profileRoute.get("/usersProfiles", userAuth, profileController.getAllProfiles);
profileRoute.put("/editProfile", userAuth, profileController.editProfile);
profileRoute.get("/getProfile", userAuth, profileController.getProfile);
profileRoute.get(
  "/userProfile/:profile_id",
  userAuth,
  profileController.getProfileById
);
profileRoute.delete(
  "/deleteProfile",
  userAuth,
  profileController.deleteUserProfile
);
profileRoute.post(
  "upload",
  userAuth,
  upload.single("file"),
  profileController.upload
);
profileRoute.post("/addExperience", userAuth, profileController.addExperience);
profileRoute.post("/addEducation", userAuth, profileController.addEducation);
profileRoute.delete(
  "/deleteExperience/:exp_id",
  userAuth,
  profileController.deleteExperience
);
profileRoute.delete(
  "/deleteEducation/:edu_id",
  userAuth,
  profileController.deleteEducation
);
profileRoute.post(
  "/changeImage",
  userAuth,
  uploadImage.single("image"),
  profileController.uploadImg
);
module.exports = profileRoute;
