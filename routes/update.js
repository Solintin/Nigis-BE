const express = require("express");
const router = express.Router();

const {
  updateTracker
} = require("../controllers/updateController");

router.post("/update", updateTracker);


module.exports = router;
