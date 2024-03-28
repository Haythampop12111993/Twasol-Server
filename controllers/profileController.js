const profileModel = require("../db/models/ProfileModel");
const { resGenerator } = require("../helper/resGenerator");
const { validationResult } = require("express-validator");
const upload = require("../helper/multer");
// import normalize from "normalize-url";
const normalize = require("normalize-url");
const config = require("config");
const postModel = require("../db/models/PostModel");
class ProfileController {
  static test = async (req, res) => {
    res.send("hello from profile controller");
  };
  static addProfile = async (req, res) => {
    const isUserHaveProfile = await profileModel.findOne({
      user: req.user._id,
    });
    if (isUserHaveProfile) {
      return resGenerator(
        res,
        409,
        false,
        "You already have a profile you can't create another one",
        null
      );
    }
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return resGenerator(res, 400, false, err.array()[0].msg, null);
    }
    try {
      let data = {
        ...req.body,
        user: req.user._id,
        website:
          req.body.website && req.body.website !== ""
            ? normalize(req.body.website, { forceHttps: true })
            : "",
        skills: Array.isArray(req.body.skills)
          ? req.body.skills
          : req.body.skills.split(",").map((s) => s.trim()),
      };
      const socialFields = [
        "twitter",
        "facebook",
        "linkedin",
        "youtube",
        "instagram",
        "github",
      ];
      for (let field of socialFields) {
        const value = socialFields[field];
        if (value && value !== "")
          data.social[field] = normalize(value, { forceHttps: true });
      }
      data.social = socialFields;
      const userProfile = new profileModel(data);
      await userProfile.save();
      return resGenerator(
        res,
        200,
        true,
        "Profile added successfully",
        userProfile
      );
    } catch (e) {
      return resGenerator(res, 500, false, e.massage, null);
    }
  };
  static editProfile = async (req, res) => {
    // try {
    //   const allowEdit = [
    //     "company",
    //     "website",
    //     "location",
    //     "status",
    //     "skills",
    //     "bio",
    //     "social",
    //     "country",
    //   ];
    //   const reqKeys = Object.keys(req.body);
    //   if (reqKeys.length === 0)
    //     return resGenerator(res, 400, false, "No data to update", null);
    //   if (reqKeys.length > allowEdit.length)
    //     // throw new Error("Too much data to update");
    //     return resGenerator(
    //       res,
    //       400,
    //       false,
    //       "Too much data to update allowEdits = " + allowEdit.join(", "),
    //       null
    //     );
    //   const isValidKey = allowEdit.every((k) => {
    //     return reqKeys.includes(k);
    //   });
    //   if (!isValidKey)
    //     return resGenerator(
    //       res,
    //       400,
    //       false,
    //       "Invalid key passed in body allowEdits = " + allowEdit.join(", "),
    //       null
    //     );
    //   const updatedUserData = await profileModel.findOneAndUpdate(
    //     { user: req.user._id },
    //     {
    //       ...req.body,
    //       website: normalize(req.body.website, { forceHttps: true }),
    //     },
    //     { new: true }
    //   );
    //   console.log(updatedUserData);
    //   return resGenerator(
    //     res,
    //     200,
    //     true,
    //     "Profile updated successfully",
    //     updatedUserData
    //   );
    // } catch (e) {
    //   return resGenerator(res, 500, false, e.massage, null);
    // }
    // console.log(req.body);
    try {
      const userProfile = await profileModel.findOne({ user: req.user._id });
      if (!userProfile) {
        return resGenerator(
          res,
          422,
          false,
          "You don't have a profile yet",
          null
        );
      }
      const upDateProfile = await profileModel.findByIdAndUpdate(
        {
          user: req.user._id,
          _id: userProfile._id,
        },
        {
          ...req.body,
          website: normalize(req.body.website, { forceHttps: true }),
        },
        {
          new: true,
          validationResult: true,
        }
      );

      return resGenerator(
        res,
        200,
        true,
        "Profile updated successfully",
        upDateProfile
      );
    } catch (e) {
      console.log("here");
      return resGenerator(res, 500, false, e.massage, null);
    }
  };
  static getProfile = async (req, res) => {
    try {
      const profile = await profileModel
        .findOne({ user: req.user._id })
        .populate("user", ["name"]);
      if (!profile)
        return resGenerator(res, 404, false, "Profile not found", null);
      return resGenerator(res, 200, true, "Profile found", profile);
    } catch (e) {
      return resGenerator(res, 500, false, e.massage, null);
    }
  };
  static getAllProfiles = async (req, res) => {
    try {
      const allProfiles = await profileModel.find().populate("user", ["name"]);
      resGenerator(res, 200, true, "All UsersProfiles", allProfiles);
    } catch (e) {
      resGenerator(res, 400, false, e.massage, null);
    }
  };
  static getProfileById = async (req, res) => {
    try {
      const profile = await profileModel
        .findById(req.params.profile_id)
        .populate("user", ["name"]);
      if (!profile) {
        return resGenerator(res, 404, false, "Profile not found", null);
      }
      return resGenerator(res, 200, true, "Profile found", profile);
    } catch (e) {
      resGenerator(res, 500, false, e.massage, null);
    }
  };
  static deleteUserProfile = async (req, res) => {
    try {
      const userProfile = await profileModel.findOne({ user: req.user._id });
      if (!userProfile) {
        return resGenerator(
          res,
          403,
          false,
          "You do not have a profile.",
          null
        );
      }
      const posts = await postModel.find();
      posts.forEach((post) => {
        post.comments = post.comments.filter(
          (comment) => comment.user.toString() !== req.user._id.toString()
        );
        post.likes = post.likes.filter(
          (like) => like.user.toString() !== req.user._id.toString()
        );
        post.unLikes = post.unLikes.filter(
          (unLike) => unLike.user.toString() !== req.user._id.toString()
        );
        post.save();
      });

      await postModel.deleteMany({ user: req.user._id });

      await profileModel.findByIdAndDelete({ _id: userProfile._id });
      resGenerator(res, 200, true, "Profile deleted successfully", null);
    } catch (e) {
      resGenerator(res, 500, false, e.massage, null);
    }
  };
  static upload = async (req, res) => {
    try {
      upload(req, res, async (err) => {
        if (err) {
          return resGenerator(res, 500, false, err.massage, null);
        } else {
          resGenerator(res, 200, true, "File uploaded successfully", null);
        }
      });
    } catch (e) {
      return resGenerator(res, 500, false, e.massage, null);
    }
  };
  static addExperience = async (req, res) => {
    try {
      const { title, company, location, from, to, current, description } =
        req.body;
      // Check Validation
      if (!title || !company || !location || !from) {
        return resGenerator(res, 400, false, "Please add all fields", null);
      }
      if (!current && !to) {
        return resGenerator(
          res,
          400,
          false,
          "If it is the current job, please add to date",
          null
        );
      }
      // if (current && description) {
      //   return resGenerator(
      //     res,
      //     400,
      //     false,
      //     "Description field is required",
      //     null
      //   );
      // }
      // if (to && description) {
      //   return resGenerator(
      //     res,
      //     400,
      //     false,
      //     "Description field is required",
      //     null
      //   );
      // }
      if (!current && from > to) {
        return resGenerator(
          res,
          400,
          false,
          "From date cannot be greater than the To date.",
          null
        );
      }
      // if (!current && from > to) {
      //   return resGenerator(
      //     res,
      //     400,
      //     false,
      //     "From date cannot be greater than the To date.",
      //     null
      //   );
      if (current && from > new Date()) {
        return resGenerator(
          res,
          400,
          false,
          "From date cannot be greater than the current date.",
          null
        );
      }
      const profile = await profileModel.findOne({ user: req.user._id });
      if (!profile) {
        return resGenerator(res, 500, false, "Server error", null);
      }
      profile.experience.unshift(req.body);
      await profile.save();
      return resGenerator(res, 200, true, "Profile updated", profile);
    } catch (e) {
      return resGenerator(res, 500, false, e.massage, null);
    }
  };
  static addEducation = async (req, res) => {
    try {
      const { school, degree, fieldOfStudy, from, to, current, description } =
        req.body;
      // Check required fields
      if (!school || !degree || !fieldOfStudy || !from) {
        return resGenerator(
          res,
          400,
          false,
          "Please provide all required information.",
          null
        );
      }
      if (!current && from > to) {
        return resGenerator(
          res,
          400,
          false,
          "From date cannot be greater than the To date.",
          null
        );
      }
      if (current && from > new Date()) {
        return resGenerator(
          res,
          400,
          false,
          "Current job can not have future dates of employment.",
          null
        );
      }
      if (!current && !to) {
        resGenerator(
          res,
          400,
          false,
          "If it is not a current Education  please provide end date.",
          null
        );
      }
      const profile = await profileModel.findOne({ user: req.user._id });
      if (!profile) {
        return resGenerator(res, 500, false, "Server error", null);
      }
      profile.education.unshift(req.body);
      await profile.save();
      return resGenerator(res, 200, true, "Profile updated", profile);
    } catch (e) {
      return resGenerator(res, 500, false, e.massage, null);
    }
  };
  static deleteExperience = async (req, res) => {
    try {
      const profile = await profileModel.findOne({ user: req.user._id });
      profile.experience = profile.experience.filter(
        (exp) => exp._id.toString() !== req.params.exp_id
      );
      await profile.save();
      return resGenerator(res, 200, true, "Deleted Successfully", profile);
    } catch (e) {
      resGenerator(res, 500, false, e.massage, null);
    }
  };
  static deleteEducation = async (req, res) => {
    try {
      const post = await profileModel.findOne({
        user: req.user._id,
        "education._id": req.params.edu_id,
      });
      if (!post)
        return resGenerator(res, 404, false, "Education not found", null);
      const profile = await profileModel.findOne({ user: req.user._id });
      if (!profile)
        return resGenerator(res, 500, false, "Profile Not Found", null);
      profile.education = profile.education.filter((edu) => {
        return edu._id.toString() !== req.params.edu_id;
      });
      await profile.save();
      return resGenerator(res, 200, true, "Deleted Successfully", profile);
    } catch (e) {
      resGenerator(res, 500, false, e.massage, null);
    }
  };
  static uploadImg = async (req, res) => {
    try {
      const fs = require("fs");
      const path = require("path");
      const ext = path.extname(req.file.originalname);
      const newName = req.file.path + ext;
      fs.renameSync(req.file.path, newName);
      const profile = await profileModel.findOne({ user: req.user._id });
      if (!profile) {
        return resGenerator(res, 500, false, "Server error", null);
      }
      profile.image = newName;
      profile.image =
        config.get("serverUrl") +
        newName.replace("public", "").replace("\\", "/");
      await profile.save();
      return resGenerator(res, 200, true, "Profile updated", profile);
    } catch (e) {
      resGenerator(res, 500, false, e.massage, "err in uploading image");
    }
  };
}
module.exports = ProfileController;
