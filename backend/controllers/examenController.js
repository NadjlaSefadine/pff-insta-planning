const pool = require("../db.js");
const handlePgError = require("../utils/handlePgError.js"); // 👈 import du helper

function chevauchent(d1, f1, d2, f2) {
  return d1 < f2 && f1 > d2;
}

exports.ajouterExamen = async (req, res) => {
  try {
    const {
      matiereId,
      professeurId,
      salleId,
      filiereId,
      date,
      heureDebut,
      heureFin,
      niveauId,
    } = req.body;

    const { rows: examens } = await pool.query(
      "SELECT * FROM examens WHERE date = $1",
      [date]
    );

    const conflit = examens.find(
      (e) =>
        (e.professeurid === professeurId &&
          chevauchent(heureDebut, heureFin, e.heuredebut, e.heurefin)) ||
        (e.salleid === salleId &&
          chevauchent(heureDebut, heureFin, e.heuredebut, e.heurefin))
    );

    if (conflit) {
      return res.status(400).json({
        message:
          "⚠️ Conflit détecté : le professeur ou la salle est déjà occupé sur ce créneau.",
      });
    }

    await pool.query(
      `INSERT INTO examens (matiereid, professeurid, salleid, filiereid, date, heuredebut, heurefin, niveauid)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [matiereId, professeurId, salleId, filiereId, date, heureDebut, heureFin, niveauId]
    );

    res.status(201).json({ message: "✅ Examen ajouté avec succès !" });
  } catch (err) {
    return handlePgError(err, res); // 👈 Utilisation du helper ici
  }
};

// Nouveau endpoint pour vérifier les conflits
exports.checkConflitExamen = async (req, res) => {
  try {
    const { professeur, salle, date, heure_debut, heure_fin } = req.body;
    const { rows: examens } = await pool.query("SELECT * FROM examens WHERE date = $1", [date]);

    const conflitProf = examens.find(e =>
      e.professeur === professeur && chevauchent(heure_debut, heure_fin, e.heure_debut, e.heure_fin)
    );
    const conflitSalle = examens.find(e =>
      e.salle === salle && chevauchent(heure_debut, heure_fin, e.heure_debut, e.heure_fin)
    );

    if (conflitProf) {
      return res.json({ conflict: true, message: "Conflit: Professeur déjà programmé à cette heure." });
    }
    if (conflitSalle) {
      return res.json({ conflict: true, message: "Conflit: Salle déjà occupée à cette heure." });
    }
    return res.json({ conflict: false, message: "Pas de conflit." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ conflict: true, message: "Erreur serveur" });
  }
};
