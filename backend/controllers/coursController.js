const { pool } = require("../db.js");

function chevauchent(d1, f1, d2, f2) {
  return d1 < f2 && f1 > d2;
}

exports.ajouterCours = async (req, res) => {
  try {
    const { matiere, professeur, salle, filiere, jour, heure_debut, heure_fin } = req.body;

    const { rows: cours } = await pool.query("SELECT * FROM cours WHERE jour = $1", [jour]);

    const conflit = cours.find(c =>
      (c.professeur === professeur && chevauchent(heure_debut, heure_fin, c.heure_debut, c.heure_fin)) ||
      (c.salle === salle && chevauchent(heure_debut, heure_fin, c.heure_debut, c.heure_fin))
    );

    if (conflit) {
      return res.status(400).json({ message: "⚠️ Conflit détecté : professeur ou salle déjà occupé." });
    }

    await pool.query(
      `INSERT INTO cours (matiere, professeur, salle, filiere, jour, heure_debut, heure_fin)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [matiere, professeur, salle, filiere, jour, heure_debut, heure_fin]
    );

    res.status(201).json({ message: "✅ Cours ajouté avec succès !" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
