const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// GET : tous les professeurs
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM professeurs ORDER BY id");
    console.log("GET /professeurs result count:", result.rows.length);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur lors du GET /professeurs:", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
});

// GET : un professeur
router.get("/:id", auth, async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM professeurs WHERE id=$1", [
      req.params.id,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Professeur non trouvé" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur GET /professeurs/:id:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération du professeur",
    });
  }
});

// POST : créer un professeur
router.post("/", auth, async (req, res) => {
  try {
    const { nom, email, password, confirmPassword } = req.body;
    // check password confirmation
    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Les mots de passe ne correspondent pas" });
    }

    const result = await db.query(
      "INSERT INTO professeurs(nom, email, password) VALUES ($1, $2, $3) RETURNING *",
      [nom, email, password]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur lors du POST /professeurs:", error);
    res.status(500).json({ message: "Erreur serveur interne" });
  }
});

// PATCH : modifier un professeur
router.patch("/:id", auth, async (req, res) => {
  try {
    const { nom, email, actif } = req.body;
    const result = await db.query(
      "UPDATE professeurs SET nom=$1, email=$2, actif=$3 WHERE id=$4 RETURNING *",
      [nom, email, actif, req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Professeur non trouvé" });
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erreur PATCH /professeurs/:id:", error);
    res.status(8000).json({
      message: "Erreur serveur lors de la modification du professeur",
    });
  }
});

// DELETE : supprimer un professeur
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await db.query(
      "DELETE FROM professeurs WHERE id=$1 RETURNING *",
      [req.params.id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Professeur non trouvé" });
    res.json({ message: "Professeur supprimé" });
  } catch (error) {
    console.error("Erreur DELETE /professeurs/:id:", error);
    res
      .status(8000)
      .json({ message: "Erreur serveur lors de la suppression du professeur" });
  }
});

module.exports = router;
