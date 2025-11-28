const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateur.controller");

// Exemple de routes
router.get("/", utilisateurController.getAll);
router.post("/", utilisateurController.create);
router.post("/register", register);
router.patch("/verify-email", verify);
router.post("/utilisateur", utisateur);

module.exports = router;