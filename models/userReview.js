const mongoose = require("mongoose");
const { idGenerator } = require("../utils");

const userReviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: 5,
      max: 100,
    },

    comment: {
      type: String,
      required: [true, "Please provide comment"],
    },
    vendor: {
      ref: "user",
      type: mongoose.Types.ObjectId,
      required: true,
    },
    user: {
      ref: "user",
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  { timestamp: true }
);


// idGenerator('user_review', userReviewSchema)

const review = mongoose.model("user_review", userReviewSchema);

module.exports = review;
