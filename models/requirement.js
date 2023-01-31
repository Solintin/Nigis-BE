const mongoose = require("mongoose");

const requirementSchema = mongoose.Schema(
  {
    fullname: {
      type: String,
      require: [true, "Fullname is required"],
    },
    age: {
      type: Number,
      require: [true, "age is required"],
    },
    birth_cert: {
      type: String,
      require: [true, "Birth certificate is required"],
    },
    phone: {
      type: Number,
      require: [true, "Phone number is required"],
    },
    email: {
      type: String,
      require: [true, "email is required"],
    },
    nationality: {
      type: String,
      require: [true, "nationality is required"],
    },
    state: {
      type: String,
      require: [true, "state is required"],
    },
    occupation: {
      type: String,
      require: [true, "occupation is required"],
    },
    post_held: {
      type: String,
      require: [true, "post_held is required"],
    },
    address: {
      type: String,
      require: [true, "address is required"],
    },
    business_cert: {
      type: String,
    },
    business_name: {
      type: String,
    },
    business_number: {
      type: String,
    },
    business_reg_year: {
      type: Number,
    },
    business_reg_agent_name: {
      type: String,
    },
    business_reg_agent_address: {
      type: String,
    },
    purpose: {
      type: String,
      require: [true, "purpose is required"],
    },
    land_size: {
      type: String,
      require: [true, "Land size is required"],
    },
    plot_number: {
      type: Number,
    },
    block_number: {
      type: Number,
    },
    street_number: {
      type: Number,
    },
    isLandDeveloped: {
      type: Boolean,
      default: false,
    },
    isLandForMining: {
      type: Boolean,
      default: false,
    },
    landPurpose: {
      type: String,
    },
    signature: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "reject", "approve"],
      default: "pending",
    },
    stage: {
      type: Number,
      default: 0,
    },
    numberAllocated: {
      type: String,
    },
    user: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

const Requirements = mongoose.model("Requirements", requirementSchema);

module.exports = Requirements;
