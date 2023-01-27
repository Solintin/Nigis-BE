const Requirements = require("../models/requirement");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const { response } = require("../services/response");
const { log } = require("console");

const submitRequirement = async (req, res) => {
  const {
    user,
    fullname,
    age,
    birth_cert,
    phone,
    email,
    nationality,
    state,
    occupation,
    post_held,
    address,
    business_cert,
    business_name,
    business_number,
    business_reg_year,
    business_reg_agent_name,
    business_reg_agent_address,
    plot_number,
    block_number,
    street_number,
    land_size,
    purpose,
    isLandDeveloped,
    isLandForMining,
    landPurpose,
    signature,
  } = req.body;

  //   if (
  //     !fullname ||
  //     !age ||
  //     !birth_cert ||
  //     !phone ||
  //     !email ||
  //     !nationality ||
  //     !state ||
  //     !occupation ||
  //     !post_held ||
  //     !address ||
  //     !land_size ||
  //     !isLandDeveloped ||
  //     !isLandForMining ||
  //     !purpose ||
  //     !signature ||
  //     !user
  //   ) {
  //     throw new customError.BadRequestError(
  //       "All requirement parameter are compulsory"
  //     );
  //   }
  await Requirements.create(req.body);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Requirements submitted Successfully",
  });
};

//Get all submitted requirements by Stage
const getAllSubmittedRequirementByAdminLevel = async (req, res) => {
  const adminLevel = req.params.id;
  const allSubmittedRequirement = await Requirements.findOne({
    stage: adminLevel,
  });
  return response(
    res,
    StatusCodes.OK,
    "Items retrieved successfully",
    allSubmittedRequirement
  );
};

//Get all submitted requirements
const getAllSubmittedRequirement = async (req, res) => {
  const allSubmittedRequirement = await Requirements.findOne({});
  return response(
    res,
    StatusCodes.OK,
    "Items retrieved successfully",
    allSubmittedRequirement
  );
};
//Get all submitted requirements by Id
const getSingleSubmittedRequirement = async (req, res) => {
  const documentId = req.params.id;
  console.log(documentId);
  const SubmittedRequirement = await Requirements.findById({
    _id: documentId,
  });
  return response(
    res,
    StatusCodes.OK,
    "Item retrieved successfully",
    SubmittedRequirement
  );
};

module.exports = {
  submitRequirement,
  getAllSubmittedRequirementByAdminLevel,
  getSingleSubmittedRequirement,
  getAllSubmittedRequirement
};
