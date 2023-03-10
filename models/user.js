const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const roles = ["admin", "user", "super_admin"];

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "email is required"],
      validate: {
        message: "Please provide a valid email address",
        validator: validator.isEmail,
      },
      unique: true,
    },
    password: {
      type: String,
      require: [true, "password is required"],
    },
    fullname: {
      type: String,
      require: [true, "firstname is required"],
    },
    stage: {
      type: Number,
      default: 0,
    },
    adminLevel: {
      type: Number,
    },
    message: {
      type: String,
    },
    reject: {
      type: String,
      default: "",
    },
    numberAllocated: {
      type: String,
    },
    role: {
      type: String,
      required: ["Please provide a role"],
      enum: roles,
      default: "user",
    },
  },
  { timestamp: true }
);




userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  console.log(candidatePassword);
  console.log(this.password);
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("user", userSchema);
