const express = require("express");
const router = express.Router();

const {
  submitRequirement
} = require("../controllers/requirementController");

router.post("/submit", submitRequirement);


module.exports = router;
