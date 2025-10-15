const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');


const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
// GET : toutes les salles
router.get('/', auth, async (req, res) => {
  const result = await db.query('SELECT * FROM salles ORDER BY id');
  console.log('GET /salles result count:', result.rows.length);
  
  res.json(result.rows);
});

// POST : créer une salle
router.post('/', auth, async (req, res) => {
  const { code, capacite } = req.body;
  const result = await db.query(
    'INSERT INTO salles(code,capacite) VALUES ($1,$2) RETURNING *',
    [code, capacite]
  );
  res.status(201).json(result.rows[0]);
});

// PATCH : modifier une salle
router.patch('/:id',  async (req, res) => {
  const { code, capacite } = req.body;
  const result = await db.query(
    'UPDATE salles SET code=$1, capacite=$2 WHERE id=$3 RETURNING *',
    [code, capacite, req.params.id]
  );
  if (result.rows.length === 0) return res.status(404).json({ message: 'Salle non trouvée' });
  res.json(result.rows[0]);
});

// DELETE : supprimer une salle
router.delete('/:id', auth, async (req, res) => {
  const result = await db.query('DELETE FROM salles WHERE id=$1 RETURNING *', [req.params.id]);
  if (result.rows.length === 0) return res.status(404).json({ message: 'Salle non trouvée' });
  res.json({ message: 'Salle supprimée' });
});

module.exports = router;