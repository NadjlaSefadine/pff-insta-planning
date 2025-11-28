const express =require('express');
const router = express.Router();
const pool =require("../db.js");
const auth =require("../middleware/auth.js");
// const express = require('express');
// const router = express.Router();
// const db = require('../db');
// const auth = require('../middleware/auth');

// GET : toutes les matières
router.get('/', auth, async (req, res) => {
  const result = await pool.query('SELECT * FROM matieres ORDER BY id');
  res.json(result.rows);
});

// POST : créer une matière
router.post('/', auth, async (req, res) => {
  const { code, nom, is_tronc_commun } = req.body;
  const result = await pool.query(
    'INSERT INTO matieres(code,nom,is_tronc_commun) VALUES ($1,$2,$3) RETURNING *',
    [code, nom, is_tronc_commun]
  );
  res.status(201).json(result.rows[0]);
});

// PATCH : modifier une matière
router.patch('/:id', auth, async (req, res) => {
  const { code, nom, is_tronc_commun } = req.body;
  const result = await pool.query(
    'UPDATE matieres SET code=$1, nom=$2, is_tronc_commun=$3 WHERE id=$4 RETURNING *',
    [code, nom, is_tronc_commun, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ message: 'Matière non trouvée' });
  res.json(result.rows[0]);
});

// DELETE : supprimer une matière
router.delete('/:id', auth, async (req, res) => {
  const result = await pool.query('DELETE FROM matieres WHERE id=$1 RETURNING *', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Matière non trouvée' });
  res.json({ message: 'Matière supprimée' });
});

module.exports = router;