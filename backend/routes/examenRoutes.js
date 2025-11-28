const express = require("express");
const {
  ajouterExamen,
  checkConflitExamen,
} = require("../controllers/examenController.js");
const router = express.Router();

router.post("/", ajouterExamen);
router.post("/check-conflict", checkConflitExamen);

module.exports = router;
