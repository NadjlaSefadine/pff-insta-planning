const express = require("express");
const router = express.Router();
const emploiController = require('../controllers/emploi.Controller');

// Exemple: /api/emplois?filiereid=1&niveauid=2&semaine=36
router.get("/", emploiController.getEmploiByFiliere);

module.exports = router;