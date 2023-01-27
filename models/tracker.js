const mongoose = require("mongoose");

const trackerSchema = mongoose.Schema(
  {
    stage: {
      type: Number,
      default: 0,
    },
    message: {
      type: String,
      default: "",
    },
    approved: {
      type: Boolean,
      default: false,
    },
    numberAllocated: {
      type: String,
      default: "",
    },
    user: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Tracker = mongoose.model("tracker", trackerSchema);

module.exports = Tracker;
