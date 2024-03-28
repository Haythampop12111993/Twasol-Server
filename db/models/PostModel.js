const mongoose = require("mongoose");
const postSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
    },
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    unLikes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        name: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now(),
        },
        update: {
          type: Date,
        },
        image: {
          type: String,
        },
      },
      {
        timestamps: true,
      },
    ],
    userPostImg: {
      type: String,
      default: "assets/default.png",
    },
  },
  {
    timestamps: true,
  }
);
const postModel = new mongoose.model("Post", postSchema);
module.exports = postModel;
