const User = require("../models/user");
const Tracker = require("../models/tracker");
const customError = require("../errors");
const crypto = require("crypto");
const {
  sendVerificationMail,
  sendResetPassword,
  createJWT,
} = require("../utils");
const { StatusCodes } = require("http-status-codes");

//route       POST - /api/v1/auth/register
//desc        Register user
//permission  Public
const Register = async (req, res) => {
  const { email, password, fullname, role } = req.body;
  if (!role) throw new customError.BadRequestError("Role is required");

  if (role === "user" && (!email || !password || !fullname)) {
    throw new customError.BadRequestError(
      "All registration parameter is required as an individual"
    );
  }
  // if (
  //   role === "vendor" &&
  //   (!email ||
  //     !password ||
  //     !phone ||
  //     !first_name ||
  //     !last_name ||
  //     !store_name ||
  //     !store_state ||
  //     !store_country ||
  //     !store_address ||
  //     !store_description)
  // ) {
  //   throw new customError.BadRequestError(
  //     "All registration parameter is required as a vendor"
  //   );
  // }
  const user = await User.findOne({ email });
  if (user) {
    throw new customError.BadRequestError("user already exists");
  }
  // const isFirstUser = (await User.countDocuments()) == 0;
  // const userRole = isFirstUser ? "admin" : "user";
  // req.body.role = userRole;
  // const verificationToken = crypto.randomBytes(40).toString("hex");
  // req.body.verificationToken = verificationToken;
  // req.body.verifiedExpiration = new Date(Date.now() + 1000 * 60 * 60 * 24);

  const newUser = await User.create(req.body);
  //create tracker for new user
  if (newUser.role == "user") {
    await Tracker.create({ user: newUser._id });
  }

  //Send Verification mail
  // sendVerificationMail({
  //   email: newUser.email,
  //   name: newUser.first_name,
  //   verificationToken,
  // });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Registration successful",
    data: newUser
  });
};

//route       POST - /api/v1/auth/verify
//desc        Verify user
//permission  Public
const Verify = async (req, res) => {
  const { email, verificationToken } = req.body;
  if (!email || !verificationToken) {
    throw new customError.BadRequestError(
      "Email and verification token required"
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.NotFoundError("User not found");
  }

  const isTokenExpired = Date.now() > user.verifiedExpiration ? true : false;
  if (user.isVerified) {
    res.status(StatusCodes.OK).json({ message: "User already verified" });
  }

  if (user.verificationToken != verificationToken) {
    throw new customError.BadRequestError("Invalid verification token");
  }
  if (isTokenExpired) {
    throw new customError.BadRequestError("Verification token expired");
  }

  if (user.verificationToken == verificationToken) {
    await User.findByIdAndUpdate(user._id, {
      verificationToken: " ",
      isVerified: true,
    });
    res.status(StatusCodes.OK).json({ message: "Email verified successfully" });
  }
};

//route       POST - /api/v1/auth/login
//desc        Login user
//permission  Public
const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new customError.BadRequestError("Email and password token required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordMatch = await user.comparePassword(password);
  console.log(isPasswordMatch);
  if (!isPasswordMatch) {
    throw new customError.UnauthenticatedError("Invalid Credentials");
  }

  // if (!user.isVerified) {
  //   throw new customError.BadRequestError("User not verified");
  // }
  const access_token = createJWT(user);

  res.status(StatusCodes.OK).json({ success: true, user, access_token });
};

//route       POST - /api/v1/auth/forgetpassword
//desc        retrieve forgot password user
//permission  Public
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new customError.BadRequestError("Email required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.NotFoundError("User not found");
  }

  const resetpasswordToken = crypto.randomBytes(40).toString("hex");

  await User.findByIdAndUpdate(user._id, {
    passwordToken: resetpasswordToken,
  });
  sendResetPassword({
    email: user.email,
    name: user.first_name,
    resetpasswordToken,
  });
  res
    .status(StatusCodes.OK)
    .json({ message: "Reeset password Token sent  successfully" });
};

//route       POST - /api/v1/auth/resetnewpassword
//desc        reset user password
//permission  Public
const resetNewPassword = async (req, res) => {
  const { email, oldPassword, newPassword, passwordToken } = req.body;
  console.log(req.body);
  if (!email || !oldPassword || !newPassword || !passwordToken) {
    throw new customError.BadRequestError(
      "Email, old password new password, and password token required"
    );
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.NotFoundError("User not found");
  }

  const isTokenExpired = Date.now() > user.verifiedExpiration ? true : false;
  if (isTokenExpired) {
    throw new customError.BadRequestError("Verification token expired");
  }

  const isPasswordMatch = user.comparePassword(oldPassword);
  if (!isPasswordMatch) {
    throw new customError.UnauthenticatedError("Old password incorect.");
  }

  if (user.passwordToken != passwordToken) {
    throw new customError.BadRequestError("Password token incorrect");
  }

  (user.passwordToken = " "), (user.password = newPassword), user.save();

  res.status(StatusCodes.OK).json({ message: "Password reset successfully" });
};

//route       POST - /api/v1/auth/resetpassword
//desc        reset forgot password
//permission  Public
const resetPassword = async (req, res) => {
  const { email, passwordToken, password } = req.body;
  if (!email || !passwordToken) {
    throw new customError.BadRequestError("Email and password token required");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.NotFoundError("User not found");
  }

  const isTokenExpired = Date.now() > user.verifiedExpiration ? true : false;
  if (isTokenExpired) {
    throw new customError.BadRequestError("Verification token expired");
  }

  if (user.passwordToken != passwordToken) {
    throw new customError.BadRequestError("Password token incorrect");
  }
  (user.passwordToken = " "), (user.password = password), user.save();

  res.status(StatusCodes.OK).json({ message: "Password reset successfully" });
};

module.exports = {
  Register,
  Verify,
  Login,
  forgetPassword,
  resetNewPassword,
  resetPassword,
};
