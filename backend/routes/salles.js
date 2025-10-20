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
  console.log('GET /salles result rows:', result.rows);
  // log each row id
  console.log('GET /salles row IDs:');
  result.rows.forEach(row => {
    console.log('Salle ID:', row.id);
  });
    
  
  res.json(result.rows);
});

// POST : créer une salle
router.post('/', auth, async (req, res) => {
  const { libelle, type, bloc, capacite } = req.body;
  const result = await db.query(
    'INSERT INTO salles(libelle, type, bloc, capacite) VALUES ($1,$2,$3,$4) RETURNING *',
    [libelle, type, bloc, capacite]
  );
  res.status(201).json(result.rows[0]);
});

// PATCH : modifier une salle
router.patch('/:id',  async (req, res) => {
  console.log('PATCH /salles/:id called with id:', req.params.id);
  console.log('Request body:', req.body);  
  
  const { libelle, type, bloc, capacite } = req.body;
  const result = await db.query(
    'UPDATE salles SET libelle=$1, type=$2, bloc=$3, capacite=$4 WHERE id=$5 RETURNING *',
    [libelle, type, bloc, capacite, req.params.id]
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