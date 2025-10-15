const pool = require("../db");
const { detectConflict } = require("../services/examen.service");

exports.createExamen = async (req, res) => {
  try {
    const examen = req.body;

    // Vérifier conflits
    const conflictCheck = await detectConflict(examen);
    if (conflictCheck.conflict) {
      return res.status(400).json({ error: conflictCheck.message });
    }

    // Si pas de conflit → insérer
    const { filiereid, niveauid, semaine } = req.query;
    const query = `
    INSERT INTO examens (date, heure_debut, heure_fin, matiere, filiere_id, niveau_id, professeur_id, salle_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`;
    const values = [
      examen.date,
      examen.heure_debut,
      examen.heure_fin,
      examen.matiere,
      examen.filiere_id,
      examen.niveau_id,
      examen.professeur_id,
      examen.salle_id
    ];

    const result = await pool.query(query, [filiereid, niveauid, semaine]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la création de l'examen" });
  }
};

exports.getEmplois = (req, res) => {
  res.send('Liste des emplois');
};
exports.createEmploi = (req, res) => {
  res.send('Créer un emploi');
};

exports.getEmploiByFiliere = async (req, res) => {
  try {

    const query = `
      SELECT e.*, p.nom as professeur, s.nom as salle, f.nom as filiere, n.nom as niveau
      FROM examens e
      JOIN professeurs p ON e.professeurid = p.id
      JOIN salles s ON e.salleid = s.id
      JOIN filieres f ON e.filiereid = f.id
      JOIN niveaux n ON e.niveauid = n.id
      WHERE e.filiereid = $1 AND e.niveauid = $2
        AND EXTRACT(WEEK FROM e.date) = $3
      ORDER BY e.date, e.heuredebut
    `;
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération de l'emploi du temps" });
  }
};
