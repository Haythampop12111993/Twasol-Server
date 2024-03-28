const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const validator = require("validator");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      min: 3,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
    },
    password: {
      type: String,
      required: "Password is required",
      trim: true,
      minlength: 8,
      // must include at least one upper case letter, one lower case letter, and one number
      match: [
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must include at least one upper case letter, one lower case letter, and one number",
      ],
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            "Password is not strong enough please add one special characters"
          );
        }
      },
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    dateOfBirth: {
      type: Date,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
      maxLength: 11,
      required: true,
      validate(value) {
        if (!validator.isMobilePhone(value, "ar-EG")) {
          throw new Error("Phone number is invalid");
        }
      },
    },
    userType: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hashSync(this.password, 10);
});
userSchema.statics.logMe = async (email, password) => {
  const user = await userModel.findOne({ email });
  //   console.log(user);
  if (!user) throw new Error("Invalid Email or Password");
  const isMatchedPassword = await bcrypt.compare(password, user.password);
  console.log(isMatchedPassword);
  if (!isMatchedPassword) throw new Error("Invalid Email or Password");
  return user;
};
userSchema.methods.generateToken = async function () {
  console.log(this._id);
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"), {
    expiresIn: "15d",
  });
  this.tokens.push({ token });
  await this.save();
  return token;
};
// userSchema.methods("matchPassword", function (password) {});
const userModel = new mongoose.model("User", userSchema);
module.exports = userModel;
