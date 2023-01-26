const mongoose = require("mongoose");
const { idGenerator } = require("../utils");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide name of category"],
      minLength: 5,
      maxLength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide category description"],
    }, 
    user: {
      ref: "User",
      type: Number,
      required: [true, "Please provide vendor id"],
    },
  },
  { timestamp: true }
);


// idGenerator('category', categorySchema)

const category = mongoose.model("category", categorySchema);

module.exports = category;
