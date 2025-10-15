const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET : tous les niveaux
router.get('/', auth, async (req, res) => {
  const result = await db.query('SELECT * FROM niveaux ORDER BY filiere_id, code');
  res.json(result.rows);
});

// POST : créer un niveau
router.post('/', auth, async (req, res) => {
  const { filiere_id, code } = req.body;
  const result = await db.query(
    'INSERT INTO niveaux(filiere_id,code) VALUES ($1,$2) RETURNING *',
    [filiere_id, code]
  );
  res.status(201).json(result.rows[0]);
});

// PATCH : modifier un niveau
router.patch('/:id', auth, async (req, res) => {
  const { filiere_id, code } = req.body;
  const result = await db.query(
    'UPDATE niveaux SET filiere_id=$1, code=$2 WHERE id=$3 RETURNING *',
    [filiere_id, code, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ message: 'Niveau non trouvé' });
  res.json(result.rows[0]);
});

// DELETE : supprimer un niveau
router.delete('/:id', auth, async (req, res) => {
  const result = await db.query('DELETE FROM niveaux WHERE id=$1 RETURNING *', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Niveau non trouvé' });
  res.json({ message: 'Niveau supprimé' });
});

module.exports = router;