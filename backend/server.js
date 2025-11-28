const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.js');
const examenRoutes = require('./routes/examenRoutes.js');
const sallesRoutes = require('./routes/salles.js');
const professeursRoutes = require('./routes/professeurs.js');
const filieresRoutes = require('./routes/filieres.js');
const niveauxRoutes = require('./routes/niveaux.js');
const matieresRoutes = require('./routes/matieres.js');
const utilisateurRoutes = require('./routes/utilisateur.js');

require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/examens', examenRoutes);
app.use('/api/salles', sallesRoutes);
app.use('/api/professeurs', professeursRoutes);
app.use('/api/filieres', filieresRoutes);
app.use('/api/niveaux', niveauxRoutes);
app.use('/api/matieres', matieresRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);

// Gestion erreurs globales
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
