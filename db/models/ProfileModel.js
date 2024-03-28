const mongoose = require("mongoose");
const profileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    company: {
      type: String,
    },
    website: {
      type: String,
    },
    country: {
      type: String,
    },
    location: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      validate(value) {
        if (!value) throw new Error("Status field is required!");
      },
    },
    skills: {
      type: [String],
      required: true,
    },
    bio: {
      type: String,
    },
    experience: [
      {
        title: {
          type: String,
          required: true,
        },
        company: {
          type: String,
          required: true,
        },
        location: {
          type: String,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    education: [
      {
        school: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
          required: true,
        },
        fieldOfStudy: {
          type: String,
          required: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        current: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
        },
      },
    ],
    social: {
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      instagram: {
        type: String,
      },
      youtube: {
        type: String,
      },
      github: {
        type: String,
      },
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const profileModel = new mongoose.model("Profile", profileSchema);
module.exports = profileModel;
