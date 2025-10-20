const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");

router.post("/", async (req, res) => {
  const { civilite, nom, prenom, tel, email, login, password, profil } =
    req.body;

  // const nomComplet = `${nom} ${prenom}`;
  const role =
    profil === "Admin"
      ? "admin"
      : profil === "Enseignant"
      ? "enseignant"
      : "etudiant";

  // Vérification simple
  if (!nom || !prenom || !email || !login || !password) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }
  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(password, 10);

  // Simule l'ajout (remplace ça avec une vraie insertion en DB)
  console.log("Nouvel utilisateur reçu :", req.body);
  try {
    const resultat = await pool.query(
      "INSERT INTO utilisateurs (civilite, nom, prenom, tel, email, login, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [civilite, nom, prenom, tel, email, login, hashedPassword, role]
    );
    res
      .status(201)
      .json({
        message: "Utilisateur ajouté avec succès.",
        utlisateur: resultat.rows[0],
      });
  } catch (error) {
    console.error("Erreur lors de l'insertion :", error.message);
    res.status(500).json("Erreur serveur");
  }
});

// Route pour ajouter un utilisateur
// const ajouterUtilisateur = async (req, res) => {
//   const { nom, email } = req.body;

//   try {
//     const resultat = await pool.query(
//       'INSERT INTO utilisateurs (nom, email) VALUES ($1, $2) RETURNING *',
//       [nom, email]
//     );
//     res.status(201).json(resultat.rows[0]);
//   } catch (error) {
//     console.error("Erreur lors de l'insertion :", error.message);
//     res.status(500).send('Erreur serveur');
//   }
// };
// router.post('/add', ajouterUtilisateur);

// Récuperer tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const resultat = await pool.query("SELECT * FROM utilisateurs ORDER BY id");
    res.json(resultat.rows);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs :",
      error.message
    );
    res.status(500).send("Erreur serveur");
  }
});

module.exports = router;
