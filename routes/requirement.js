const express = require("express");
const router = express.Router();

const {
  submitRequirement,
  getAllSubmittedRequirementByAdminLevel,
  getSingleSubmittedRequirement,
  getAllSubmittedRequirement
} = require("../controllers/requirementController");

router.post("/submit", submitRequirement);
router.get("/getallrequirement/", getAllSubmittedRequirement);
router.get("/getallrequirement/:id", getAllSubmittedRequirementByAdminLevel);
router.get("/getsinglerequirement/:id", getSingleSubmittedRequirement);

module.exports = router;
