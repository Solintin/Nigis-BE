const User = require("../models/user");
const Requirements = require("../models/requirement");
const Tracker = require("../models/tracker");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const { response } = require("../services/response");

const updateTracker = async (req, res) => {
  console.log(req.body);
  const { userId, documentId, message, approve } = req.body;
  const getUser = await User.findById({ _id: userId });
  const getRequirement = await Requirements.findById({ _id: documentId });
  const getUserTracker = await Tracker.findOne({ user: userId });

  if (!getUser) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "User not found", success: false });
  }
  if (!getRequirement) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ message: "Document not found", success: false });
  }

 

  const randomNum = Math.floor(100000 + Math.random() * 900000);

  if (approve) {
    if (getUserTracker.stage == 0) {
      getUserTracker.numberAllocated = randomNum;
    }
    getUserTracker.stage = getUserTracker.stage + 1;
    getUserTracker.approve = approve;
    getUser.stage = getUser.stage + 1;
    getRequirement.stage = getRequirement.stage + 1;
  } else {
    getUserTracker.message = message;
  }
  await getUser.save();
  await getUserTracker.save();
  await getRequirement.save();

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Requirements Updated",
  });
};

module.exports = { updateTracker };