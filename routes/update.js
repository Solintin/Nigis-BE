const express = require("express");
const router = express.Router();

const {
  updateTracker,
  getUserTracker,
} = require("../controllers/updateController");

router.post("/update", updateTracker);
router.get("/tracker/:id", getUserTracker);

module.exports = router;
