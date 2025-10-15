const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET : toutes les filières
router.get('/', auth, async (req, res) => {
  const result = await db.query('SELECT * FROM filieres ORDER BY id');
  res.json(result.rows);
});

// GET : une filière
router.get('/:id', auth, async (req, res) => {
  const result = await db.query('SELECT * FROM filieres WHERE id=$1', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Filière non trouvée' });
  res.json(result.rows[0]);
});

// POST : créer une filière
router.post('/', auth, async (req, res) => {
  const { code, nom } = req.body;
  const result = await db.query(
    'INSERT INTO filieres(code,nom) VALUES ($1,$2) RETURNING *',
    [code, nom]
  );
  res.status(201).json(result.rows[0]);
});

// PATCH : modifier une filière
router.patch('/:id', auth, async (req, res) => {
  const { code, nom } = req.body;
  const result = await db.query(
    'UPDATE filieres SET code=$1, nom=$2 WHERE id=$3 RETURNING *',
    [code, nom, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ message: 'Filière non trouvée' });
  res.json(result.rows[0]);
});

// DELETE : supprimer une filière
router.delete('/:id', auth, async (req, res) => {
  const result = await db.query('DELETE FROM filieres WHERE id=$1 RETURNING *', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Filière non trouvée' });
  res.json({ message: 'Filière supprimée' });
});

module.exports = router;