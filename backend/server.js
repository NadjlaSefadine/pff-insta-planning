const express = require('express');
const cors = require('cors');
require('dotenv').config();
const emploiRoutes = require("./routes/emploi");
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/emplois', emploiRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/examens', require('./routes/examens'));
app.use('/api/salles', require('./routes/salles'));
app.use('/api/professeurs', require('./routes/professeurs'));
app.use('/api/filieres', require('./routes/filieres'));
app.use('/api/niveaux', require('./routes/niveaux'));
app.use('/api/matieres', require('./routes/matieres'));
app.use('/api/utilisateurs', require('./routes/utilisateur'));


// Gestion erreurs globales
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
