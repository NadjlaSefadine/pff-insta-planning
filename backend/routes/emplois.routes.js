const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Créer un emploi du temps
router.post('/', auth, async (req, res) => {
  const { semaine, filiereId, niveauId, examens } = req.body; 
  try {
    // Insérer un emploi du temps
    const result = await db.query(
      `INSERT INTO emplois (semaine, filiere_id, niveau_id) 
       VALUES ($1,$2,$3) RETURNING id`,
      [semaine, filiereId, niveauId]
    );

    const emploiId = result.rows[0].id;

    // Lier les examens à cet emploi
    for (const examId of examens) {
      await db.query(
        `UPDATE examens SET emploi_id=$1 WHERE id=$2`,
        [emploiId, examId]
      );
    }

    res.json({ message: "Emploi du temps créé avec succès", emploiId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;