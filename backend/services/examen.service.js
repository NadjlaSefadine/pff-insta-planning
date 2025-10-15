const db = require('../db');

async function checkConflicts(examen) {
  const { professeurId, salleId, date, heureDebut, heureFin } = examen;

  // Vérifier si le professeurs a un autre examen à la même heure
  const profConflict = await db.query(
    `SELECT * FROM examens 
     WHERE professeurId=$1 AND date=$2 
       AND NOT (heureFin <= $3 OR heureDebut >= $4)`,
    [professeurId, date, heureDebut, heureFin]
  );

  if (profConflict.rows.length > 0) {
    return { conflict: true, type: 'professeur', exams: profConflict.rows };
  }

  // Vérifier si la salle est occupée
  const salleConflict = await db.query(
    `SELECT * FROM examens 
     WHERE salleId=$1 AND date=$2
       AND NOT (heureFin <= $3 OR heureDebut >= $4)`,
    [salleId, date, heureDebut, heureFin]
  );

  if (salleConflict.rows.length > 0) {
    return { conflict: true, type: 'salle', exams: salleConflict.rows };
  }

  return { conflict: false };
}
// services/examen.service.js
const pool = require("../db");

/**
 * Vérifie si un examen entre en conflit avec les examens existants
 * @param {Object} examen - Données de l'examen { date, heure_debut, heure_fin, professeur_id, salle_id }
 * @returns {Object} - { conflict: true/false, message: "" }
 */
async function detectConflict(examen) {
  const { date, heure_debut, heure_fin, professeur_id, salle_id } = examen;

  // Vérification conflit professeur
  const profQuery = `
    SELECT * FROM examens 
    WHERE date = $1 
      AND professeur_id = $2
      AND ( (heure_debut, heure_fin) OVERLAPS ($3::time, $4::time) )
  `;
  const profRes = await pool.query(profQuery, [date, professeur_id, heure_debut, heure_fin]);
  if (profRes.rows.length > 0) {
    return { conflict: true, message: "⚠️ Conflit : ce professeur a déjà un examen à cet horaire." };
  }

  // Vérification conflit salle
  const salleQuery = `
    SELECT * FROM examens 
    WHERE date = $1 
      AND salleid = $2
      AND ( (heuredebut, heurefin) OVERLAPS ($3::time, $4::time) )
  `;
  const salleRes = await pool.query(salleQuery, [date, salle_id, heure_debut, heure_fin]);
  if (salleRes.rows.length > 0) {
    return { conflict: true, message: "⚠️ Conflit : cette salle est déjà réservée à cet horaire." };
  }

  // Pas de conflit
  return { conflict: false, message: "✅ Pas de conflit détecté." };
}

module.exports = { detectConflict ,checkConflicts };